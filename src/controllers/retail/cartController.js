import { connectDB } from '@/lib/db';
import Cart from '@/models/retail/Cart';
import RetailProduct from '@/models/retail/RetailProduct';

export async function getCart(userId) {
  await connectDB();
  return Cart.findOne({ userId }).lean();
}

export async function addToCart(userId, { productId, size, color, quantity = 1 }) {
  await connectDB();

  const product = await RetailProduct.findById(productId).lean();
  if (!product) throw new Error('Product not found');

  const cartItem = {
    productId,
    name:     product.name,
    image:    product.images?.[0] || '',
    price:    product.price,
    size,
    color,
    quantity,
  };

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    return Cart.create({ userId, items: [cartItem] });
  }

  // same product + size + color → increment qty
  const idx = cart.items.findIndex(
    (i) =>
      i.productId.toString() === productId &&
      i.size  === size &&
      i.color === color
  );

  if (idx > -1) {
    cart.items[idx].quantity += quantity;
  } else {
    cart.items.push(cartItem);
  }

  return cart.save();
}

export async function updateCartItem(userId, itemId, quantity) {
  await connectDB();
  return Cart.findOneAndUpdate(
    { userId, 'items._id': itemId },
    { $set: { 'items.$.quantity': quantity } },
    { new: true }
  );
}

export async function removeFromCart(userId, itemId) {
  await connectDB();
  return Cart.findOneAndUpdate(
    { userId },
    { $pull: { items: { _id: itemId } } },
    { new: true }
  );
}

export async function clearCart(userId) {
  await connectDB();
  return Cart.findOneAndUpdate({ userId }, { $set: { items: [] } }, { new: true });
}
