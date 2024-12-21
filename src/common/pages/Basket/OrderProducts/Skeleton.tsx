import React from "react";
import {Title} from "@common/Title";
import {OrderProductsStyled} from ".";
import {OrderProductItemSkeleton, OrderProductList} from "./Product";

export const OrderProductsSkeleton: React.FC = () => {
    return (
        <OrderProductsStyled>
            <Title>Ваш заказ</Title>
            <OrderProductList>
                {Array(5)
                    .fill(null)
                    .map((_, index) => (
                        <OrderProductItemSkeleton key={index} />
                    ))}
            </OrderProductList>
        </OrderProductsStyled>
    );
};
