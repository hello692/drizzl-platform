import type { NextApiRequest, NextApiResponse } from 'next';
import { loginAdmin } from '../../../lib/adminAuthFixed';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await loginAdmin(email, password);

    if (!result) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.status(200).json({
      success: true,
      admin: result.admin,
      token: result.token
    });
  } catch (error) {
    console.error('Admin login API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
