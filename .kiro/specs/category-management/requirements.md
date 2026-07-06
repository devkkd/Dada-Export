# Requirements Document

## Introduction

This feature introduces a dynamic, database-driven Category & Subcategory system shared across the Dada Exports (B2B) and Iveara (Retail) sites within the single Next.js codebase. The hardcoded category enums on B2BProduct and RetailProduct models will be replaced by a slug-based reference to the new shared `Category` collection. An admin REST API and a full CRUD admin page are added to manage categories. Additionally, the existing AdminDashboard component is redesigned with a refined, consistent colour palette while preserving all existing responsive behaviour.

---

## Glossary

- **Category_Model**: The Mongoose model backed by the shared `categories` MongoDB collection.
- **Category**: A top-level content grouping (e.g. "Dresses", "Tops") that belongs to one or more sites.
- **Subcategory**: A nested content grouping stored as an embedded sub-document inside a parent Category document.
- **Slug**: A URL-safe, lowercase, hyphenated string identifier derived from a name (e.g. "bottom-wear" from "Bottom Wear"). Used as the human-readable reference key on product documents.
- **Site**: One of the two storefronts — `b2b` (Dada Exports wholesale) or `retail` (Iveara e-commerce).
- **Admin_API**: The set of REST route handlers under `/api/admin/categories` protected by admin session.
- **Admin_Panel**: The Next.js page rendered at `/admin/categories` used by administrators to manage categories.
- **Category_Controller**: The business-logic module at `src/controllers/admin/categoryController.js`.
- **Soft_Delete**: Setting `isActive: false` on a document rather than removing it from the database.
- **B2BProduct**: The existing Mongoose model at `src/models/b2b/B2BProduct.js`.
- **RetailProduct**: The existing Mongoose model at `src/models/retail/RetailProduct.js`.
- **AdminDashboard**: The existing React component at `src/components/admin/AdminDashboard.jsx`.

---

## Requirements

### Requirement 1: Category Mongoose Model

**User Story:** As a developer, I want a shared Mongoose model for categories, so that both the B2B and Retail sites can read category data from a single MongoDB collection.

#### Acceptance Criteria

1. THE Category_Model SHALL define a `categories` MongoDB collection with the following required fields: `name` (String), `slug` (String, unique), `sites` (Array of Strings, each value restricted to `['b2b', 'retail']`), `isActive` (Boolean, default `true`), `order` (Number, default `0`), and `createdAt` (Date, default `Date.now`).
2. THE Category_Model SHALL define an optional `description` (String) field and an optional `image` (String) field on each Category document.
3. THE Category_Model SHALL define an embedded `subcategories` array field, where each element contains `name` (String, required), `slug` (String, required), `isActive` (Boolean, default `true`), and `order` (Number, default `0`).
4. WHEN a Category document is saved, THE Category_Model SHALL enforce that the `slug` field is unique across the entire `categories` collection.
5. WHEN a Subcategory is saved within a parent Category, THE Category_Model SHALL enforce that the subcategory `slug` is unique within that parent's `subcategories` array.
6. THE Category_Model SHALL be located at `src/models/shared/Category.js` and follow the existing project model file conventions.

---

### Requirement 2: Automatic Slug Generation

**User Story:** As an admin, I want category slugs to be generated automatically from the category name, so that I do not have to type them manually and they remain consistent.

#### Acceptance Criteria

1. WHEN a Category is created without an explicit `slug` value, THE Category_Model SHALL derive the slug by converting the `name` to lowercase and replacing all spaces and special characters with hyphens (e.g. "Bottom Wear" → "bottom-wear", "Home & Lifestyle" → "home-lifestyle").
2. WHEN a Subcategory is created without an explicit `slug` value, THE Category_Controller SHALL apply the same slug derivation rule to the subcategory `name`.
3. WHEN the derived slug conflicts with an existing slug in the collection, THE Category_Controller SHALL append a numeric suffix (e.g. `-2`, `-3`) to produce a unique slug.
4. FOR ALL valid category name strings, the slug derivation function SHALL produce a string containing only lowercase letters, digits, and hyphens with no leading or trailing hyphens (slug format invariant).

