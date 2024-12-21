import React from 'react';

// Определяем интерфейс для Option
interface Option {
    good_id: number;
    id: number;
    option_value: number;
    options_id: number;
}

// Определяем интерфейс для Model
interface Model {
    applications: unknown;
    brand: number;
    categories: unknown;
    code: string;
    date_created: string;
    date_updated: string;
    goods: number[];
    id: number;
    images: unknown[];
    line: unknown;
    name: string;
    options: unknown[];
    recommendations: unknown;
    status: string;
    structure: unknown;
    text: unknown;
    user_created: string;
}

// Определяем интерфейс для User
interface User {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
}

// Определяем интерфейс для Good
interface Good {
    article: string;
    date_created: string;
    date_updated: string;
    id: number;
    images: unknown[];
    model: Model;
    name: string;
    old_price: string | null;
    options: Option[];
    price: string;
    price_article: string;
    quantity: string;
    sort: unknown;
    status: string;
    stock_name: string;
    user_created: User;
    user_updated: User;
}

// Определяем интерфейс для пропсов компонента
interface CatalogBodyProps {
    goods: Good[];
}

const CatalogBody: React.FC<CatalogBodyProps> = ({ goods }) => {
    return (
        <div>
            <h1>Catalog</h1>
            <ul>
                {goods.map((good) => (
                    <li key={good.id}>
                        <h2>{good.name}</h2>
                        <p>Article: {good.article}</p>
                        <p>Price: {good.price}</p>
                        {good.old_price && <p>Old Price: {good.old_price}</p>}
                        <p>Quantity: {good.quantity}</p>
                        <p>Status: {good.status}</p>
                        <p>Date Created: {new Date(good.date_created).toLocaleDateString()}</p>
                        <p>Date Updated: {new Date(good.date_updated).toLocaleDateString()}</p>
                        <p>Model: {good.model.name}</p>
                        <p>Options: {good.options.map(option => `${option.options_id}: ${option.option_value}`).join(', ')}</p>
                        <p>Created By: {good.user_created.first_name} {good.user_created.last_name} ({good.user_created.email})</p>
                        <p>Updated By: {good.user_updated.first_name} {good.user_updated.last_name} ({good.user_updated.email})</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CatalogBody;