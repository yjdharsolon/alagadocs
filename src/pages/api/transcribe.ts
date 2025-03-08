
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // This will be implemented in Phase 2
  res.status(200).json({ message: 'Transcription endpoint placeholder' });
}
