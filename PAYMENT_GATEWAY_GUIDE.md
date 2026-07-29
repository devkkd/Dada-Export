# Razorpay Payment Gateway Integration Guide (Iveara Retail)

We have successfully integrated the **Razorpay Payment Gateway** into the retail e-commerce checkout flow on **Iveara** (`/retail/checkout`).

---

## How It Works (Checkout Flow)

Here is a visual breakdown of how the integration functions securely:

1. **Order Initiation:**
   - When the customer clicks **Place Order**, the frontend sends a POST request with the cart details and shipping address to `/api/retail/orders`.
   - The backend validates the order details and creates a **pending** order in MongoDB.
   - Using the server-side `razorpay` SDK, the backend initiates a transaction with Razorpay, generating a secure **Razorpay Order ID**.
   - The backend links this Razorpay Order ID to our local order and returns the details (`orderId`, `razorpayOrder`, `razorpayKeyId`) to the client.

2. **Payment Execution (Razorpay Modal):**
   - The frontend loads the official Razorpay SDK (`https://checkout.razorpay.com/v1/checkout.js`).
   - It triggers the payment modal prefilled with the customer's shipping name and phone number.
   - The customer enters their payment details (Cards, UPI, Netbanking, etc.) inside the secure Razorpay sandbox.

3. **Payment Verification:**
   - Once payment is successful, Razorpay returns a `razorpay_payment_id`, `razorpay_order_id`, and `razorpay_signature`.
   - The frontend immediately sends these details to our verification API endpoint `/api/retail/payment/verify`.
   - The backend cryptographically recreates the signature using your `RAZORPAY_KEY_SECRET` and checks if it matches.
   - If **verified**, it marks the order status to `paid`, stores the transaction ID, and clears the user's cart.
   - The client is redirected to the **My Orders** dashboard.
   - If **cancelled or failed**, the cart is preserved so the customer can retry payment.

---

## Getting Your Razorpay Credentials

To test or go live, you need API keys from the [Razorpay Dashboard](https://dashboard.razorpay.com/):

1. Log into your Razorpay account.
2. Switch to **Test Mode** (for development) or **Live Mode** (for production) using the toggle at the top.
3. Navigate to **Account & Settings** > **API Keys** (under Website Suite).
4. Click **Generate Key**. This will give you:
   - `Key ID`
   - `Key Secret`

---

## Environment Configuration

Open your `.env.local` file (already open in your editor) and add the generated keys:

```env
# Payment (Retail)
RAZORPAY_KEY_ID=rzp_test_xxxxxxx         # Replace with your Razorpay Key ID
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxx    # Replace with your Razorpay Key Secret
```

*Note: Restart your development server (`npm run dev`) after updating `.env.local` to load the new environment variables.*

---

## How to Test Payments in Development (Sandbox Mode)

1. Make sure your `.env.local` has your `rzp_test_...` key and secret.
2. Go to the shop, add a product to the cart, and proceed to Checkout.
3. Click **Place Order**. The Razorpay payment popup will open.
4. Use the following test inputs provided by Razorpay to test different scenarios:

### 1. Card Payments (Test Credentials)
- **Card Number:** Use `4111 1111 1111 1111` (any Visa test card).
- **Expiry:** Any future date (e.g. `12/30`).
- **CVV:** Any 3-digit number (e.g. `123`).
- **Name:** Any name.
- **OTP/Verification:** On the simulator screen, click **Success** to verify a successful transaction, or **Failure** to simulate a failed checkout.

### 2. UPI Payments (Test Credentials)
- Select UPI and enter any test ID (e.g. `success@razorpay` for success, or `fail@razorpay` for failure).

---

## Production Security Notes

- **Webhooks:** In a production environment, it is highly recommended to configure Razorpay Webhooks. If a customer pays but closes their browser before the frontend redirect finishes, the webhook will notify your server to mark the order as paid. 
- You can create a webhook endpoint pointing to `/api/retail/payment/webhook` that listens to `payment.captured` and uses the same cryptographic signature validation.
