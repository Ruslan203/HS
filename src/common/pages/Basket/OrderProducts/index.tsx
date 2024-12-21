import React from "react";
import styled from "styled-components";
import {useBasket} from "@common/Basket";
import {Title} from "@common/Title";
import {BasketItem} from "@common/api";
import {OrderProductItem, OrderProductList} from "./Product";
import {OrderProductsSkeleton} from "./Skeleton";

export const OrderProductsStyled = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    margin-bottom: 60px;
`;

export const OrderProducts: React.FC = () => {
    const {basketContentsQuery} = useBasket();

    if (basketContentsQuery.isFetching && !basketContentsQuery.data) {
        return <OrderProductsSkeleton />;
    }
    const items: BasketItem[] = basketContentsQuery.data?.items?.items ?? [];

    return (
        <OrderProductsStyled>
            <Title>Ваш заказ</Title>
            <OrderProductList>
                {items.map((item) => (
                    <OrderProductItem key={item.id} basketItem={item} />
                ))}
            </OrderProductList>
        </OrderProductsStyled>
    );
};
