// src/types/goods.ts

export type Goods = {
  article: string;
  date_created: string;
  date_updated: string;
  id: number;
  images: string[];
  model: number;
  name: string;
  old_price: string | null;
  options: number[];
  orders: number | null; // M2O (Many-to-One relationship)
  price: string;
  price_article: string;
  quantity: string;
  sort: number;
  status: string;
  stock_name: string;
  user_created: string;
  user_updated: string;
};