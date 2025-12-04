import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const { name, credentials, photo_url, product, is_active, position } = req.body;
      
      const updates: string[] = [];
      const values: any[] = [];
      let paramCount = 1;
      
      if (name !== undefined) { updates.push(`name = $${paramCount++}`); values.push(name); }
      if (credentials !== undefined) { updates.push(`credentials = $${paramCount++}`); values.push(credentials); }
      if (photo_url !== undefined) { updates.push(`photo_url = $${paramCount++}`); values.push(photo_url); }
      if (product !== undefined) { updates.push(`product = $${paramCount++}`); values.push(product); }
      if (is_active !== undefined) { updates.push(`is_active = $${paramCount++}`); values.push(is_active); }
      if (position !== undefined) { updates.push(`position = $${paramCount++}`); values.push(position); }
      
      updates.push(`updated_at = NOW()`);
      values.push(id);
      
      const query = `UPDATE experts SET ${updates.join(', ')} WHERE id = $${paramCount}`;
      await pool.query(query, values);
      
      return res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('Error updating expert:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await pool.query('DELETE FROM experts WHERE id = $1', [id]);
      return res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('Error deleting expert:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
