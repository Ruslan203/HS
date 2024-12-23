import directus from '../utils/directus';
import { Goods } from '../types/goods';
import { Brand } from '../types/brand';
import { Orders } from '../types/orders';

// Получение всех моделей
export const getModels = async () => {
  try {
    const results = await directus.items('models').readMany();
    return results.data;
  } catch (error) {
    console.error('Error fetching models:', error);
    throw error;
  }
};

// Получение всех товаров
export const getGoods = async () => {
  try {
    const results = await directus.items('goods').readMany();
    return results.data;
  } catch (error) {
    console.error('Error fetching goods:', error);
    throw error;
  }
};

// Получение всех брендов
export const getBrands = async () => {
  try {
    const results = await directus.items('brand').readMany();
    return results.data;
  } catch (error) {
    console.error('Error fetching brands:', error);
    throw error;
  }
};

// Получение всех заказов
export const getOrders = async () => {
  try {
    const results = await directus.items('orders').readMany();
    return results.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Создание нового заказа
export const createOrder = async (order: Partial<Orders>) => {
  try {
    const result = await directus.items('orders').createOne(order);
    return result;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Создание нескольких товаров
export const createGoods = async (goods: Partial<Goods>[]) => {
  try {
    const results = await directus.items('goods').createMany(goods);
    return results;
  } catch (error) {
    console.error('Error creating goods:', error);
    throw error;
  }
};