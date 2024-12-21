// lib/directus.js
import { Directus } from '@directus/sdk';

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
const directusToken = process.env.NEXT_PUBLIC_DIRECTUS_TOKEN;

if (!directusUrl) {
  throw new Error('NEXT_PUBLIC_DIRECTUS_URL is not defined');
}

const directus = new Directus(directusUrl);

if (directusToken) {
  directus.auth.static(directusToken);
}

export default directus;