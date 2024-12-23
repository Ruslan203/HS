// src/types.ts
export interface ModelTypes {
  id: number;
  name: string;
  brand: number;
  code: string;
  date_created: string;
  date_updated: string;
  goods: number[];
  images: string[];
  status: string;
}

export interface CategoryTypes {
  id: number;
  name: string;
  description: string;
}

export interface OrderTypes {
  id: number;
  model_id: number; // Обновлено
  quantity: number;
  total_price: number;
  date_ordered: string;
}