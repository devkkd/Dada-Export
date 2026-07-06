# Dada Exports — Backend Architecture Document

> **Stack:** Next.js 16 (App Router) · JavaScript · Tailwind CSS v4  
> **Pattern:** MVC — Models, Controllers (Server Actions / Route Handlers), Views (React Components)

---

## Project Overview

Single Next.js codebase with **two separate websites**:

| Route | Purpose |
|-------|---------|
| `/b2b` | Wholesale / bulk inquiry website for business buyers |
| `/retail` | Full e-commerce website for end consumers |

Both share the same Next.js app, database, and backend logic — but each has its own layouts, components, and business rules.

---

## Why Separate Collections (Not a Shared `site` Field)

B2B aur Retail ke products fundamentally alag hain:

| Field | B2B Product | Retail Product |
|-------|------------|---------------|
| Price | Not shown / quote-based | Fixed retail price (MRP) |
| MOQ | Minimum order quantity | Not applicable |
| Colors | Array of available colors | Same |
| Sizes | Bulk size range (S-3XL) | Individual sizes with stock |
| Cart | No cart, inquiry only | Full cart + checkout |
| Images | Wholesale product images | Consumer-facing images |

Ek shared model mein dono fit nahi hota cleanly. **Alag MongoDB collections = alag models = zero coupling.**

---

## Folder Structure (Complete)

```
src/
├── app/
│   ├── layout.js                  # Root layout (shared meta, fonts)
│   ├── page.js                    # Landing redirect → /b2b or /retail
│   │
│   ├── b2b/                       # B2B website
│   │   ├── layout.js              # B2B layout (Header, Footer)
│   │   ├── page.js                # B2B home
│   │   ├── about/page.js
│   │   ├── new-arrival/page.js
│   │   ├── product/[slug]/page.js
│   │   ├── enquiry/page.js        # Bulk inquiry form
│   │   ├── wholesaleenquary/page.js
│   │   ├── process/page.js
│   │   └── contactUs/page.js
│   │
│   ├── retail/                    # Retail e-commerce website
│   │   ├── layout.js              # Retail layout (Header, Footer)
│   │   ├── page.js                # Retail home
│   │   ├── about/page.js
│   │   ├── new-arrival/page.js
│   │   ├── product/[slug]/page.js
│   │   ├── cart/page.js
│   │   ├── account/page.js
│   │   ├── dress/page.js
│   │   ├── top/page.js
│   │   ├── bottom-wear/page.js
│   │   ├── mens/page.js
│   │   ├── kidds/page.js
│   │   └── contactUs/page.js
│   │
│   └── api/                       # REST API routes (backend)
│       ├── b2b/
│       │   ├── products/
│       │   │   └── route.js       # GET — fetch b2b products
│       │   └── inquiry/
│       │       └── route.js       # POST — submit bulk inquiry
│       └── retail/
│           ├── products/
│           │   └── route.js       # GET — fetch retail products
│           ├── cart/
│           │   └── route.js       # GET/POST/DELETE — cart ops
│           ├── orders/
│           │   └── route.js       # POST — place order
│           └── auth/
│               └── [...nextauth]/
│                   └── route.js   # NextAuth handler
│
├── components/
│   ├── b2b/                       # B2B-specific UI components
│   ├── retail/                    # Retail-specific UI components
│   └── shared/                    # Used by both (SwitchBar, etc.)
│
├── lib/                           # Utilities & helpers
│   ├── db.js                      # MongoDB connection
│   ├── auth.js                    # NextAuth config
│   └── utils.js                   # General helpers
│
├── models/                        # Data Models — SEPARATE per site
│   ├── b2b/
│   │   ├── B2BProduct.js          # B2B product schema
│   │   └── Inquiry.js             # Bulk inquiry schema
│   └── retail/
│       ├── RetailProduct.js       # Retail product schema
│       ├── User.js                # Retail customer schema
│       ├── Cart.js                # Cart schema
│       └── Order.js               # Order schema
│
├── controllers/                   # Business Logic — SEPARATE per site
│   ├── b2b/
│   │   ├── productController.js   # B2B product queries
│   │   └── inquiryController.js   # Inquiry submission + email
│   └── retail/
│       ├── productController.js   # Retail product queries
│       ├── cartController.js      # Cart CRUD
│       ├── orderController.js     # Place & track orders
│       └── authController.js      # Register, login
│
└── middleware.js                  # Route protection (auth guards)
```

