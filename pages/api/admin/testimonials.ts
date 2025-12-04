import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const result = await pool.query(
        'SELECT id, name, photo_url, video_url, product, position, is_active, created_at, updated_at FROM testimonials ORDER BY position ASC'
      );
      return res.status(200).json({ success: true, data: result.rows });
    } catch (error: any) {
      console.error('Error fetching testimonials:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, photo_url, video_url, product } = req.body;
      
      const maxPosResult = await pool.query('SELECT COALESCE(MAX(position), 0) + 1 as next_pos FROM testimonials');
      const nextPosition = maxPosResult.rows[0].next_pos;
      
      const result = await pool.query(
        'INSERT INTO testimonials (name, photo_url, video_url, product, position) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name || '', photo_url || '', video_url || '', product || '', nextPosition]
      );
      
      return res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error: any) {
      console.error('Error creating testimonial:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { order } = req.body;
      
      if (order && Array.isArray(order)) {
        for (let i = 0; i < order.length; i++) {
          await pool.query(
            'UPDATE testimonials SET position = $1, updated_at = NOW() WHERE id = $2',
            [i + 1, order[i]]
          );
        }
        return res.status(200).json({ success: true });
      }
      
      return res.status(400).json({ success: false, error: 'Invalid request' });
    } catch (error: any) {
      console.error('Error updating testimonial order:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
