// src/pages/catalog.tsx
import React, { useEffect, useState } from 'react';
import { getModels } from '../utils/directus';
import ProductItem from '../components/ModelItem';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Catalog: React.FC = () => {
    const [models, setModels] = useState([]);

    useEffect(() => {
        const fetchModels = async () => {
            const modelsData = await getModels();
            setModels(modelsData);
        };

        fetchModels();
    }, []);

    return (
        <div className="catalog">
            <Header />
            <main>
                <h1>Каталог товаров</h1>
                {models.map((model: any) => (
                    <ProductItem key={model.id} product={model} />
                ))}
            </main>
            <Footer />
        </div>
    );
};

export default Catalog;