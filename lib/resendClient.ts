import { Resend } from 'resend';

let connectionSettings: any;

async function getReplitCredentials(): Promise<{ apiKey: string; fromEmail: string } | null> {
  try {
    const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
    if (!hostname) return null;
    
    const xReplitToken = process.env.REPL_IDENTITY 
      ? 'repl ' + process.env.REPL_IDENTITY 
      : process.env.WEB_REPL_RENEWAL 
      ? 'depl ' + process.env.WEB_REPL_RENEWAL 
      : null;

    if (!xReplitToken) return null;

    connectionSettings = await fetch(
      'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
      {
        headers: {
          'Accept': 'application/json',
          'X_REPLIT_TOKEN': xReplitToken
        }
      }
    ).then(res => res.json()).then(data => data.items?.[0]);

    if (!connectionSettings?.settings?.api_key) {
      return null;
    }
    
    return {
      apiKey: connectionSettings.settings.api_key, 
      fromEmail: connectionSettings.settings.from_email || 'onboarding@resend.dev'
    };
  } catch {
    return null;
  }
}

export async function getUncachableResendClient() {
  // Try Replit connector first
  const replitCreds = await getReplitCredentials();
  if (replitCreds) {
    return {
      client: new Resend(replitCreds.apiKey),
      fromEmail: replitCreds.fromEmail
    };
  }
  
  // Fall back to environment variables (for Vercel/production)
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  
  if (!apiKey) {
    throw new Error('Resend not configured: RESEND_API_KEY environment variable is required');
  }
  
  return {
    client: new Resend(apiKey),
    fromEmail
  };
}
