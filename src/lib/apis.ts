import { createDirectus, rest, readItems } from '@directus/sdk';
import { Model } from '../types/models';
import { Goods } from '../types/goods';

// Создаем экземпляр Directus SDK
const directus = createDirectus(
  process.env.NEXT_PUBLIC_DIRECTUS_URL as string
).with(rest());

// Функция для получения всех моделей со статусом 'published' и их товаров
export const getAllModelsWithGoods = async (): Promise<(Model & { goods: Goods[] })[]> => {
  try {
    const modelsResponse = await directus.request(
      readItems('models', {
        filter: {
          status: {
            _eq: 'published',
          }
        }
      })
    );

    const models = modelsResponse as Model[];

    // Получаем товары для каждой модели
    const modelsWithGoods = await Promise.all(models.map(async (model) => {
      const goodsResponse = await directus.request(
        readItems('goods', {
          filter: {
            model: {
              _eq: model.id,
            }
          }
        })
      );

      const goods = goodsResponse as Goods[];
      return { ...model, goods };
    }));

    return modelsWithGoods;
  } catch (error) {
    console.error("Error fetching models with goods:", error);
    return [];
  }
};