# Requirements Document

## Introduction

This feature introduces a dynamic, database-driven Category & Subcategory management system for the Dada Exports platform. It replaces the hardcoded category string enums on the `B2BProduct` and `RetailProduct` Mongoose models with a reference to a new shared `Category` collection. Category and subcategory images are uploaded to **Cloudflare Images** (not stored locally or as base64 in MongoDB) — only the resulting CDN URL is persisted. A full CRUD admin panel page is added at `/admin/categories`, matching the existing clean, minimal admin UI design. The category data is also exposed for use on the B2B and Retail frontends (e.g. category browsing sections). Both sites share the same `Category` collection, with each document carrying a `sites` field to control visibility per storefront.

---

## Glossary

- **Category_Model**: The Mongoose model backed by the shared `categories` MongoDB collection, located at `src/models/shared/Category.js`.
- **Category**: A top-level content grouping (e.g. "Dresses", "Tops") that belongs to one or more sites and may carry an image URL.
- **Subcategory**: A nested content grouping stored as an embedded sub-document inside a parent Category document. Each Subcategory may also carry its own image URL.
- **Slug**: A URL-safe, lowercase, hyphenated string identifier derived from a name (e.g. "Bottom Wear" → "bottom-wear"). Used as the stable reference key on product documents.
- **Site**: One of the two storefronts — `b2b` (Dada Exports wholesale) or `retail` (Iveara e-commerce).
- **Cloudflare_Images**: The Cloudflare Images CDN service used for all category and subcategory image storage. Images are uploaded via a two-step direct-upload flow: the backend requests a signed upload URL from Cloudflare, the browser posts the file directly to that URL, and the returned CDN delivery URL is stored in the database.
- **Upload_URL**: A one-time, time-limited signed URL issued by the Cloudflare Images API (`/client/v4/accounts/{accountId}/images/v2/direct_upload`) that authorises a single file upload from the browser.
- **Image_URL**: The permanent Cloudflare CDN delivery URL returned after a successful upload, stored in the `image` field of a Category or Subcategory document. Format: `https://imagedelivery.net/{accountHash}/{imageId}/public`.
- **Admin_API**: The set of REST route handlers under `/api/admin/categories` protected by admin session.
- **Admin_Panel**: The Next.js page rendered at `/admin/categories` used by administrators to manage categories.
- **Category_Controller**: The business-logic module at `src/controllers/admin/categoryController.js`.
- **Cloudflare_Controller**: The business-logic module at `src/controllers/admin/cloudflareController.js` responsible for requesting Cloudflare upload URLs.
- **Soft_Delete**: Setting `isActive: false` on a document rather than physically removing it from the database.
- **B2BProduct**: The existing Mongoose model at `src/models/b2b/B2BProduct.js`.
- **RetailProduct**: The existing Mongoose model at `src/models/retail/RetailProduct.js`.
- **AdminDashboard**: The existing React component at `src/components/admin/AdminDashboard.jsx`.
- **Public_Category_API**: The read-only REST route handlers under `/api/categories` accessible without authentication, used by the B2B and Retail frontends.

---

## Requirements

### Requirement 1: Category Mongoose Model

**User Story:** As a developer, I want a shared Mongoose model for categories and subcategories, so that both the B2B and Retail sites read from a single MongoDB collection and each category document can carry an image URL from Cloudflare.

#### Acceptance Criteria

1. THE Category_Model SHALL define a `categories` MongoDB collection with the following required top-level fields: `name` (String, required), `slug` (String, unique, required), `sites` (Array of Strings, each value restricted to `['b2b', 'retail']`, required, minimum one element), `isActive` (Boolean, default `true`), `order` (Number, default `0`), and `createdAt` (Date, default `Date.now`).
2. THE Category_Model SHALL define the following optional top-level fields: `description` (String) and `image` (String) — where `image` stores a Cloudflare CDN delivery URL.
3. THE Category_Model SHALL define an embedded `subcategories` array field where each element contains: `name` (String, required), `slug` (String, required), `image` (String, optional — Cloudflare CDN URL), `isActive` (Boolean, default `true`), and `order` (Number, default `0`).
4. WHEN a Category document is saved, THE Category_Model SHALL enforce that the `slug` field is unique across the entire `categories` collection.
5. THE Category_Model SHALL be located at `src/models/shared/Category.js` and follow the existing project model file conventions established in `BACKEND_ARCHITECTURE.md`.

---

### Requirement 2: Automatic Slug Generation

