/**
 * Custom NextAuth Mongoose Adapter
 *
 * NextAuth EmailProvider requires an adapter to store verification tokens.
 * We can't use @auth/mongodb-adapter (MongoDB v6/v7 conflict with mongoose).
 * So we implement just the methods NextAuth actually needs:
 *   - createVerificationToken
 *   - useVerificationToken
 *   - getUserByEmail
 *   - createUser
 *   - getUser
 *   - updateUser
 *   - linkAccount (no-op — we handle provider linking in signIn callback)
 *
 * Sessions are handled via JWT (not DB), so session methods are not needed.
 */

import { connectDB } from '@/lib/db';
import RetailUser    from '@/models/retail/User';
import mongoose      from 'mongoose';

// ── Verification Token Model ──────────────────────────────────────────────────
// Stores magic-link tokens. TTL index auto-deletes after expiry.
const VerificationTokenSchema = new mongoose.Schema({
  identifier: { type: String, required: true },   // email
  token:      { type: String, required: true, unique: true },
  expires:    { type: Date,   required: true },
});

// Compound unique index (NextAuth spec)
VerificationTokenSchema.index({ identifier: 1, token: 1 }, { unique: true });

// Auto-delete expired tokens
VerificationTokenSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

const VerificationToken =
  mongoose.models.VerificationToken ||
  mongoose.model('VerificationToken', VerificationTokenSchema);

// ── Adapter ───────────────────────────────────────────────────────────────────
export function RetailMongoAdapter() {
  return {
    // ── Verification tokens (magic link) ───────────────────────────────────
    async createVerificationToken({ identifier, token, expires }) {
      await connectDB();
      const doc = await VerificationToken.create({ identifier, token, expires });
      return { identifier: doc.identifier, token: doc.token, expires: doc.expires };
    },

    async useVerificationToken({ identifier, token }) {
      await connectDB();
      // findOneAndDelete — atomic, prevents replay attacks
      const doc = await VerificationToken.findOneAndDelete({ identifier, token });
      if (!doc) return null;
      return { identifier: doc.identifier, token: doc.token, expires: doc.expires };
    },

    // ── Users ───────────────────────────────────────────────────────────────
    async getUserByEmail(email) {
      await connectDB();
      const user = await RetailUser.findOne({ email: email.toLowerCase() }).lean();
      if (!user) return null;
      return _format(user);
    },

    async getUser(id) {
      await connectDB();
      const user = await RetailUser.findById(id).lean();
      if (!user) return null;
      return _format(user);
    },

    async createUser({ name, email, image }) {
      await connectDB();
      const user = await RetailUser.create({
        email: email.toLowerCase(),
        name:  name  || '',
        image: image || '',
        providers: [],
      });
      return _format(user.toObject());
    },

    async updateUser({ id, name, email, image }) {
      await connectDB();
      const update = {};
      if (name  !== undefined) update.name  = name;
      if (email !== undefined) update.email = email.toLowerCase();
      if (image !== undefined) update.image = image;
      const user = await RetailUser.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
      return _format(user);
    },

    // ── Accounts (OAuth links) ──────────────────────────────────────────────
    // We handle provider tracking in signIn callback, so this is a safe no-op.
    async linkAccount(account) {
      await connectDB();
      await RetailUser.findOneAndUpdate(
        { email: account.email },
        { $addToSet: { providers: account.provider } }
      );
      return account;
    },

    async getUserByAccount({ providerAccountId, provider }) {
      // Not needed for our JWT flow — return null to let signIn callback handle it
      return null;
    },

    // ── Sessions — not used (JWT strategy) ─────────────────────────────────
    async createSession(session)            { return session; },
    async getSessionAndUser(sessionToken)   { return null; },
    async updateSession(session)            { return session; },
    async deleteSession(sessionToken)       { return; },
  };
}

// ── Helper: normalize MongoDB doc to NextAuth User shape ─────────────────────
function _format(user) {
  if (!user) return null;
  return {
    id:            user._id.toString(),
    name:          user.name  || null,
    email:         user.email,
    image:         user.image || null,
    emailVerified: user.emailVerified || null,
  };
}
