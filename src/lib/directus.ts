// src/lib/directus.ts

import { createDirectus, rest } from '@directus/sdk';
import { Model } from '../types/models';
import { Brand } from '../types/brands';
import { Goods } from '../types/goods';
import { Option } from '../types/options';
import { OrderTypes } from '../types/orders';

// Определяем типы для коллекций
type Schema = {
  models: Model[];
  brands: Brand[];
  goods: Goods[];
  options: Option[];
  orders: OrderTypes[];
};

// Создаем экземпляр Directus SDK с указанной схемой
const directus = createDirectus<Schema>(
  process.env.NEXT_PUBLIC_DIRECTUS_URL as string
).with(rest());

export default directus;