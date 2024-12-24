// types/models.ts

// types/models.ts

export type Model = {
  applications: string | null; // textarea
  brand: number; // M2O (Many-to-One relationship)
  categories: number | null; // M2O (Many-to-One relationship)
  code: string; // slug
  date_created: string; // ISO 8601 format (Datetime)
  date_updated: string; // ISO 8601 format (Datetime)
  goods: number[]; // O2M (One-to-Many relationship)
  id: number; // input
  images: string[]; // Files (assuming array of URLs or file paths)
  line: number | null; // M2O (Many-to-One relationship)
  name: string; // Input
  options: number[]; // O2M (One-to-Many relationship)
  recommendations: string | null; // текстовые данные
  status: string; // published
  structure: string | null; // текстовые данные
  text: string | null; // WYSIWYG
  user_created: number; // M2O (Many-to-One relationship)
};