---

## MVC Pattern Explained

### Model (Data Layer) — `src/models/`

Pure data schemas, separated by site. Koi business logic nahi.

#### B2B Product Model

```js
// src/models/b2b/B2BProduct.js
import mongoose from 'mongoose';

const B2BProductSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  slug:        { type: String, required: true, unique: true },
  description: { type: String, required: true },
  images:      [String],                           // wholesale product images
  category:    {
    type: String,
    enum: ['Dresses', 'Tops', 'Bottom Wear', 'Accessories', 'Home & Lifestyle'],
    required: true,
  },
  colors: [                                        // available color variants
    {
      name:  String,                               // e.g. "Teal", "Rose"
      hex:   String,                               // e.g. "#0D9488"
    }
  ],
  sizes:       [String],                           // ['S', 'M', 'L', 'XL', '2XL', '3XL']
  moq:         { type: Number, default: 50 },      // minimum order quantity
  fabric:      String,                             // e.g. "100% Premium Rayon"
  isActive:    { type: Boolean, default: true },
  isFeatured:  { type: Boolean, default: false },  // show on homepage
  tags:        [String],
  createdAt:   { type: Date, default: Date.now },
});

export default mongoose.models.B2BProduct
  || mongoose.model('B2BProduct', B2BProductSchema);
```

#### Retail Product Model

```js
// src/models/retail/RetailProduct.js
import mongoose from 'mongoose';

const RetailProductSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  slug:        { type: String, required: true, unique: true },
  description: { type: String, required: true },
  images:      [String],                           // consumer-facing images
  category:    {
    type: String,
    enum: ['Dresses', 'Tops', 'Bottom Wear', 'Mens', 'Kids', 'Accessories'],
    required: true,
  },
  price:       { type: Number, required: true },   // retail MRP
  mrp:         { type: Number },                   // original MRP (for discount display)
  colors: [
    {
      name:  String,
      hex:   String,
    }
  ],
  variants: [                                      // size + stock per variant
    {
      size:  { type: String, required: true },     // 'XS','S','M','L','XL','XXL'
      stock: { type: Number, default: 0 },
    }
  ],
  fabric:      String,
  isActive:    { type: Boolean, default: true },
  isFeatured:  { type: Boolean, default: false },
  tags:        [String],
  createdAt:   { type: Date, default: Date.now },
});

export default mongoose.models.RetailProduct
  || mongoose.model('RetailProduct', RetailProductSchema);
```

#### B2B Inquiry Model

```js
// src/models/b2b/Inquiry.js
import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema({
  name:        { type: String, required: true },
  email:       { type: String, required: true },
  phone:       { type: String, required: true },
  company:     String,
  country:     String,
  message:     String,
  products: [                                      // which products they want
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'B2BProduct' },
      name:      String,
      quantity:  Number,
    }
  ],
  status:      {
    type: String,
    enum: ['new', 'contacted', 'converted', 'closed'],
    default: 'new',
  },
  createdAt:   { type: Date, default: Date.now },
});

export default mongoose.models.Inquiry
  || mongoose.model('Inquiry', InquirySchema);
```

#### Retail Cart, User, Order Models

```js
// src/models/retail/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },     // bcrypt hashed
  phone:     String,
  addresses: [
    {
      label:    String,                            // 'Home', 'Work'
      street:   String,
      city:     String,
      state:    String,
      pincode:  String,
      isDefault: Boolean,
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
```

```js
// src/models/retail/Cart.js
import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'RetailProduct' },
      name:      String,
      image:     String,
      price:     Number,
      size:      String,
      color:     String,
      quantity:  { type: Number, default: 1 },
    }
  ],
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Cart || mongoose.model('Cart', CartSchema);
```

```js
// src/models/retail/Order.js
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'RetailProduct' },
      name:      String,
      image:     String,
      price:     Number,
      size:      String,
      color:     String,
      quantity:  Number,
    }
  ],
  totalAmount:   { type: Number, required: true },
  shippingAddress: {
    name:    String,
    street:  String,
    city:    String,
    state:   String,
    pincode: String,
    phone:   String,
  },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  paymentId:     String,                           // Razorpay payment ID
  orderStatus:   {
    type: String,
    enum: ['placed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'placed',
  },
  createdAt:     { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
```

---

### Controller (Business Logic) — `src/controllers/`

Pure JS functions. Yahan sab logic hota hai — no HTTP, no React.

