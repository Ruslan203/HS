import { Directus } from '@directus/sdk';

const directus = new Directus(process.env.NEXT_PUBLIC_DIRECTUS_URL);

if (process.env.NEXT_PUBLIC_DIRECTUS_TOKEN) {
  directus.auth.static(process.env.NEXT_PUBLIC_DIRECTUS_TOKEN);
}

export default directus;