import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, error: 'Missing testimonial ID' });
  }

  if (req.method === 'PUT') {
    try {
      const { name, photo_url, video_url, product, is_active, position } = req.body;

      const updateData: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };

      if (name !== undefined) updateData.name = name;
      if (photo_url !== undefined) updateData.photo_url = photo_url;
      if (video_url !== undefined) updateData.video_url = video_url;
      if (product !== undefined) updateData.product = product;
      if (is_active !== undefined) updateData.is_active = is_active;
      if (position !== undefined) updateData.position = position;

      const { error } = await supabaseAdmin
        .from('testimonials')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating testimonial:', error);
        return res.status(500).json({ success: false, error: error.message });
      }

      return res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('Error updating testimonial:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { error } = await supabaseAdmin
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting testimonial:', error);
        return res.status(500).json({ success: false, error: error.message });
      }

      return res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('Error deleting testimonial:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
