// types/brands.ts

export type Brand = {
  code: string;
  id: number;
  logo: string | null;
  models: number[];
  name: string;
  slug: string | null;
};