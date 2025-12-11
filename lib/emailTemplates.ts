export function orderConfirmationEmail(data: {
  customerName: string;
  orderNumber: string;
  orderTotal: string;
  items: Array<{ name: string; quantity: number; price: string }>;
}) {
  return {
    subject: `Order Confirmed - ${data.orderNumber}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="color: #ffffff; font-size: 28px; margin: 0; letter-spacing: -0.5px;">DRIZZL</h1>
      <p style="color: #00FF85; font-size: 12px; margin: 4px 0 0 0; letter-spacing: 2px;">WELLNESS</p>
    </div>
    
    <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 32px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="width: 64px; height: 64px; background: rgba(0, 255, 133, 0.1); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
          <span style="color: #00FF85; font-size: 32px;">✓</span>
        </div>
      </div>
      
      <h2 style="color: #ffffff; font-size: 24px; text-align: center; margin: 0 0 8px 0;">Thank you for your order!</h2>
      <p style="color: #86868b; text-align: center; margin: 0 0 32px 0;">Hi ${data.customerName}, your order has been confirmed.</p>
      
      <div style="background: rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <p style="color: #86868b; font-size: 14px; margin: 0 0 4px 0;">Order Number</p>
        <p style="color: #ffffff; font-size: 18px; font-weight: 600; margin: 0;">${data.orderNumber}</p>
      </div>
      
      <div style="border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 24px;">
        <h3 style="color: #ffffff; font-size: 16px; margin: 0 0 16px 0;">Order Summary</h3>
        ${data.items.map(item => `
          <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
            <span style="color: #f5f5f7;">${item.name} × ${item.quantity}</span>
            <span style="color: #f5f5f7;">${item.price}</span>
          </div>
        `).join('')}
        <div style="display: flex; justify-content: space-between; padding: 16px 0 0 0;">
          <span style="color: #ffffff; font-weight: 600;">Total</span>
          <span style="color: #00FF85; font-weight: 600; font-size: 18px;">${data.orderTotal}</span>
        </div>
      </div>
    </div>
    
    <p style="color: #6e6e73; font-size: 14px; text-align: center; margin-top: 32px;">
      You'll receive a shipping confirmation email when your order is on its way.
    </p>
    
    <div style="text-align: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
      <p style="color: #6e6e73; font-size: 12px; margin: 0;">
        © ${new Date().getFullYear()} Drizzl Wellness. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `,
  };
}

export function welcomeEmail(data: { customerName: string }) {
  return {
    subject: 'Welcome to Drizzl Wellness!',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="color: #ffffff; font-size: 28px; margin: 0; letter-spacing: -0.5px;">DRIZZL</h1>
      <p style="color: #00FF85; font-size: 12px; margin: 4px 0 0 0; letter-spacing: 2px;">WELLNESS</p>
    </div>
    
    <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 32px; text-align: center;">
      <h2 style="color: #ffffff; font-size: 28px; margin: 0 0 16px 0;">Welcome, ${data.customerName}!</h2>
      <p style="color: #86868b; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
        We're thrilled to have you join the Drizzl Wellness family. Get ready to experience premium organic smoothies and wellness products.
      </p>
      
      <a href="#" style="display: inline-block; background: #00FF85; color: #000000; text-decoration: none; padding: 14px 32px; border-radius: 100px; font-weight: 600; font-size: 16px;">
        Start Shopping
      </a>
    </div>
    
    <div style="text-align: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
      <p style="color: #6e6e73; font-size: 12px; margin: 0;">
        © ${new Date().getFullYear()} Drizzl Wellness. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `,
  };
}

export function passwordResetEmail(data: { resetLink: string }) {
  return {
    subject: 'Reset Your Password - Drizzl Wellness',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="color: #ffffff; font-size: 28px; margin: 0; letter-spacing: -0.5px;">DRIZZL</h1>
      <p style="color: #00FF85; font-size: 12px; margin: 4px 0 0 0; letter-spacing: 2px;">WELLNESS</p>
    </div>
    
    <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 32px; text-align: center;">
      <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 16px 0;">Reset Your Password</h2>
      <p style="color: #86868b; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
        We received a request to reset your password. Click the button below to create a new password. This link expires in 1 hour.
      </p>
      
      <a href="${data.resetLink}" style="display: inline-block; background: #00FF85; color: #000000; text-decoration: none; padding: 14px 32px; border-radius: 100px; font-weight: 600; font-size: 16px;">
        Reset Password
      </a>
      
      <p style="color: #6e6e73; font-size: 14px; margin: 24px 0 0 0;">
        If you didn't request this, you can safely ignore this email.
      </p>
    </div>
    
    <div style="text-align: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
      <p style="color: #6e6e73; font-size: 12px; margin: 0;">
        © ${new Date().getFullYear()} Drizzl Wellness. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `,
  };
}

export function shippingConfirmationEmail(data: {
  customerName: string;
  orderNumber: string;
  trackingNumber: string;
  carrier: string;
  trackingLink: string;
}) {
  return {
    subject: `Your Order Has Shipped - ${data.orderNumber}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="color: #ffffff; font-size: 28px; margin: 0; letter-spacing: -0.5px;">DRIZZL</h1>
      <p style="color: #00FF85; font-size: 12px; margin: 4px 0 0 0; letter-spacing: 2px;">WELLNESS</p>
    </div>
    
    <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 32px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 48px;">📦</span>
      </div>
      
      <h2 style="color: #ffffff; font-size: 24px; text-align: center; margin: 0 0 8px 0;">Your order is on its way!</h2>
      <p style="color: #86868b; text-align: center; margin: 0 0 32px 0;">Hi ${data.customerName}, great news - your order has shipped!</p>
      
      <div style="background: rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <div style="margin-bottom: 16px;">
          <p style="color: #86868b; font-size: 14px; margin: 0 0 4px 0;">Order Number</p>
          <p style="color: #ffffff; font-size: 16px; font-weight: 500; margin: 0;">${data.orderNumber}</p>
        </div>
        <div style="margin-bottom: 16px;">
          <p style="color: #86868b; font-size: 14px; margin: 0 0 4px 0;">Carrier</p>
          <p style="color: #ffffff; font-size: 16px; font-weight: 500; margin: 0;">${data.carrier}</p>
        </div>
        <div>
          <p style="color: #86868b; font-size: 14px; margin: 0 0 4px 0;">Tracking Number</p>
          <p style="color: #ffffff; font-size: 16px; font-weight: 500; margin: 0;">${data.trackingNumber}</p>
        </div>
      </div>
      
      <div style="text-align: center;">
        <a href="${data.trackingLink}" style="display: inline-block; background: #00FF85; color: #000000; text-decoration: none; padding: 14px 32px; border-radius: 100px; font-weight: 600; font-size: 16px;">
          Track Your Order
        </a>
      </div>
    </div>
    
    <div style="text-align: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
      <p style="color: #6e6e73; font-size: 12px; margin: 0;">
        © ${new Date().getFullYear()} Drizzl Wellness. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `,
  };
}
