import { NextApiRequest, NextApiResponse } from 'next';
import { join } from 'path';
import { promises as fs } from 'fs';

const staticDir = join(process.cwd(), 'public', 'static');

export default async function handler(req, res) {
  const { path = [] } = req.query;
  const filePath = join(staticDir, Array.isArray(path) ? path.join('/') : path);

  try {
    const fileContent = await fs.readFile(filePath);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(fileContent);
  } catch {
    res.status(404).send('File not found');
  }
}
