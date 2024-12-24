// src/lib/apis.ts

import directus from '../lib/directus';
import { readItems, createItem, updateItems } from '@directus/sdk';
import { Model } from '../types/models';
import { Brand } from '../types/brands';
import { Goods } from '../types/goods';
import { Option } from '../types/options';
import { OrderTypes } from '../types/orders'; // Импортируем типы заказов и товаров

// Функция для получения всех моделей с фильтром по статусу
export const getAllModels = async (): Promise<Model[]> => {
  try {
    const results = await directus.request(
      readItems('models', {
        fields: ['id', 'name', 'code', 'status', 'date_created', 'date_updated'] // Указываем необходимые поля
      })
    );
    return results as Model[];
  } catch (error) {
    console.error('Error fetching models:', error);
    throw error;
  }
};

// Функция для создания новой модели
export const createModel = async (data: Model) => {
  try {
    const result = await directus.request(
      createItem('models', data)
    );
    return result;
  } catch (error) {
    console.error('Error creating model:', error);
    throw error;
  }
};

// Обновленная функция для обновления существующей модели
export const updateModel = async (id: number, data: Partial<Model>) => {
  try {
    const results = await directus.request(
      updateItems('models', [id], { ...data })
    );
    console.log(results);
    return `Model updated successfully, Model ID: ${id}`;
  } catch (error) {
    console.error('Error updating model:', error);
    throw error;
  }
};

// Функция для получения всех брендов без фильтра
export const getAllBrands = async () => {
  try {
    const results = await directus.request(
      readItems('brands', {
        fields: ['*'] // Указываем поля здесь
      })
    );
    return results;
  } catch (error) {
    console.error('Error fetching brands:', error);
    throw error;
  }
};

// Функция для создания нового бренда
export const createBrand = async (data: Brand) => {
  try {
    const result = await directus.request(
      createItem('brands', data)
    );
    return result;
  } catch (error) {
    console.error('Error creating brand:', error);
    throw error;
  }
};

// Функция для обновления существующего бренда
export const updateBrand = async (id: number, data: Partial<Brand>) => {
  try {
    const results = await directus.request(
      updateItems('brands', [id], { ...data })
    );
    console.log(results);
    return `Brand updated successfully, Brand ID: ${id}`;
  } catch (error) {
    console.error('Error updating brand:', error);
    throw error;
  }
};

// Функция для получения всех товаров без фильтра
export const getAllGoods = async () => {
  try {
    const results = await directus.request(
      readItems('goods', {
        fields: ['*'] // Указываем поля здесь
      })
    );
    return results;
  } catch (error) {
    console.error('Error fetching goods:', error);
    throw error;
  }
};

// Функция для создания нового товара
export const createGoods = async (data: Goods) => {
  try {
    const result = await directus.request(
      createItem('goods', data)
    );
    return result;
  } catch (error) {
    console.error('Error creating goods:', error);
    throw error;
  }
};

// Функция для обновления существующего товара
export const updateGoods = async (id: number, data: Partial<Goods>) => {
  try {
    const results = await directus.request(
      updateItems('goods', [id], { ...data })
    );
    console.log(results);
    return `Goods updated successfully, Goods ID: ${id}`;
  } catch (error) {
    console.error('Error updating goods:', error);
    throw error;
  }
};

// Функция для получения всех опций без фильтра
export const getAllOptions = async () => {
  try {
    const results = await directus.request(
      readItems('options', {
        fields: ['*'] // Указываем поля здесь
      })
    );
    return results;
  } catch (error) {
    console.error('Error fetching options:', error);
    throw error;
  }
};

// Функция для создания новой опции
export const createOption = async (data: Option) => {
  try {
    const result = await directus.request(
      createItem('options', data)
    );
    return result;
  } catch (error) {
    console.error('Error creating option:', error);
    throw error;
  }
};

// Функция для обновления существующей опции
export const updateOption = async (id: number, data: Partial<Option>) => {
  try {
    const results = await directus.request(
      updateItems('options', [id], { ...data })
    );
    console.log(results);
    return `Option updated successfully, Option ID: ${id}`;
  } catch (error) {
    console.error('Error updating option:', error);
    throw error;
  }
};

// Функция для создания нового заказа
export async function createOrder(orderData: OrderTypes) {
  try {
    // Создаем новый заказ
    const results = await directus.request(
      createItem("orders", { ...orderData })
    );
    console.log(results);

    // Обновляем статус доступности товаров на основе количества
    await Promise.all(orderData.products.map(async (productId) => {
      const product = await directus.request(
        readItems('goods', {
          filter: { id: { _eq: productId } }
        })
      );
      const quantity = product[0]?.quantity || '0';
      const isAvailable = parseInt(quantity, 10) > 0;

      if (!isAvailable) {
        await directus.request(
          updateItems('goods', [productId], { status: 'unavailable' })
        );
      }
    }));

    // Возвращаем сообщение о успешном создании заказа
    return `Order created successfully, Your order No is: ${results.order_no}`;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}