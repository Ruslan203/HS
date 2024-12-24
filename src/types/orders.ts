// types/orders.ts

export type OrderTypes = {
  date_created: string; // ISO 8601 format (Datetime)
  date_updated: string; // ISO 8601 format (Datetime)
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  payment_id: string;
  products: number[]; // Массив идентификаторов товаров
  shipping_address: string;
  status: string;
  total_amount: string;
  user_created: string; // UUID пользователя, создавшего запись
  user_updated: string; // UUID пользователя, обновившего запись
};