**User Story:** As an admin, I want category and subcategory slugs to be generated automatically from the name, so that they are always consistent and URL-safe without manual input.

#### Acceptance Criteria

1. WHEN a Category is created without an explicit `slug` value, THE Category_Controller SHALL derive the slug by converting the `name` to lowercase and replacing all spaces and non-alphanumeric characters with hyphens, then collapsing consecutive hyphens into one and trimming leading or trailing hyphens (e.g. "Bottom Wear" → "bottom-wear", "Home & Lifestyle" → "home-lifestyle").
2. WHEN a Subcategory is created without an explicit `slug` value, THE Category_Controller SHALL apply the same derivation rule to the subcategory `name`.
3. WHEN the derived slug conflicts with an existing slug in the `categories` collection, THE Category_Controller SHALL append a numeric suffix starting at `-2` (e.g. "dresses-2", "dresses-3") and increment until a unique slug is found.
4. FOR ALL valid non-empty category name strings, the slug derivation function SHALL produce a non-empty string containing only lowercase letters, digits, and hyphens, with no leading or trailing hyphens and no consecutive hyphens (slug format invariant).

---

### Requirement 3: Cloudflare Images — Upload URL Endpoint

**User Story:** As an admin, I want the backend to provide a signed upload URL from Cloudflare Images, so that images can be uploaded directly from the browser to Cloudflare without routing large files through the Next.js server.

#### Acceptance Criteria

1. WHEN a `POST /api/admin/cloudflare/upload-url` request is received with a valid admin session, THE Admin_API SHALL call the Cloudflare Images direct upload API (`https://api.cloudflare.com/client/v4/accounts/{accountId}/images/v2/direct_upload`) using the `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_IMAGES_API_TOKEN` environment variables, and return `{ success: true, data: { uploadURL: "<one-time-url>", id: "<imageId>" } }` with HTTP status 200.
2. IF the Cloudflare API call fails or returns an error, THEN THE Admin_API SHALL return `{ success: false, error: "Failed to get upload URL" }` with HTTP status 502.
3. IF a `POST /api/admin/cloudflare/upload-url` request is received without a valid admin session, THEN THE Admin_API SHALL return `{ success: false, error: "Unauthorized" }` with HTTP status 401.
4. THE Cloudflare_Controller SHALL read `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_IMAGES_API_TOKEN` exclusively from environment variables and SHALL NOT hardcode these values in source code.
5. WHEN a valid upload URL is returned, THE Admin_Panel client SHALL POST the selected image file as `multipart/form-data` directly to the returned `uploadURL`, then construct the delivery URL as `https://imagedelivery.net/{CLOUDFLARE_ACCOUNT_HASH}/{imageId}/public` using the `NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH` environment variable, and store that delivery URL in the category or subcategory `image` field.

---

### Requirement 4: Category CRUD API — List and Read

**User Story:** As an admin, I want to list all categories and retrieve a single category by slug, so that the admin panel can display up-to-date data.

#### Acceptance Criteria

1. WHEN a `GET /api/admin/categories` request is received with a valid admin session, THE Admin_API SHALL return `{ success: true, data: [...] }` containing all Category documents sorted by `order` ascending, then `createdAt` descending.
2. WHEN a `GET /api/admin/categories` request includes a `site` query parameter with value `b2b` or `retail`, THE Admin_API SHALL return only categories whose `sites` array contains the specified value.
3. WHEN a `GET /api/admin/categories` request includes the query parameter `includeInactive=true`, THE Admin_API SHALL include Category documents where `isActive` is `false`; without that parameter THE Admin_API SHALL return only active categories.
4. WHEN a `GET /api/admin/categories/[slug]` request is received with a valid admin session and the slug matches an existing document, THE Admin_API SHALL return `{ success: true, data: <document> }` with HTTP status 200; WHEN no document matches the slug, THE Admin_API SHALL return `{ success: false, error: "Not found" }` with HTTP status 404.
5. IF a request to any `/api/admin/categories` endpoint is received without a valid admin session, THEN THE Admin_API SHALL return `{ success: false, error: "Unauthorized" }` with HTTP status 401.

---

### Requirement 5: Category CRUD API — Create

**User Story:** As an admin, I want to create new categories via the API, so that new product groupings can be added without code changes or deployments.

#### Acceptance Criteria