---

### Requirement 3: Category CRUD API — List and Read

**User Story:** As an admin, I want to retrieve the list of all categories and read a single category by slug, so that the admin panel and storefronts can display up-to-date data.

#### Acceptance Criteria

1. WHEN a `GET /api/admin/categories` request is received with a valid admin session, THE Admin_API SHALL return a JSON response `{ success: true, data: [...] }` containing all Category documents sorted by `order` ascending.
2. WHEN a `GET /api/admin/categories` request includes a `site` query parameter of `b2b` or `retail`, THE Admin_API SHALL exclude all categories whose `sites` array does not contain the specified site value, returning only categories that match the filter criteria.
3. WHEN a `GET /api/admin/categories` request includes the query parameter `includeInactive=true`, THE Admin_API SHALL include categories where `isActive` is `false` in the response; otherwise THE Admin_API SHALL return only active categories.
4. WHEN a `GET /api/admin/categories/[slug]` request is received with a valid admin session and the slug matches an existing document, THE Admin_API SHALL return `{ success: true, data: <document> }` with HTTP status 200; WHEN no document matches the slug, THE Admin_API SHALL return `{ success: false, error: 'Not found' }` with HTTP status 404.
5. IF a request to any `/api/admin/categories` endpoint is received without a valid admin session, THEN THE Admin_API SHALL return `{ success: false, error: 'Unauthorized' }` with HTTP status 401.

---

### Requirement 4: Category CRUD API — Create

**User Story:** As an admin, I want to create new categories via the API, so that new product groupings can be added without code changes.

#### Acceptance Criteria

1. WHEN a `POST /api/admin/categories` request is received with a valid admin session and a request body containing at least `name` (non-empty string) and `sites` (non-empty array), THE Admin_API SHALL create a new Category document and return `{ success: true, data: <created document> }` with HTTP status 201.
2. WHEN a `POST /api/admin/categories` request body omits the `name` field or provides an empty string, THE Admin_API SHALL return `{ success: false, error: 'Name is required' }` with HTTP status 400.
3. WHEN a `POST /api/admin/categories` request body omits the `sites` field or provides an empty array, THE Admin_API SHALL return `{ success: false, error: 'At least one site is required' }` with HTTP status 400.
4. IF the derived slug from the submitted name already exists in the collection, THEN THE Admin_API SHALL automatically append a numeric suffix to the slug to ensure uniqueness rather than returning an error.
5. WHEN a `POST /api/admin/categories` request body contains a `subcategories` array with one or more elements, THE Admin_API SHALL create the subcategories as embedded documents within the new Category and auto-generate slugs for any subcategory missing an explicit slug; WHEN no `subcategories` array is provided, THE Admin_API SHALL not invoke subcategory slug generation logic.

---

### Requirement 5: Category CRUD API — Update

**User Story:** As an admin, I want to update existing categories, so that names, site assignments, descriptions, and subcategories can be kept current.

#### Acceptance Criteria

1. WHEN a `PUT /api/admin/categories/[slug]` request is received with a valid admin session and a valid body, THE Admin_API SHALL update the matching Category document with the provided fields and return `{ success: true, data: <updated document> }`.
2. WHEN a `PUT /api/admin/categories/[slug]` request is received for a slug that does not match any document, THE Admin_API SHALL return `{ success: false, error: 'Not found' }` with HTTP status 404.
3. WHEN a `PUT /api/admin/categories/[slug]` request body contains a `name` change, THE Admin_API SHALL NOT automatically update the `slug` field to preserve existing product references; the slug SHALL remain unchanged unless explicitly provided in the request body.
4. WHEN a `PUT /api/admin/categories/[slug]` request body contains a `subcategories` array, THE Admin_API SHALL replace the entire subcategories array with the provided value and auto-generate slugs for any new subcategory missing an explicit slug.
5. WHEN a `PUT /api/admin/categories/[slug]` request body does not include a particular top-level field, THE Admin_API SHALL leave that field unchanged on the stored document (partial update behaviour).

