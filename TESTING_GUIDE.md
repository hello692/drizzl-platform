# Drizzl Wellness Platform - Testing Guide

## Overview

This guide provides step-by-step instructions for testing all backend functionality after deployment.

## Prerequisites

- Database migrations applied
- Environment variables configured
- Application deployed and running
- Stripe test mode enabled

## Test Data

### Stripe Test Cards

Use these for testing payments:

| Card Number | Scenario | CVC | Expiry |
|------------|----------|-----|--------|
| 4242 4242 4242 4242 | Success | Any 3 digits | Any future date |
| 4000 0000 0000 0002 | Decline | Any 3 digits | Any future date |
| 4000 0000 0000 9995 | Insufficient funds | Any 3 digits | Any future date |

## Testing Workflows

### 1. D2C Customer Flow

#### 1.1 Customer Registration

**Endpoint**: `POST /api/auth/register`

**Test**:
```bash
curl -X POST https://your-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "customer": {
    "id": "uuid",
    "email": "test@example.com",
    "first_name": "Test",
    "last_name": "User",
    "loyalty_points": 100,
    "loyalty_tier": "bronze"
  }
}
```

**Verify**:
- [ ] Customer created in database
- [ ] Password is hashed
- [ ] Welcome loyalty points awarded (100 points)
- [ ] Loyalty tier set to bronze

#### 1.2 Customer Login

**Endpoint**: `POST /api/auth/login`

**Test**:
```bash
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "customer": {
    "id": "uuid",
    "email": "test@example.com",
    "first_name": "Test",
    "last_name": "User"
  }
}
```

**Verify**:
- [ ] Login successful with correct credentials
- [ ] Login fails with wrong password
- [ ] Login fails with non-existent email
- [ ] `last_login_at` timestamp updated

#### 1.3 Add to Cart

**Endpoint**: `POST /api/cart/add`

**Test**:
```bash
curl -X POST https://your-domain.com/api/cart/add \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "customer-uuid",
    "productId": "product-uuid",
    "quantity": 2
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "cartItem": {
    "id": "uuid",
    "user_id": "customer-uuid",
    "product_id": "product-uuid",
    "quantity": 2,
    "products": {
      "name": "Product Name",
      "price_cents": 2499
    }
  }
}
```

**Verify**:
- [ ] Item added to cart
- [ ] Quantity updates if item already in cart
- [ ] Stock validation works
- [ ] Guest cart works with session_id

#### 1.4 View Cart

**Endpoint**: `GET /api/cart/get?userId={uuid}`

**Test**:
```bash
curl https://your-domain.com/api/cart/get?userId=customer-uuid
```

**Expected Response**:
```json
{
  "success": true,
  "items": [
    {
      "id": "uuid",
      "product_id": "uuid",
      "quantity": 2,
      "products": {
        "name": "Product Name",
        "price_cents": 2499
      }
    }
  ],
  "subtotal": 4998,
  "itemCount": 2
}
```

**Verify**:
- [ ] All cart items returned
- [ ] Subtotal calculated correctly
- [ ] Item count accurate
- [ ] Product details included

#### 1.5 Update Cart

**Endpoint**: `PUT /api/cart/update`

**Test**:
```bash
curl -X PUT https://your-domain.com/api/cart/update \
  -H "Content-Type: application/json" \
  -d '{
    "cartItemId": "cart-item-uuid",
    "quantity": 5
  }'
```

**Verify**:
- [ ] Quantity updated
- [ ] Item removed if quantity = 0
- [ ] Stock validation works

#### 1.6 Checkout

**Endpoint**: `POST /api/checkout/create-session`

**Test**:
```bash
curl -X POST https://your-domain.com/api/checkout/create-session \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "customer-uuid",
    "items": [
      {
        "product_id": "product-uuid",
        "quantity": 2
      }
    ],
    "shippingAddress": {
      "first_name": "Test",
      "last_name": "User",
      "address_line1": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "postal_code": "94102",
      "country": "US"
    },
    "billingAddress": {
      "first_name": "Test",
      "last_name": "User",
      "address_line1": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "postal_code": "94102",
      "country": "US"
    }
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "sessionId": "cs_test_...",
  "sessionUrl": "https://checkout.stripe.com/...",
  "orderId": "order-uuid",
  "orderNumber": "DRZ000001"
}
```

**Verify**:
- [ ] Stripe session created
- [ ] Order created with "pending" status
- [ ] Order items created
- [ ] Totals calculated correctly (subtotal + tax + shipping)
- [ ] Free shipping applied over $50

#### 1.7 Complete Payment

**Manual Test**:
1. Open `sessionUrl` from checkout response
2. Enter test card: 4242 4242 4242 4242
3. Complete payment
4. Verify redirect to success page

**Verify After Payment**:
- [ ] Order status changed to "paid"
- [ ] Payment status changed to "succeeded"
- [ ] `paid_at` timestamp set
- [ ] Cart cleared for customer
- [ ] Product stock decremented
- [ ] Loyalty points awarded (1 point per dollar)
- [ ] Email confirmation sent (if configured)

#### 1.8 Password Reset

**Step 1 - Request Reset**:
```bash
curl -X POST https://your-domain.com/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

**Step 2 - Reset Password**:
```bash
curl -X POST https://your-domain.com/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "reset-token-from-email",
    "newPassword": "newpassword123"
  }'