1. WHEN a `POST /api/admin/categories` request is received with a valid admin session and a body containing at least `name` (non-empty string) and `sites` (non-empty array of valid site values), THE Admin_API SHALL create a new Category document and return `{ success: true, data: <created document> }` with HTTP status 201.
2. WHEN a `POST /api/admin/categories` request body omits `name` or provides an empty string, THE Admin_API SHALL return `{ success: false, error: "Name is required" }` with HTTP status 400.
3. WHEN a `POST /api/admin/categories` request body omits `sites` or provides an empty array, THE Admin_API SHALL return `{ success: false, error: "At least one site is required" }` with HTTP status 400.
4. IF the derived slug from the submitted name already exists in the collection, THEN THE Admin_API SHALL automatically append a numeric suffix to produce a unique slug rather than returning an error.
5. WHEN a `POST /api/admin/categories` request body includes a `subcategories` array, THE Admin_API SHALL create the subcategories as embedded documents and auto-generate slugs for any subcategory missing an explicit `slug` field.
6. WHEN a `POST /api/admin/categories` request body includes an `image` field containing a non-empty string, THE Admin_API SHALL store the value as the Cloudflare CDN delivery URL on the new Category document without modification.

---

### Requirement 6: Category CRUD API — Update

**User Story:** As an admin, I want to update existing categories, so that names, sites, descriptions, images, and subcategories can be kept current.

#### Acceptance Criteria

1. WHEN a `PUT /api/admin/categories/[slug]` request is received with a valid admin session and a valid request body, THE Admin_API SHALL update the matching Category document with the provided fields and return `{ success: true, data: <updated document> }` with HTTP status 200.
2. WHEN a `PUT /api/admin/categories/[slug]` request is received for a slug that does not match any existing document, THE Admin_API SHALL return `{ success: false, error: "Not found" }` with HTTP status 404.
3. WHEN a `PUT /api/admin/categories/[slug]` request body contains a `name` change, THE Admin_API SHALL NOT automatically update the `slug` field to preserve existing product references; the `slug` SHALL remain unchanged unless it is explicitly provided as a different value in the request body.
4. WHEN a `PUT /api/admin/categories/[slug]` request body contains a `subcategories` array, THE Admin_API SHALL replace the entire subcategories array and auto-generate slugs for any new subcategory element that omits a `slug` field.
5. WHEN a `PUT /api/admin/categories/[slug]` request body does not include a particular top-level field, THE Admin_API SHALL leave that field unchanged on the stored document (partial update semantics).
6. WHEN a `PUT /api/admin/categories/[slug]` request body contains an `image` field set to an empty string or `null`, THE Admin_API SHALL clear the `image` field on the stored document.

---

### Requirement 7: Category CRUD API — Soft Delete and Restore

**User Story:** As an admin, I want to deactivate and restore categories without permanent deletion, so that existing product references are never orphaned.

#### Acceptance Criteria

1. WHEN a `DELETE /api/admin/categories/[slug]` request is received with a valid admin session, THE Admin_API SHALL set `isActive` to `false` on the matching Category document and return `{ success: true, data: <updated document> }` with HTTP status 200.
2. THE Admin_API SHALL NOT physically remove any Category document from the database in response to a `DELETE` request.
3. WHEN a `PATCH /api/admin/categories/[slug]/restore` request is received with a valid admin session, THE Admin_API SHALL set `isActive` to `true` on the matching Category document and return `{ success: true, data: <updated document> }` with HTTP status 200.
4. WHEN a `DELETE /api/admin/categories/[slug]` request is applied to a Category that is already inactive (`isActive: false`), THE Admin_API SHALL respond with `{ success: true, data: <document> }` and HTTP status 200 without returning an error (idempotent soft-delete behaviour).
5. IF a `DELETE` or `PATCH /restore` request is received for a slug that does not exist, THEN THE Admin_API SHALL return `{ success: false, error: "Not found" }` with HTTP status 404.

---

### Requirement 8: Category Controller (Business Logic)

**User Story:** As a developer, I want all category business logic isolated in a dedicated controller module, so that the MVC pattern is preserved and route handlers remain thin.

#### Acceptance Criteria

1. THE Category_Controller SHALL be located at `src/controllers/admin/categoryController.js` and export the following named async functions: `listCategories`, `getCategoryBySlug`, `createCategory`, `updateCategory`, `deactivateCategory`, and `restoreCategory`.
2. THE Category_Controller SHALL call `connectDB()` from `src/lib/db.js` at the start of each exported function before any database operation.
3. THE Category_Controller SHALL perform all input validation (required fields, site enum values) and throw descriptive `Error` instances with human-readable messages that route handlers can catch and forward as 4xx responses.
4. THE Category_Controller `createCategory` function SHALL invoke the slug auto-generation and uniqueness-checking logic defined in Requirement 2 before persisting the document.
5. THE Category_Controller SHALL not contain any HTTP-specific code such as `NextResponse`, `request`, or `response` objects; all HTTP concerns belong exclusively in route handlers.

