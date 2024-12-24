// src/components/ModelList.tsx
import React from 'react';
import { Model } from '../types/models';
import ModelItem from './ModelItem';

interface ModelListProps {
  models: Model[];
}

const ModelList: React.FC<ModelListProps> = ({ models }) => {
  return (
    <div className="model-list">
      {models.map(model => (
        <ModelItem key={model.id} model={model} />
      ))}
    </div>
  );
};

export default ModelList;