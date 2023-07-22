import { NextApiRequest, NextApiResponse } from 'next';
import { exitPreview } from '@prismicio/next';

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | Response> {
  // eslint-disable-next-line no-return-await
  return await exitPreview({ req, res });
}
