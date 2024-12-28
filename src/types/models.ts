// types/models.ts
import { Goods } from './goods';

export interface Model {
  id: number;
  name: string;
  status: string;
  applications: string | null;
  brand: number;
  categories: number | null;
  code: string;
  date_created: string;
  date_updated: string;
  images: string[];
  line: number | null;
  user_created: number;
  goods: Goods[]; // Обновляем это поле, если оно должно быть массивом объектов Goods
}