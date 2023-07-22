/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { NextApiRequest, NextApiResponse } from 'next';
import { setPreviewData, redirectToPreviewURL } from '@prismicio/next';

import { createClient } from '../../prismicio';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = createClient({ req });

  await setPreviewData({ req, res });

  await redirectToPreviewURL({ req, res, client });
};
