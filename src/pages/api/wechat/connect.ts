
import { NextApiRequest, NextApiResponse } from 'next';
import wechaty from '@/lib/wechat';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      await wechaty.start();
      res.status(200).json({ message: 'WeChat connected successfully' });
    } catch (error) {
      console.error('Failed to connect to WeChat:', error);
      res.status(500).json({ message: 'Failed to connect to WeChat' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