---

### Requirement 6: Category CRUD API — Soft Delete and Restore

**User Story:** As an admin, I want to deactivate and restore categories without permanent deletion, so that existing product references are never orphaned.

#### Acceptance Criteria

1. WHEN a `DELETE /api/admin/categories/[slug]` request is received with a valid admin session, THE Admin_API SHALL set `isActive` to `false` on the matching Category document and return `{ success: true, data: <updated document> }`.
2. THE Admin_API SHALL NOT remove any Category document from the database in response to a DELETE request.
3. WHEN a `PATCH /api/admin/categories/[slug]/restore` request is received with a valid admin session, THE Admin_API SHALL set `isActive` to `true` on the matching Category document and return `{ success: true, data: <updated document> }`.
4. WHEN a `DELETE /api/admin/categories/[slug]` request is applied to a Category that is already inactive, THE Admin_API SHALL respond with `{ success: true, data: <document> }` and HTTP status 200 without error (idempotent behaviour).
5. IF a `DELETE` or `PATCH /restore` request is received for a slug that does not exist, THEN THE Admin_API SHALL return `{ success: false, error: 'Not found' }` with HTTP status 404.

---

### Requirement 7: Category Controller (Business Logic)

**User Story:** As a developer, I want all category business logic isolated in a controller module, so that the project's MVC pattern is maintained and route handlers remain thin.

#### Acceptance Criteria

1. THE Category_Controller SHALL be located at `src/controllers/admin/categoryController.js` and export named async functions: `listCategories`, `getCategoryBySlug`, `createCategory`, `updateCategory`, `deactivateCategory`, and `restoreCategory`.
2. THE Category_Controller SHALL call `connectDB()` from `src/lib/db.js` at the start of each exported function.
3. THE Category_Controller SHALL perform all input validation (required fields, site enum values) and throw descriptive Error instances that route handlers can catch and forward as 400-level responses.
4. THE Category_Controller `createCategory` function SHALL invoke the slug auto-generation and uniqueness logic before persisting the document.
5. THE Category_Controller SHALL not contain any HTTP-specific code (`NextResponse`, `request`, `response` objects); those concerns belong exclusively in route handlers.

---

### Requirement 8: Replace Hardcoded Category Enum — B2BProduct

**User Story:** As a developer, I want the B2BProduct model to accept any string for the category field instead of a hardcoded enum, so that categories managed through the admin panel are reflected in product data without code deploys.

#### Acceptance Criteria

1. THE B2BProduct model SHALL change the `category` field definition from `{ type: String, enum: [...], required: true }` to `{ type: String, required: true }`, removing the hardcoded enum constraint.
2. WHEN a B2BProduct document is saved with a `category` value that matches an existing active Category slug assigned to `sites: ['b2b']`, THE B2BProduct model SHALL accept the value without error.
3. WHEN a B2BProduct document is saved with a `category` value that does not match any known Category slug, THE B2BProduct model SHALL still accept the value (validation is the responsibility of the admin form, not the schema) to prevent data loss from race conditions.
4. THE existing B2BProduct documents in MongoDB SHALL retain their current `category` string values after the schema change without requiring a data migration.

---

### Requirement 9: Replace Hardcoded Category Enum — RetailProduct

**User Story:** As a developer, I want the RetailProduct model to accept any string for the category field instead of a hardcoded enum, so that categories managed through the admin panel are reflected in retail product data without code deploys.

#### Acceptance Criteria