#### B2B Controllers

```js
// src/controllers/b2b/productController.js
import B2BProduct from '@/models/b2b/B2BProduct';
import { connectDB } from '@/lib/db';

export async function getB2BProducts({ category, featured } = {}) {
  await connectDB();
  const query = { isActive: true };
  if (category) query.category = category;
  if (featured) query.isFeatured = true;
  return B2BProduct.find(query).sort({ createdAt: -1 }).lean();
}

export async function getB2BProductBySlug(slug) {
  await connectDB();
  return B2BProduct.findOne({ slug, isActive: true }).lean();
}
```

```js
// src/controllers/b2b/inquiryController.js
import Inquiry from '@/models/b2b/Inquiry';
import { connectDB } from '@/lib/db';
import { sendInquiryEmail } from '@/lib/email';

export async function submitInquiry(data) {
  await connectDB();
  const inquiry = await Inquiry.create(data);
  await sendInquiryEmail(data);  // email notification to team
  return inquiry;
}
```

#### Retail Controllers

```js
// src/controllers/retail/productController.js
import RetailProduct from '@/models/retail/RetailProduct';
import { connectDB } from '@/lib/db';

export async function getRetailProducts({ category, featured } = {}) {
  await connectDB();
  const query = { isActive: true };
  if (category) query.category = category;
  if (featured) query.isFeatured = true;
  return RetailProduct.find(query).sort({ createdAt: -1 }).lean();
}

export async function getRetailProductBySlug(slug) {
  await connectDB();
  return RetailProduct.findOne({ slug, isActive: true }).lean();
}
```

```js
// src/controllers/retail/cartController.js
import Cart from '@/models/retail/Cart';
import RetailProduct from '@/models/retail/RetailProduct';
import { connectDB } from '@/lib/db';

export async function getCart(userId) {
  await connectDB();
  return Cart.findOne({ userId }).lean();
}

export async function addToCart(userId, { productId, size, color, quantity }) {
  await connectDB();
  const product = await RetailProduct.findById(productId).lean();
  if (!product) throw new Error('Product not found');

  const cartItem = {
    productId,
    name:  product.name,
    image: product.images[0],
    price: product.price,
    size,
    color,
    quantity,
  };

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return Cart.create({ userId, items: [cartItem] });
  }

  // same product + same size + same color → increase qty
  const idx = cart.items.findIndex(
    i => i.productId.toString() === productId && i.size === size && i.color === color
  );
  if (idx > -1) {
    cart.items[idx].quantity += quantity;
  } else {
    cart.items.push(cartItem);
  }
  cart.updatedAt = new Date();
  return cart.save();
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
  return Cart.findOneAndUpdate({ userId }, { items: [] });
}
```

```js
// src/controllers/retail/orderController.js
import Order from '@/models/retail/Order';
import { connectDB } from '@/lib/db';
import { clearCart } from './cartController';

export async function placeOrder(userId, { items, totalAmount, shippingAddress, paymentId }) {
  await connectDB();
  const order = await Order.create({
    userId,
    items,
    totalAmount,
    shippingAddress,
    paymentStatus: paymentId ? 'paid' : 'pending',
    paymentId,
  });
  await clearCart(userId);  // empty cart after order
  return order;
}

export async function getUserOrders(userId) {
  await connectDB();
  return Order.find({ userId }).sort({ createdAt: -1 }).lean();
}
```

---

### View (UI Layer) — `src/app/` + `src/components/`

Already built. Components render UI, pages compose components.  
**Views do not call DB directly.** They call controllers via Route Handlers or Server Actions.

---

### Route Handlers (API) — `src/app/api/`

These are the bridge — they receive HTTP requests and call controllers.

```js
// src/app/api/b2b/products/route.js
import { getB2BProducts } from '@/controllers/b2b/productController';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured  = searchParams.get('featured') === 'true';
    const products  = await getB2BProducts({ category, featured });
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
```

```js
// src/app/api/retail/products/route.js
import { getRetailProducts } from '@/controllers/retail/productController';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured  = searchParams.get('featured') === 'true';
    const products  = await getRetailProducts({ category, featured });
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
```

```js
// src/app/api/b2b/inquiry/route.js
import { submitInquiry } from '@/controllers/b2b/inquiryController';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body    = await request.json();
    const inquiry = await submitInquiry(body);
    return NextResponse.json({ success: true, data: inquiry }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
```

