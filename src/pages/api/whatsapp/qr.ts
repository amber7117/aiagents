
import { NextApiRequest, NextApiResponse } from 'next';
import connectToWhatsApp from '@/lib/whatsapp';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Use a unique session ID, e.g., from user session or a random ID
      const sessionId = `session-${Date.now()}`;
      
      const qrPromise = new Promise<string>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('QR code generation timed out.'));
        }, 30000); // 30-second timeout

        connectToWhatsApp(sessionId, (qr) => {
          clearTimeout(timeout);
          resolve(qr);
        }).catch(err => {
            clearTimeout(timeout);
            reject(err)
        });
      });

      const qr = await qrPromise;
      res.status(200).json({ qr });

    } catch (error: any) {
      console.error('Failed to get WhatsApp QR code:', error);
      res.status(500).json({ message: error.message || 'Failed to get QR code' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