```

**Verify**:
- [ ] Reset token generated
- [ ] Reset email sent (if configured)
- [ ] Password updated successfully
- [ ] Can login with new password
- [ ] Old password no longer works

---

### 2. B2B Partner Flow

#### 2.1 Partner Registration

**Manual Test**:
1. Go to `/partner/apply`
2. Fill out partner application form
3. Submit application

**Verify in Database**:
```sql
SELECT * FROM retail_partners 
WHERE business_email = 'partner@example.com';
```

**Check**:
- [ ] Partner record created
- [ ] Status set to "pending"
- [ ] AI scoring calculated (if configured)

#### 2.2 Admin Approval

**Manual Test**:
1. Login as admin
2. Go to admin partner management
3. Approve partner application

**Verify**:
- [ ] Partner status changed to "approved"
- [ ] Partner can now login
- [ ] Partner sees wholesale prices

#### 2.3 B2B Cart

**Endpoint**: Similar to D2C cart but uses `b2b_cart_items` table

**Verify**:
- [ ] Partner can add to B2B cart
- [ ] Wholesale prices displayed
- [ ] Minimum order quantities enforced

#### 2.4 B2B Order

**Verify**:
- [ ] B2B order created separately from D2C orders
- [ ] Wholesale prices applied
- [ ] Payment terms set (NET30, etc.)
- [ ] Order requires approval if over threshold
- [ ] PO number captured

---

### 3. Admin Flow

#### 3.1 Admin Login

**Endpoint**: `POST /api/admin/login`

**Test**:
```bash
curl -X POST https://your-domain.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@drizzlwellness.com",
    "password": "your-admin-password"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "admin": {
    "id": "uuid",
    "email": "admin@drizzlwellness.com",
    "name": "Admin User",
    "role": "super_admin"
  },
  "token": "auth-token"
}
```

**Verify**:
- [ ] Admin can login
- [ ] Token returned
- [ ] Role verified
- [ ] Non-admin users cannot login

#### 3.2 Admin Dashboard Access

**Manual Test**:
1. Login as admin
2. Access admin dashboard
3. View orders, customers, products

**Verify**:
- [ ] Admin dashboard accessible
- [ ] All admin routes protected
- [ ] Non-admin users redirected
- [ ] Super admin has full access

---

## Database Verification

### Check Tables Exist

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'products',
  'customers',
  'cart_items',
  'd2c_orders',
  'd2c_order_items',
  'b2b_orders',
  'b2b_order_items',
  'subscriptions',
  'loyalty_transactions'
)
ORDER BY table_name;
```

**Expected**: All tables should exist

### Check RLS Policies

```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

**Expected**: Policies exist for all tables

### Check Functions

```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public'
AND routine_name IN (
  'generate_order_number',
  'generate_b2b_order_number',
  'decrement_product_stock',
  'update_loyalty_tier'
)
ORDER BY routine_name;
```

**Expected**: All functions exist

---

## Integration Testing

### Stripe Webhook Testing

**Using Stripe CLI**:

1. Install Stripe CLI
2. Forward webhooks to local:
   ```bash
   stripe listen --forward-to localhost:5000/api/checkout/webhook
   ```
3. Trigger test event:
   ```bash
   stripe trigger checkout.session.completed
   ```

**Verify**:
- [ ] Webhook received
- [ ] Order status updated
- [ ] Cart cleared
- [ ] Stock decremented
- [ ] Loyalty points awarded

---

## Performance Testing

### Load Test Cart API

```bash
# Using Apache Bench
ab -n 100 -c 10 https://your-domain.com/api/cart/get?userId=test-uuid
```

**Check**:
- [ ] Response time < 200ms
- [ ] No errors
- [ ] Database connections handled properly

---

## Security Testing

### 1. SQL Injection

**Test**: Try SQL injection in email field
```bash
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com OR 1=1--",
    "password": "anything"
  }'
```

**Expected**: Login should fail, no SQL error

### 2. XSS

**Test**: Try XSS in product name
```bash
curl -X POST https://your-domain.com/api/cart/add \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "uuid",
    "productId": "<script>alert(1)</script>",
    "quantity": 1
  }'
```

**Expected**: Script should be escaped/rejected

### 3. Authorization

**Test**: Try accessing admin endpoint without auth
```bash
curl https://your-domain.com/api/admin/orders
```

**Expected**: 401 Unauthorized

---

## Regression Testing

After any code changes, re-run:

1. [ ] Customer registration
2. [ ] Customer login
3. [ ] Add to cart
4. [ ] Checkout
5. [ ] Payment completion
6. [ ] Admin login

---

## Monitoring

### Check Logs

**Supabase**:
- Go to Logs section
- Check for errors

**Application**:
- Check deployment logs
- Look for uncaught errors

**Stripe**:
- Check webhook logs
- Verify events processed

---

## Troubleshooting Common Issues

### Issue: Cart not loading

**Check**:
1. Database connection
2. `cart_items` table exists
3. RLS policies allow access
4. User ID is correct

### Issue: Checkout fails

**Check**:
1. Stripe keys are correct
2. Products exist and are active
3. Stock is available
4. Environment variables set

### Issue: Webhook not working

**Check**:
1. Webhook URL is correct
2. Webhook secret matches
3. Events are selected in Stripe
4. Endpoint is publicly accessible

---

## Test Completion Checklist

- [ ] All D2C tests passing
- [ ] All B2B tests passing
- [ ] All admin tests passing
- [ ] Database integrity verified
- [ ] Security tests passing
- [ ] Performance acceptable
- [ ] Webhooks working
- [ ] No console errors
- [ ] Mobile responsive (UI)
- [ ] Cross-browser compatible (UI)

---

## Next Steps

After all tests pass:
1. Deploy to production
2. Switch to live Stripe keys
3. Configure production webhooks
4. Set up monitoring
5. Enable error tracking
6. Configure backups