```js
// src/app/api/retail/cart/route.js
import { getCart, addToCart, removeFromCart } from '@/controllers/retail/cartController';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const cart = await getCart(session.user.id);
  return NextResponse.json({ success: true, data: cart });
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const cart = await addToCart(session.user.id, body);
  return NextResponse.json({ success: true, data: cart });
}

export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const { itemId } = await request.json();
  const cart = await removeFromCart(session.user.id, itemId);
  return NextResponse.json({ success: true, data: cart });
}
```

---

## Database Setup

**Recommended: MongoDB + Mongoose**  
(Simple, schema-flexible, good for product catalogs)

```js
// src/lib/db.js
import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;
  const conn = await mongoose.connect(process.env.MONGODB_URI);
  isConnected = conn.connections[0].readyState === 1;
}
```

```env
# .env.local
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dada-exports
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
```

---

## Authentication Strategy

### Retail → NextAuth.js (email/password + optional Google)

```js
// src/app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authController } from '@/controllers/retail/authController';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        return authController.login(credentials.email, credentials.password);
      }
    })
  ],
  session: { strategy: 'jwt' },
});

export { handler as GET, handler as POST };
```

### B2B → Simple form submission (no login required)

B2B users sirf inquiry form bharte hain. Login zaruri nahi unless admin portal chahiye.

---

## Route Protection — `middleware.js`

```js
// src/middleware.js
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const token = await getToken({ req });
  const path = req.nextUrl.pathname;

  // Retail account/cart routes need login
  const protectedRetailRoutes = ['/retail/account', '/retail/cart'];
  if (protectedRetailRoutes.some(r => path.startsWith(r)) && !token) {
    return NextResponse.redirect(new URL('/retail?login=true', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/retail/account/:path*', '/retail/cart/:path*'],
};
```

---

## Data Flow Summary

```
Browser Request
      ↓
Next.js Route Handler  (src/app/api/...)
      ↓
Controller             (src/controllers/...)   ← Business logic lives here
      ↓
Model                  (src/models/...)         ← DB schema
      ↓
MongoDB Database
      ↓
JSON Response → Component renders UI
```

---

## B2B vs Retail — Key Differences

| Feature | B2B (`/b2b`) | Retail (`/retail`) |
|---------|-------------|-------------------|
| DB Collection | `b2bproducts` | `retailproducts` |
| Model file | `models/b2b/B2BProduct.js` | `models/retail/RetailProduct.js` |
| Price shown | No (quote-based) | Yes — MRP + discount |
| MOQ field | Yes | No |
| Variants | Colors + size range | Colors + size + individual stock |
| Cart | No cart, inquiry only | Full cart + checkout |
| Auth required | No | Yes (for cart/orders) |
| Order flow | Email inquiry → manual | Cart → Checkout → Razorpay → Order |
| Payment | No | Yes (Razorpay) |
| Categories | Dresses, Tops, Bottom Wear, Accessories, Home & Lifestyle | Dresses, Tops, Bottom Wear, Mens, Kids, Accessories |

---

## Packages to Install

```bash
# Database
npm install mongoose

# Auth
npm install next-auth

# Email (inquiry notifications)
npm install nodemailer

# Payment (retail)
npm install razorpay   # or stripe

# Validation
npm install zod        # already in node_modules
```

---

## Environment Variables (`.env.local`)

```env
# Database
MONGODB_URI=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# Email
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
INQUIRY_EMAIL=info@dadaexports.com

# Payment (Retail)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

---

## Implementation Order (Step by Step)

1. **Database** — Set up MongoDB, create `src/lib/db.js`
2. **Models** — Create `Product`, `Inquiry`, `User`, `Order`, `Cart` models
3. **B2B Controllers** — `productController`, `inquiryController`
4. **B2B API Routes** — `/api/b2b/products`, `/api/b2b/inquiry`
5. **Retail Controllers** — `productController`, `cartController`, `authController`, `orderController`
6. **Retail API Routes** — `/api/retail/products`, `/api/retail/cart`, `/api/auth/[...nextauth]`
7. **Middleware** — Route protection for retail
8. **Connect UI to API** — Replace static data in components with `fetch()` calls
9. **Payment** — Integrate Razorpay for retail checkout

---

## Notes

- Zod is already installed — use it for request body validation in route handlers
- All API responses follow `{ success: true/false, data: ..., error: ... }` format
- Static images stay in `/public` — no change needed
- `.env.local` is already in `.gitignore` — never commit it
