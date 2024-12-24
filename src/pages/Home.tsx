// src/pages/Home.tsx
import React, { useEffect, useState } from 'react';
import ModelList from '../components/ModelList';
import { getAllModels } from '../lib/apis';
import { Model } from '../types/models';

const Home: React.FC = () => {
  const [models, setModels] = useState<Model[]>([]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const modelsData = await getAllModels();
        setModels(modelsData);
      } catch (error) {
        console.error('Ошибка при получении моделей:', error);
      }
    };

    fetchModels();
  }, []);

  return (
    <section>
      <h1>Hello and Welcome to Directus + Next.js E-commerce</h1>
      <p>Find amazing items for your purchase</p>
      <ModelList models={models} />
    </section>
  );
};

export default Home;