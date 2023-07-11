import { enableAutoPreviews } from '@prismicio/next';
import { createClient } from '../prismicio';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function getPrismicClient() {
  const client = createClient({
    // accessToken: process.env.PRISMIC_TOKEN_API,
  });

  enableAutoPreviews({
    client,
    // req: config.req,
  });

  return client;
}