---

### Requirement 9: Cloudflare Controller (Business Logic)

**User Story:** As a developer, I want all Cloudflare Images integration logic isolated in a dedicated controller, so that route handlers remain thin and Cloudflare credentials are accessed only through environment variables.

#### Acceptance Criteria

1. THE Cloudflare_Controller SHALL be located at `src/controllers/admin/cloudflareController.js` and export a named async function `getUploadUrl` that calls the Cloudflare Images `v2/direct_upload` endpoint and returns the `uploadURL` and `id` fields from the Cloudflare response.
2. THE Cloudflare_Controller SHALL read `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_IMAGES_API_TOKEN` from `process.env` and SHALL throw a descriptive `Error` if either variable is missing or empty.
3. THE Cloudflare_Controller `getUploadUrl` function SHALL throw an `Error` with the message "Cloudflare upload URL request failed" when the Cloudflare API returns a non-2xx HTTP status.
4. THE Cloudflare_Controller SHALL not contain any HTTP-specific code; that concern belongs to the route handler at `src/app/api/admin/cloudflare/upload-url/route.js`.

---

### Requirement 10: Replace Hardcoded Category Enum — B2BProduct

**User Story:** As a developer, I want the B2BProduct model to accept any string for the category field, so that dynamically managed categories are immediately reflected in product data without code deployments.

#### Acceptance Criteria

1. THE B2BProduct model SHALL change the `category` field definition from `{ type: String, enum: [...], required: true }` to `{ type: String, required: true }`, removing the hardcoded enum constraint.
2. WHEN a B2BProduct document is saved with any string `category` value, THE B2BProduct model SHALL accept it without a Mongoose validation error (category string validation is the responsibility of admin forms, not the schema).
3. THE existing B2BProduct documents in MongoDB SHALL retain their current `category` string values after the schema change without requiring a data migration script.

---

### Requirement 11: Replace Hardcoded Category Enum — RetailProduct

**User Story:** As a developer, I want the RetailProduct model to accept any string for the category field, so that dynamically managed categories are immediately reflected in retail product data without code deployments.

#### Acceptance Criteria

1. THE RetailProduct model SHALL change the `category` field definition from `{ type: String, enum: [...], required: true }` to `{ type: String, required: true }`, removing the hardcoded enum constraint.
2. WHEN a RetailProduct document is saved with any string `category` value, THE RetailProduct model SHALL accept it without a Mongoose validation error.
3. THE existing RetailProduct documents in MongoDB SHALL retain their current `category` string values after the schema change without requiring a data migration script.
4. WHERE admin product create/edit forms for RetailProduct exist, THE Admin_Panel SHALL populate the category dropdown by fetching from `GET /api/admin/categories?site=retail&includeInactive=false` rather than using a hardcoded list.

---

### Requirement 12: Admin Panel — Category List Page

**User Story:** As an admin, I want a page at `/admin/categories` that lists all categories with images, status, site assignments, and subcategory count, so that I can manage the entire category hierarchy from one place.

#### Acceptance Criteria

1. WHEN an authenticated admin navigates to `/admin/categories`, THE Admin_Panel SHALL render a list of all Category documents (including inactive ones), with each row displaying: category image thumbnail (or a placeholder if no image), name, slug, assigned sites as badge chips, subcategory count, active/inactive status badge, and action buttons (Edit, Deactivate/Restore).
2. WHEN the category list page loads, THE Admin_Panel SHALL fetch data from `GET /api/admin/categories?includeInactive=true` and display a loading skeleton while the request is in flight.
3. WHEN the category list contains no documents, THE Admin_Panel SHALL display an empty-state message: "No categories yet. Create your first category."
4. WHEN an admin clicks "Deactivate" on an active category row, THE Admin_Panel SHALL call `DELETE /api/admin/categories/[slug]`, update the row status inline without a full page reload, and display a toast notification confirming the change.
5. WHEN an admin clicks "Restore" on an inactive category row, THE Admin_Panel SHALL call `PATCH /api/admin/categories/[slug]/restore`, update the row status inline without a full page reload, and display a toast notification confirming the change.
6. THE `/admin/categories` page SHALL redirect unauthenticated visitors to `/admin/login` using the existing admin session guard.
7. THE Admin_Panel SHALL add a "Categories" navigation link with an appropriate icon to the sidebar `NAV` array in `AdminDashboard.jsx` pointing to `/admin/categories`.
8. THE Admin_Panel category list page SHALL match the existing clean, minimal admin UI style: `bg-[#F7F4F1]` page background, white `rounded-2xl` card containers, `#95565E` primary colour for buttons and highlights, and `ring-1 ring-gray-100 shadow-sm` card styling consistent with `AdminDashboard.jsx`.

