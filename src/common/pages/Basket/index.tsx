import React, {useMemo} from "react";
import styled from "styled-components";
import {useBasket} from "@common/Basket";
import {Container} from "@common/Container";
import {Page} from "@common/Page";
import {Section} from "@common/Section";
import {Text} from "@common/Text";
import {OrderMake} from "./OrderMake";
import {OrderProducts} from "./OrderProducts";

export const BasketSection = styled(Section)`
    padding: 40px 0px;
    > ${Container} {
        display: flex;
        gap: 40px;
        align-items: flex-start;
        justify-content: space-between;
        @media (max-width: 1000px) {
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
        }
    }
`;

export const BasketEmptySection = styled(Section)`
    padding: 60px 0px;
`;

export const BasketEmptyText = styled(Text)`
    display: block;
    width: 100%;
    text-align: center;
    font-size: 18px;
`;

export const BasketPage: React.FC = () => {
    const {basketContentsQuery} = useBasket();
    const pageTitle = useMemo<string>(() => {
        if (basketContentsQuery.isSuccess && basketContentsQuery.data.items.count !== 0) {
            return `Корзина (${basketContentsQuery.data.items.count})`;
        } else {
            return "Корзина";
        }
    }, [basketContentsQuery.data, basketContentsQuery.isSuccess]);

    if (basketContentsQuery.data && basketContentsQuery.data.items.count === 0) {
        return (
            <Page title={pageTitle}>
                <BasketEmptySection fullHeight>
                    <BasketEmptyText>Ваша корзина пуста.</BasketEmptyText>
                </BasketEmptySection>
            </Page>
        );
    } else {
        return (
            <Page title={pageTitle}>
                <BasketSection>
                    <OrderProducts />
                    <OrderMake />
                </BasketSection>
            </Page>
        );
    }
};
