import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.join(process.cwd(), 'public', 'drizzl-platform-code.tar.gz');
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  const fileBuffer = fs.readFileSync(filePath);
  
  res.setHeader('Content-Type', 'application/gzip');
  res.setHeader('Content-Disposition', 'attachment; filename=drizzl-platform-code.tar.gz');
  res.setHeader('Content-Length', fileBuffer.length);
  
  res.send(fileBuffer);
}