1. THE RetailProduct model SHALL change the `category` field definition from `{ type: String, enum: [...], required: true }` to `{ type: String, required: true }`, removing the hardcoded enum constraint.
2. WHEN a RetailProduct document is saved with a `category` value that matches an existing active Category slug assigned to `sites: ['retail']`, THE RetailProduct model SHALL accept the value without error.
3. THE existing RetailProduct documents in MongoDB SHALL retain their current `category` string values after the schema change without requiring a data migration.
4. WHERE the admin product create/edit forms for RetailProduct exist, THE Admin_Panel SHALL populate the category dropdown using a live API call to `GET /api/admin/categories?site=retail&includeInactive=false` rather than a hardcoded list.

---

### Requirement 10: Admin Panel — Category List Page

**User Story:** As an admin, I want a page at `/admin/categories` that lists all categories with their status, sites, and subcategory count, so that I can see and manage the full category tree at a glance.

#### Acceptance Criteria

1. WHEN an authenticated admin navigates to `/admin/categories`, THE Admin_Panel SHALL render a full-page list of all Category documents including inactive ones, each row displaying: name, slug, assigned sites (as badges), subcategory count, status (Active / Inactive), and action buttons (Edit, Deactivate / Restore).
2. WHEN the category list page loads, THE Admin_Panel SHALL fetch category data from `GET /api/admin/categories?includeInactive=true` and display a loading skeleton while the request is in flight.
3. WHEN the category list contains no documents, THE Admin_Panel SHALL display an empty-state message: "No categories yet. Create your first category."
4. WHEN an admin clicks the "Deactivate" button on an active category row, THE Admin_Panel SHALL call `DELETE /api/admin/categories/[slug]`, update the row status to "Inactive" without a full page reload, and display a toast notification confirming the action.
5. WHEN an admin clicks the "Restore" button on an inactive category row, THE Admin_Panel SHALL call `PATCH /api/admin/categories/[slug]/restore`, update the row status to "Active" without a full page reload, and display a toast notification confirming the action.
6. THE `/admin/categories` page SHALL be protected by the existing admin session guard and redirect unauthenticated visitors to `/admin/login`.
7. THE Admin_Panel SHALL add a "Categories" navigation link with an appropriate icon to the sidebar `NAV` array in `AdminDashboard.jsx` pointing to `/admin/categories`.

---

### Requirement 11: Admin Panel — Create and Edit Category Form

**User Story:** As an admin, I want a form to create and edit categories including their subcategories, so that I can manage the full category hierarchy from the admin panel.

#### Acceptance Criteria

1. WHEN an admin clicks "Add Category" on the category list page, THE Admin_Panel SHALL display a modal or dedicated page containing a form with fields: Name (text, required), Description (textarea, optional), Sites (multi-checkbox for `b2b` and `retail`, at least one required), Image URL (text, optional), Order (number, optional, default 0), and a dynamic Subcategories section.
2. WHEN an admin fills in the Name field and focuses away, THE Admin_Panel SHALL display a read-only preview of the auto-generated slug beneath the Name field.
3. WHEN an admin clicks "Add Subcategory" within the form, THE Admin_Panel SHALL append a new subcategory row with fields: Name (text, required), Order (number, optional), and a remove button.
4. WHEN an admin submits the create form with all required fields valid, THE Admin_Panel SHALL call `POST /api/admin/categories`, display a success toast, and refresh the category list.
5. IF the create form is submitted while the Name field is empty, THEN THE Admin_Panel SHALL display an inline validation error "Name is required" and SHALL NOT submit the request.
6. IF the create form is submitted with no site checkbox selected, THEN THE Admin_Panel SHALL display an inline validation error "Select at least one site" and SHALL NOT submit the request.
7. WHEN an admin clicks "Edit" on a category row, THE Admin_Panel SHALL populate the form with the existing category data and submit via `PUT /api/admin/categories/[slug]` on save.
8. WHEN the edit form is submitted successfully, THE Admin_Panel SHALL display a success toast and reflect the updated data in the list without a full page reload.

