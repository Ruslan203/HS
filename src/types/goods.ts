// types/goods.ts

export type Goods = {
  article: string;
  date_created: string; // ISO 8601 format (Datetime)
  date_updated: string; // ISO 8601 format (Datetime)
  id: number;
  images: string[]; // Предполагаем, что это массив строк (URL изображений)
  model: number;
  name: string;
  old_price: number | null;
  options: number[]; // Массив идентификаторов опций
  price: string;
  price_article: string;
  quantity: string; // Количество товара в наличии
  sort: number;
  status: string;
  stock_name: string;
  user_created: string; // UUID пользователя, создавшего запись
  user_updated: string; // UUID пользователя, обновившего запись
};