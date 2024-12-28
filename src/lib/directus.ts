import { createDirectus, rest, readItems } from '@directus/sdk';
import { Option } from '../types/options';
import { Goods } from '../types/goods';

// Создаем экземпляр Directus SDK
const directus = createDirectus(
  process.env.NEXT_PUBLIC_DIRECTUS_URL as string
).with(rest());

// Функция для получения всех опций для товара
export const getOptionsForGoods = async (goodId: number): Promise<Option[]> => {
  try {
    const optionsResponse = await directus.request(
      readItems('options', {
        filter: {
          good_id: {
            _eq: goodId
          }
        }
      })
    );

    const options = optionsResponse as Option[];
    return options;
  } catch (error) {
    console.error("Error fetching options for goods:", error);
    return [];
  }
};