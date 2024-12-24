// src/components/ModelItem.tsx
import React, { useEffect, useState } from 'react';
import { getGoodsByModelId, getOptionsByGoodId } from '../lib/directus';

interface Model {
  id: number;
}

interface Goods {
  id: number;
  name: string;
}

interface Options {
  id: number;
  code: string;
  name: string;
  level: string;
  sort: number | null;
  goods_options: number[];
  models_options: number[];
  values: number[];
}

const ModelItem: React.FC<{ model: Model }> = ({ model }) => {
  const [goods, setGoods] = useState<Goods[]>([]);
  const [options, setOptions] = useState<Options[]>([]);

  useEffect(() => {
    const fetchGoods = async () => {
      try {
        const goodsData = await getGoodsByModelId(model.id);
        setGoods(goodsData);

        if (goodsData.length > 0) {
          const optionsData = await getOptionsByGoodId(goodsData[0].id);
          setOptions(optionsData);
        }
      } catch (error) {
        console.error('Error fetching goods or options:', error);
      }
    };

    fetchGoods();
  }, [model.id]);

  return (
    <div>
      <h2>Model {model.id}</h2>
      <ul>
        {goods.map((good) => (
          <li key={good.id}>{good.name}</li>
        ))}
      </ul>
      <ul>
        {options.map((option) => (
          <li key={option.id}>{option.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ModelItem;