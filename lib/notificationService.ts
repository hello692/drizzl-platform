const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'Drizzl Wellness <noreply@drizzlwellness.com>';
const COMPANY_NAME = 'Drizzl Wellness';
const PORTAL_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://drizzlwellness.com';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface NotificationResult {
  success: boolean;
  emailSent?: boolean;
  error?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!RESEND_API_KEY) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Email] Resend not configured. Would send email to:', options.to);
      console.log('[Email] Subject:', options.subject);
    }
    return true;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[Email] Failed to send:', error);
      return false;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[Email] Sent successfully to:', options.to);
    }
    return true;
  } catch (error) {
    console.error('[Email] Error sending:', error);
    return false;
  }
}

export async function sendApplicationReceivedNotification(params: {
  email: string;
  contactName: string;
  companyName: string;
}): Promise<NotificationResult> {
  const { email, contactName, companyName } = params;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; margin-bottom: 32px; }
        .logo { font-size: 24px; font-weight: 800; color: #000; }
        .card { background: #f9fafb; border-radius: 12px; padding: 32px; margin: 24px 0; }
        .status { display: inline-block; background: #fef3c7; color: #92400e; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 500; }
        .footer { text-align: center; margin-top: 32px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">DRIZZL WELLNESS</div>
        </div>
        <h2>Thank you for applying, ${contactName}!</h2>
        <div class="card">
          <p><span class="status">Under Review</span></p>
          <p>We've received your Retail Partner application for <strong>${companyName}</strong>.</p>
          <p>Our team is reviewing your application and will get back to you within 1-2 business days.</p>
        </div>
        <p>You'll receive an email once your application has been reviewed with next steps to access your wholesale account.</p>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const emailSent = await sendEmail({
    to: email,
    subject: `Application Received - ${COMPANY_NAME} Retail Partner Program`,
    html,
    text: `Thank you for applying to the ${COMPANY_NAME} Retail Partner Program! We've received your application for ${companyName} and will review it within 1-2 business days.`,
  });

  return { success: true, emailSent };
}

export async function sendApplicationApprovedNotification(params: {
  email: string;
  contactName: string;
  companyName: string;
  loginUrl?: string;
}): Promise<NotificationResult> {
  const { email, contactName, companyName, loginUrl } = params;
  const portalLoginUrl = loginUrl || `${PORTAL_URL}/retail`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; margin-bottom: 32px; }
        .logo { font-size: 24px; font-weight: 800; color: #000; }
        .card { background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 12px; padding: 32px; margin: 24px 0; }
        .status { display: inline-block; background: #10b981; color: #fff; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 600; }
        .button { display: inline-block; background: #000; color: #fff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px; }
        .benefits { background: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .benefits li { margin: 8px 0; }
        .footer { text-align: center; margin-top: 32px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">DRIZZL WELLNESS</div>
        </div>
        <h2>Congratulations, ${contactName}!</h2>
        <div class="card">
          <p><span class="status">APPROVED</span></p>
          <p style="font-size: 18px; margin-top: 16px;">Your Retail Partner application for <strong>${companyName}</strong> has been approved!</p>
        </div>
        <p>Welcome to the ${COMPANY_NAME} Retail Partner Program. You now have access to:</p>
        <div class="benefits">
          <ul>
            <li><strong>Wholesale Pricing</strong> - Exclusive partner discounts</li>
            <li><strong>B2B Ordering Portal</strong> - Easy online ordering</li>
            <li><strong>Priority Support</strong> - Dedicated partner support</li>
            <li><strong>Marketing Resources</strong> - Point-of-sale materials</li>
          </ul>
        </div>
        <p style="text-align: center;">
          <a href="${portalLoginUrl}" class="button">Access Partner Portal</a>
        </p>
        <p style="margin-top: 24px;">Log in with your existing account email: <strong>${email}</strong></p>
        <div class="footer">
          <p>Questions? Contact our partner support team.</p>
          <p>&copy; ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const emailSent = await sendEmail({
    to: email,
    subject: `Approved! Welcome to ${COMPANY_NAME} Retail Partner Program`,
    html,
    text: `Congratulations! Your Retail Partner application for ${companyName} has been approved. Log in to your partner portal at ${portalLoginUrl} with your email: ${email}`,
  });

  return { success: true, emailSent };
}

export async function sendApplicationRejectedNotification(params: {
  email: string;
  contactName: string;
  companyName: string;
  reason?: string;
}): Promise<NotificationResult> {
  const { email, contactName, companyName, reason } = params;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; margin-bottom: 32px; }
        .logo { font-size: 24px; font-weight: 800; color: #000; }
        .card { background: #f9fafb; border-radius: 12px; padding: 32px; margin: 24px 0; }
        .status { display: inline-block; background: #6b7280; color: #fff; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 600; }
        .reason { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-top: 16px; }
        .footer { text-align: center; margin-top: 32px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">DRIZZL WELLNESS</div>
        </div>
        <h2>Application Update</h2>
        <p>Dear ${contactName},</p>
        <div class="card">
          <p><span class="status">Not Approved</span></p>
          <p style="margin-top: 16px;">After careful review, we're unable to approve your Retail Partner application for <strong>${companyName}</strong> at this time.</p>
          ${reason ? `<div class="reason"><strong>Reason:</strong> ${reason}</div>` : ''}
        </div>
        <p>We appreciate your interest in partnering with ${COMPANY_NAME}. If you believe this decision was made in error or your circumstances have changed, please feel free to reach out to our team.</p>
        <p>You may also reapply in the future with updated information.</p>
        <div class="footer">
          <p>Questions? Contact our support team.</p>
          <p>&copy; ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const emailSent = await sendEmail({
    to: email,
    subject: `${COMPANY_NAME} Retail Partner Application Update`,
    html,
    text: `Dear ${contactName}, after careful review, we're unable to approve your Retail Partner application for ${companyName} at this time.${reason ? ` Reason: ${reason}` : ''} If you have questions, please contact our support team.`,
  });

  return { success: true, emailSent };
}