---

### Requirement 13: Admin Panel — Create and Edit Category Form with Image Upload

**User Story:** As an admin, I want a form to create and edit categories and subcategories, including uploading images to Cloudflare, so that I can manage the full visual category hierarchy without leaving the admin panel.

#### Acceptance Criteria

1. WHEN an admin clicks "Add Category" on the category list page, THE Admin_Panel SHALL display a modal or slide-over panel containing a form with the following fields: Name (text input, required), Description (textarea, optional), Sites (multi-checkbox for `b2b` and `retail`, at least one required), Category Image (file input, optional), Order (number input, optional, default 0), and a dynamic Subcategories section.
2. WHEN an admin selects an image file using the Category Image file input, THE Admin_Panel SHALL immediately request a Cloudflare upload URL from `POST /api/admin/cloudflare/upload-url`, upload the file directly from the browser to the returned `uploadURL` as `multipart/form-data`, construct the delivery URL from `NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH` and the returned `id`, display an inline image preview, and populate a hidden field with the delivery URL.
3. WHILE a category image upload is in progress, THE Admin_Panel SHALL display a loading indicator on the image upload area and disable the form submit button to prevent submission with an incomplete image URL.
4. IF the Cloudflare upload request fails, THEN THE Admin_Panel SHALL display an inline error message "Image upload failed. Please try again." and allow the admin to retry or proceed without an image.
5. WHEN an admin fills in the Name field and moves focus away, THE Admin_Panel SHALL display a read-only slug preview beneath the Name field showing the auto-generated slug.
6. WHEN an admin clicks "Add Subcategory" within the form, THE Admin_Panel SHALL append a new subcategory row with fields: Name (text, required), Subcategory Image (file input, optional), Order (number, optional), and a remove button; the image upload behaviour for subcategory images SHALL follow the same Cloudflare flow described in acceptance criterion 2.
7. WHEN an admin submits the create form with all required fields valid, THE Admin_Panel SHALL call `POST /api/admin/categories`, display a success toast, and refresh the category list.
8. IF the create form is submitted while the Name field is empty, THEN THE Admin_Panel SHALL display an inline validation error "Name is required" and SHALL NOT submit the API request.
9. IF the create form is submitted with no site checkbox selected, THEN THE Admin_Panel SHALL display an inline validation error "Select at least one site" and SHALL NOT submit the API request.
10. WHEN an admin clicks "Edit" on a category row, THE Admin_Panel SHALL populate the form with the existing category data — including showing the current image as a preview — and submit the updated data via `PUT /api/admin/categories/[slug]` on save.
11. WHEN an admin edits a category that already has an image and uploads a new image via the file input, THE Admin_Panel SHALL replace the old delivery URL in the hidden field with the new one before submitting; the old Cloudflare image SHALL remain in the Cloudflare account (no deletion required).
12. WHEN the edit form is submitted successfully, THE Admin_Panel SHALL display a success toast and reflect the updated data in the list without a full page reload.

---

### Requirement 14: Public Category API for Frontends

**User Story:** As a frontend developer, I want public read-only API endpoints that return active categories per site with their images, so that the B2B and Retail frontends can display a category browsing section without admin authentication.

#### Acceptance Criteria

1. WHEN a `GET /api/categories?site=b2b` request is received, THE Public_Category_API SHALL return `{ success: true, data: [...] }` containing all Category documents where `isActive` is `true` and `sites` contains `"b2b"`, sorted by `order` ascending, including the `image`, `name`, `slug`, and `subcategories` fields.
2. WHEN a `GET /api/categories?site=retail` request is received, THE Public_Category_API SHALL return `{ success: true, data: [...] }` containing all Category documents where `isActive` is `true` and `sites` contains `"retail"`, sorted by `order` ascending.
3. WHEN a `GET /api/categories?site=b2b` request is received and no active B2B categories exist, THE Public_Category_API SHALL return `{ success: true, data: [] }` with HTTP status 200 rather than an error.
4. IF the `site` query parameter is omitted from a `GET /api/categories` request, THEN THE Public_Category_API SHALL return `{ success: false, error: "site parameter is required" }` with HTTP status 400.
5. THE Public_Category_API SHALL NOT require authentication; it SHALL be accessible from browser-side `fetch` calls in B2B and Retail Next.js page components.
6. THE Public_Category_API route handler SHALL be located at `src/app/api/categories/route.js` and call a `getPublicCategories` function exported from `src/controllers/shared/categoryController.js`.

