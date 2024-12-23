// src/types/goods.ts
export type Goods = {
    id: number;
    model: number;
    article: string;
    name: string;
    price: number;
    old_price: number | null;
    quantity: number;
    status: string;
    options: number[];
  };