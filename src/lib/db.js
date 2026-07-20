import mongoose from 'mongoose';
import { Resolver } from 'dns';
import { promisify } from 'util';

// Next.js resets default DNS servers which breaks mongodb+srv:// SRV lookups.
// This function resolves SRV + TXT records using Google DNS directly,
// then builds a direct mongodb:// URI so mongoose never needs to do DNS.
async function getMongoURIWithResolvedHosts() {
  const uri = process.env.MONGODB_URI;
  if (!uri.startsWith('mongodb+srv://')) return uri;

  try {
    const srvHost  = uri.split('@')[1].split('/')[0];   // cluster0.mes4v8e.mongodb.net
    const credPart = uri.split('@')[0].replace('mongodb+srv://', ''); // user:pass
    const dbAndParams = uri.split('@')[1].split('/').slice(1).join('/'); // dada-export?...

    const resolver = new Resolver();
    resolver.setServers(['8.8.8.8', '8.8.4.4']);
    const resolveSrv = promisify(resolver.resolveSrv.bind(resolver));
    const resolveTxt = promisify(resolver.resolveTxt.bind(resolver));

    // Resolve SRV → get actual host:port list
    const srvRecords = await resolveSrv(`_mongodb._tcp.${srvHost}`);
    const hosts = srvRecords.map((r) => `${r.name}:${r.port}`).join(',');

    // Resolve TXT → get authSource and replicaSet name dynamically
    const txtRecords = await resolveTxt(srvHost);
    const txtParams  = txtRecords.flat().join('&'); // e.g. "authSource=admin&replicaSet=atlas-xxx"

    const directURI = `mongodb://${credPart}@${hosts}/${dbAndParams}&${txtParams}&ssl=true`;
    console.log('[DB] Resolved cluster hosts:', hosts);
    console.log('[DB] Resolved TXT params:', txtParams);
    return directURI;
  } catch (e) {
    console.warn('[DB] SRV resolve failed, falling back to original URI:', e.message);
    return uri;
  }
}

// Cache connection — avoids reconnecting on every hot-reload in dev
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in .env.local');
  }

  if (!cached.promise) {
    console.log('[DB] Connecting to MongoDB Atlas...');
    cached.promise = getMongoURIWithResolvedHosts()
      .then((resolvedURI) =>
        mongoose.connect(resolvedURI, {
          bufferCommands: false,
          serverSelectionTimeoutMS: 30000,
          connectTimeoutMS: 30000,
          socketTimeoutMS: 30000,
        })
      )
      .then((m) => {
        console.log('[DB] Connected successfully ✓');
        return m;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    console.error('[DB] Connection failed:', error.message);
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