---

### Requirement 15: Frontend Category Browsing Component

**User Story:** As a site visitor, I want to browse products by category with images on the B2B and Retail homepages, so that I can quickly navigate to the products I am looking for.

#### Acceptance Criteria

1. THE Admin_Panel SHALL expose the category image URLs via the Public_Category_API so that B2B and Retail frontend components can render category cards with the Cloudflare-hosted images.
2. WHEN a `CategoryGrid` component is rendered on the B2B or Retail frontend and a category has a non-empty `image` URL, THE CategoryGrid SHALL display the category image using a Next.js `<Image>` component with the Cloudflare delivery domain added to the `next.config.mjs` `images.remotePatterns` configuration.
3. WHEN a `CategoryGrid` component is rendered and a category has no `image` URL, THE CategoryGrid SHALL display a styled placeholder element with the category name centred over a solid background colour instead of the image.
4. WHEN a visitor clicks a category card in the `CategoryGrid`, THE CategoryGrid SHALL navigate to the appropriate filtered product listing page using the category slug (e.g. `/b2b/products?category=dresses` or `/retail/products?category=dresses`).
5. THE `CategoryGrid` component for B2B SHALL be located at `src/components/b2b/CategoryGrid.jsx` and the Retail equivalent at `src/components/retail/CategoryGrid.jsx`; both SHALL fetch their data from the Public_Category_API on the server side (Next.js Server Component or `getServerSideProps` equivalent using `fetch`).

---

### Requirement 16: Seed Data for Existing Categories

**User Story:** As a developer, I want a seed script that migrates the existing hardcoded category values into the new Category collection, so that the transition from enums to dynamic categories does not break existing product filtering.

#### Acceptance Criteria

1. THE seed script SHALL create the following B2B-specific categories with `sites: ['b2b']` and `isActive: true`: "Dresses" (slug: `dresses-b2b`), "Tops" (slug: `tops-b2b`), "Bottom Wear" (slug: `bottom-wear-b2b`), "Accessories" (slug: `accessories-b2b`), "Home & Lifestyle" (slug: `home-lifestyle`).
2. THE seed script SHALL create the following Retail-specific categories with `sites: ['retail']` and `isActive: true`: "Mens" (slug: `mens`), "Kids" (slug: `kids`).
3. THE seed script SHALL create the following shared categories with `sites: ['b2b', 'retail']` and `isActive: true`: "Dresses" (slug: `dresses`), "Tops" (slug: `tops`), "Bottom Wear" (slug: `bottom-wear`), "Accessories" (slug: `accessories`).
4. WHEN the seed script is executed against a database that already contains a Category document with the same slug, THE seed script SHALL skip that document without modification, making the script safe to re-run without corrupting existing data.
5. THE seed script SHALL be located at `src/scripts/seedCategories.js` and executable via `node src/scripts/seedCategories.js` after setting `MONGODB_URI` in the environment.

---

### Requirement 17: Environment Variable Configuration for Cloudflare Images

**User Story:** As a developer, I want all Cloudflare Images credentials and configuration defined as environment variables, so that they are never hardcoded in source code and can be rotated without a deployment.

#### Acceptance Criteria

1. THE application SHALL read the following server-side environment variables for Cloudflare Images integration: `CLOUDFLARE_ACCOUNT_ID` (the Cloudflare account identifier) and `CLOUDFLARE_IMAGES_API_TOKEN` (an API token scoped to Cloudflare Images write access).
2. THE application SHALL read the following client-side environment variable for constructing delivery URLs: `NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH` (the account hash used in the Cloudflare Images delivery URL pattern `https://imagedelivery.net/{accountHash}/{imageId}/public`).
3. WHEN any of the three required Cloudflare environment variables is missing at runtime, THE Cloudflare_Controller SHALL throw a descriptive error identifying which variable is absent before making any external API call.
4. THE `.env.local` file SHALL document these three variable names with placeholder values so that new developers can identify the required configuration without reading source code.
