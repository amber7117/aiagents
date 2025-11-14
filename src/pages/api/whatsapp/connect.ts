
import { NextApiRequest, NextApiResponse } from 'next';
import connectToWhatsApp from '@/lib/whatsapp';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const sock = await connectToWhatsApp();
      res.status(200).json({ message: 'WhatsApp connected successfully' });
    } catch (error) {
      console.error('Failed to connect to WhatsApp:', error);
      res.status(500).json({ message: 'Failed to connect to WhatsApp' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
