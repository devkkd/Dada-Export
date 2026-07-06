# Requirements Document

## Introduction

The Admin Seed feature introduces a dedicated `Admin` model in MongoDB and a Node.js seed script that creates the initial admin user. Currently, admin authentication in Dada Exports relies entirely on plaintext credentials stored in environment variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD`). This is insecure and non-scalable. The feature moves admin identity into the database — hashed with bcrypt — and updates the NextAuth.js `authorize` callback to verify credentials against MongoDB instead of environment variables. A runnable seed script (`scripts/seed-admin.js`) bootstraps the first admin user so the system is ready immediately after setup.

---

## Glossary

- **Admin**: A privileged user who can manage products, orders, and inquiries via the admin panel. Stored in the `admins` MongoDB collection.
- **Admin_Model**: The Mongoose schema and model defined at `src/models/admin/Admin.js` that represents an admin document.
- **Seed_Script**: The Node.js script at `scripts/seed-admin.js` that creates the initial admin document in MongoDB.
- **Auth_Config**: The NextAuth.js configuration in `src/lib/auth.js` that handles admin login.
- **bcrypt**: The password-hashing library (`bcryptjs`) used to hash and verify passwords.
- **JWT**: JSON Web Token — the session strategy used by NextAuth.js to persist admin authentication state.
- **MONGODB_URI**: The environment variable holding the MongoDB connection string.
- **ADMIN_EMAIL**: The environment variable holding the seed admin's email address, read only at seed time.
- **ADMIN_PASSWORD**: The environment variable holding the seed admin's plaintext password, read only at seed time and never stored in plaintext.

---

## Requirements

### Requirement 1: Admin Model

**User Story:** As a developer, I want a dedicated `Admin` Mongoose model, so that admin credentials are stored in MongoDB separately from retail customer accounts.

#### Acceptance Criteria

1. THE Admin_Model SHALL define the following required fields: `name` (String), `email` (String, unique, lowercase, trimmed), `password` (String, bcrypt-hashed, excluded from default query results via `select: false`), `role` (String, enum `['admin', 'superadmin']`, default `'admin'`), and `isActive` (Boolean, default `true`).
2. THE Admin_Model SHALL use Mongoose `{ timestamps: true }` option so that `createdAt` and `updatedAt` fields are managed automatically by Mongoose.
3. WHEN `admin.save()` is called AND the `password` field has been modified, THE Admin_Model pre-save hook SHALL replace the `password` value with a bcrypt hash computed using `bcryptjs.hash(password, 10)` before the document is written to MongoDB.
4. THE Admin_Model SHALL expose a `comparePassword(plaintext)` instance method that calls `bcryptjs.compare(plaintext, this.password)` and returns the resulting Promise, resolving to `true` if the passwords match and `false` otherwise.
5. THE Admin_Model SHALL enforce a unique index on the `email` field at the schema level so that a MongoDB duplicate-key error is thrown if a second admin document with the same email is inserted.
6. THE Admin_Model SHALL be stored at `src/models/admin/Admin.js` and registered under the model name `'Admin'` mapping to the `admins` collection.

---

### Requirement 2: Seed Script

**User Story:** As a developer, I want a seed script I can run once from the terminal, so that the initial admin user is created in MongoDB and the system is usable immediately after deployment.

#### Acceptance Criteria

1. WHEN the Seed_Script is executed, THE Seed_Script SHALL read `ADMIN_EMAIL`, `ADMIN_PASSWORD` (both required), and `ADMIN_NAME` (optional, defaulting to `'Admin'`) from `process.env`.
2. IF `ADMIN_EMAIL` is absent or an empty string in `process.env`, THEN THE Seed_Script SHALL log the message `"Error: ADMIN_EMAIL is required"` to stderr and exit with code `1` without opening a database connection.
3. IF `ADMIN_PASSWORD` is absent or an empty string in `process.env`, THEN THE Seed_Script SHALL log the message `"Error: ADMIN_PASSWORD is required"` to stderr and exit with code `1` without opening a database connection.
4. IF `.env.local` does not exist when dotenv attempts to load it, THEN THE Seed_Script SHALL log a warning to stderr and continue execution, relying on environment variables already present in the process environment.
5. WHEN the Seed_Script connects to MongoDB and queries the `admins` collection and finds a document with `email` equal to `ADMIN_EMAIL`, THEN THE Seed_Script SHALL log `"Admin already exists: <email>"` to stdout and exit with code `0` without inserting a new document.
6. WHEN no admin with `ADMIN_EMAIL` exists, THE Seed_Script SHALL instantiate an Admin document with `name`, `email`, and `password` fields and call `.save()` so that the pre-save hook hashes the password before the document is written to MongoDB.
7. WHEN the admin document is saved successfully, THE Seed_Script SHALL log `"Admin created successfully: <email>"` to stdout and exit with code `0`.
8. IF a database connection error or write error occurs after the connection is open, THEN THE Seed_Script SHALL log the error's message to stderr and exit with code `1`.
9. THE Seed_Script SHALL call `mongoose.connection.close()` in a `finally` block so that the MongoDB connection is closed after execution regardless of success or failure.

---

### Requirement 3: NextAuth Auth Configuration Update

**User Story:** As an admin, I want to log in with credentials stored in MongoDB, so that my password is securely hashed and admin accounts can be managed without changing environment variables.

#### Acceptance Criteria

1. WHEN an admin submits login credentials via the NextAuth CredentialsProvider, THE Auth_Config `authorize` function SHALL call `connectDB()` before querying the Admin_Model.
2. IF `connectDB()` throws an error, THEN THE Auth_Config `authorize` function SHALL return `null` to reject the login attempt without propagating the exception.
3. WHEN `connectDB()` resolves, THE Auth_Config SHALL query the `admins` collection using `Admin.findOne({ email: credentials.email }).select('+password')` to retrieve the admin document including the password hash.
4. IF no admin document is found for the submitted email, THEN THE Auth_Config SHALL return `null` to reject the login attempt.
5. WHEN an admin document is found, THE Auth_Config SHALL call `admin.comparePassword(credentials.password)` and await the result.
6. IF `comparePassword` returns `false`, THEN THE Auth_Config SHALL return `null` to reject the login attempt.
7. IF the admin document's `isActive` field is `false`, THEN THE Auth_Config SHALL return `null` to reject the login attempt (this check occurs after password verification).
8. WHEN all checks pass, THE Auth_Config SHALL return `{ id: admin._id.toString(), email: admin.email, name: admin.name, role: admin.role }`.
9. IF the Admin_Model query throws an error, THEN THE Auth_Config `authorize` function SHALL return `null` without propagating the exception.

---

### Requirement 4: npm Script Integration

**User Story:** As a developer, I want to run the seed script with a short npm command, so that seeding is consistent and does not require memorising a full Node.js invocation.

#### Acceptance Criteria

1. THE `package.json` `scripts` section SHALL contain an entry `"seed:admin": "node scripts/seed-admin.js"` so that `npm run seed:admin` executes the Seed_Script.
2. WHEN `npm run seed:admin` is executed, THE Seed_Script SHALL use `dotenv` (or `dotenv/config`) to load `.env.local` at the top of the script before any other module initialises, so that `MONGODB_URI`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` are available in `process.env` without a separate `export` step.
3. THE Seed_Script SHALL use CommonJS `require()` syntax (no `import`) because the project's `package.json` does not contain a `"type": "module"` field, making CommonJS the default module system for `.js` files.

---

### Requirement 5: Security Constraints

**User Story:** As a developer, I want the admin seed process to follow secure coding practices, so that credentials are never exposed in logs, code, or version control.

#### Acceptance Criteria

1. THE Seed_Script SHALL NOT include any `console.log`, `console.error`, or other logging call that outputs the value of `ADMIN_PASSWORD` or any bcrypt hash at any point during execution.
2. THE Admin_Model password field SHALL be declared with `select: false` in the Mongoose schema so that `Admin.find()` and `Admin.findOne()` queries exclude the password hash from results unless `.select('+password')` is explicitly appended to the query.
3. THE `.env.local` file SHALL remain listed in `.gitignore` and SHALL NOT be committed to version control; the Seed_Script file (`scripts/seed-admin.js`) itself MAY be committed.
4. WHEN the Auth_Config queries the Admin_Model for login verification, THE query SHALL append `.select('+password')` to explicitly opt-in to retrieving the password hash, since the field is excluded by default.
