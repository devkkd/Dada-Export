/**
 * One-time utility: Drop the old phone_1 unique index from retailusers
 * and let Mongoose recreate it with sparse: true
 * 
 * Hit GET /api/admin/fix-retail-index once, then this file can be deleted.
 */
import { connectDB } from '@/lib/db';
import mongoose      from 'mongoose';

export async function GET() {
  try {
    await connectDB();
    const db         = mongoose.connection.db;
    const collection = db.collection('retailusers');

    // List existing indexes
    const indexes = await collection.indexes();
    console.log('Existing indexes:', JSON.stringify(indexes, null, 2));

    // Drop phone_1 if it exists (non-sparse unique will cause duplicate "" errors)
    const phoneIndex = indexes.find(i => i.name === 'phone_1');
    if (phoneIndex) {
      await collection.dropIndex('phone_1');
      console.log('Dropped phone_1 index');
    }

    // Also clear any existing users with empty phone so fresh start
    // (optional — comment out if you want to keep existing users)
    const result = await collection.updateMany(
      { phone: '' },
      { $set: { phone: null } }
    );
    console.log('Updated empty phones to null:', result.modifiedCount);

    return Response.json({
      success: true,
      message: 'phone_1 index dropped. Restart dev server to recreate with sparse: true',
      droppedIndex: !!phoneIndex,
      updatedUsers: result.modifiedCount,
      allIndexes: indexes.map(i => i.name),
    });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