---

### Requirement 12: AdminDashboard UI Redesign

**User Story:** As an admin, I want the AdminDashboard to use a consistent, professional colour palette that clearly differentiates B2B and Retail contexts, so that the panel is visually polished and easier to navigate.

#### Acceptance Criteria

1. THE AdminDashboard SHALL apply the following colour system consistently across all elements: B2B primary `#95565E` (rose-brown), Retail primary `#4F6D9E` (slate-indigo), neutral background `#F7F4F1`, sidebar background white, card background white.
2. THE AdminDashboard sidebar SHALL use the B2B primary colour `#95565E` for the logo mark, active nav item highlight, and hover states on all nav items, replacing any inconsistent colour usage.
3. THE AdminDashboard stat cards SHALL use colour-coded rings and text: B2B Products in rose tones (`ring-rose-200`, `text-rose-700`), New Inquiries in amber tones, Retail Products in slate-indigo tones (`ring-[#4F6D9E]/30`, `text-[#4F6D9E]`), Retail Orders in emerald tones.
4. THE AdminDashboard quick action cards SHALL use solid background colours consistent with their site context: B2B actions use `bg-[#95565E]`, Retail actions use `bg-[#4F6D9E]`, neutral/shared actions use `bg-amber-600` or `bg-emerald-600`.
5. THE AdminDashboard section cards for B2B Wholesale and Retail E-commerce SHALL use site-specific badge colours: B2B badge uses `bg-rose-50 text-rose-700`, Retail badge uses `bg-[#4F6D9E]/10 text-[#4F6D9E]`.
6. THE AdminDashboard SHALL preserve all existing responsive sidebar drawer behaviour: mobile overlay, `translate-x` animation, desktop collapse to icon-only (`w-20`) and expand to full (`w-64`), and the hamburger toggle button in the topbar.
7. WHILE the sidebar is collapsed on desktop (internal `sidebarOpen` state is `false`), THE AdminDashboard SHALL display only icons in the nav items (no text labels) and the logo mark without the text; on mobile devices, THE AdminDashboard SHALL always render full nav items with text labels regardless of the `sidebarOpen` state, treating mobile and desktop collapse behaviour independently.
8. THE AdminDashboard topbar Admin badge SHALL use the B2B primary colour (`#95565E` background tint and text) to maintain brand consistency.

---

### Requirement 13: Seed Data for Existing Categories

**User Story:** As a developer, I want a seed script that creates the existing hardcoded categories as Category documents in the database, so that the transition from enums to dynamic categories does not break existing product filtering.

#### Acceptance Criteria

1. THE seed script SHALL create the following B2B-only categories in the `categories` collection with `sites: ['b2b']` and `isActive: true`: "Dresses" (slug: `dresses-b2b`), "Tops" (slug: `tops-b2b`), "Bottom Wear" (slug: `bottom-wear-b2b`), "Accessories" (slug: `accessories-b2b`), "Home & Lifestyle" (slug: `home-lifestyle`).
2. THE seed script SHALL create the following Retail-only categories with `sites: ['retail']` and `isActive: true`: "Mens" (slug: `mens`), "Kids" (slug: `kids`).
3. THE seed script SHALL create the following shared categories (appearing in both site enums) as separate documents with `sites: ['b2b', 'retail']` and `isActive: true`: "Dresses" (slug: `dresses`), "Tops" (slug: `tops`), "Bottom Wear" (slug: `bottom-wear`), "Accessories" (slug: `accessories`).
4. WHEN the seed script is executed against a database that already contains a category with the same slug, THE seed script SHALL skip that document entirely and leave it unchanged, making the operation safe to re-run without modifying existing data.
5. THE seed script SHALL be located at `src/scripts/seedCategories.js` and executable via `node src/scripts/seedCategories.js` after setting `MONGODB_URI` in the environment.
