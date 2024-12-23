// src/components/ModelItem.tsx
import React, { useEffect, useState } from 'react';
import { getGoodsByModelId, getOptionsByGoodId } from '../utils/directus';

interface Model {
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

interface Good {
  id: number;
  article: string;
  name: string;
  price: string;
  old_price: string | null;
  quantity: string;
  status: string;
  options: number[];
}

interface Option {
  good_id: number;
  id: number;
  option_value: number;
  options_id: number;
}

const ModelItem: React.FC<{ model: Model }> = ({ model }) => {
  const [goods, setGoods] = useState<Good[]>([]);
  const [options, setOptions] = useState<{ [key: number]: Option[] }>({});

  useEffect(() => {
    const fetchGoods = async () => {
      const goodsData = await getGoodsByModelId(model.id);
      setGoods(goodsData);

      const optionsData: { [key: number]: Option[] } = {};
      for (const good of goodsData) {
        const goodOptions = await getOptionsByGoodId(good.id);
        optionsData[good.id] = goodOptions;
      }
      setOptions(optionsData);
    };

    fetchGoods();
  }, [model.id]);

  return (
    <div className="model-item">
      <h2>{model.name}</h2>
      {goods.map(good => (
        <div key={good.id} className="good-item">
          <h3>{good.name}</h3>
          <p>Артикул: {good.article}</p>
          <p>Цена: {good.price} ₽</p>
          <p>Количество: {good.quantity}</p>
          {options[good.id] && (
            <div className="options">
              <h4>Опции:</h4>
              <ul>
                {options[good.id].map(option => (
                  <li key={option.id}>Опция ID: {option.options_id}, Значение: {option.option_value}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ModelItem;