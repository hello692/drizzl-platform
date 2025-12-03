import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('Missing Supabase credentials');
  console.log('URL:', supabaseUrl ? 'Set' : 'Missing');
  console.log('Service Key:', supabaseServiceKey ? 'Set' : 'Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createTestUser() {
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'demo@drizzlwellness.com',
      password: 'Demo2024!',
      email_confirm: true,
      user_metadata: {
        name: 'Demo User'
      }
    });

    if (error) {
      if (error.message.includes('already been registered')) {
        console.log('User already exists!');
        console.log('Email: demo@drizzlwellness.com');
        console.log('Password: Demo2024!');
      } else {
        console.log('Error:', error.message);
      }
    } else {
      console.log('Test user created successfully!');
      console.log('Email: demo@drizzlwellness.com');
      console.log('Password: Demo2024!');
    }
  } catch (err) {
    console.log('Error:', err.message);
  }
}

createTestUser();
