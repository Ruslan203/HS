import React, {useMemo} from "react";
import styled from "styled-components";
import {motion} from "framer-motion";
import {useBasket} from "@common/Basket";
import {SdekScript} from "@common/SdekScript";
import {Skeleton} from "@common/Skeleton";
import {Text} from "@common/Text";
import {useApi} from "@common/api";
import {OrderMakeForm} from "./Form";

export const OrderMakeStyled = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex-shrink: 0;
    background: #f4f4f3;
    border-radius: 8px;
    width: 350px;
    margin-bottom: 80px;
    @media (max-width: 1000px) {
        width: 100%;
    }
`;

export const OrderTotal = styled(motion.div)`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    padding: 25px 30px 30px;
    border-bottom: 1px solid ${({theme}) => theme.palette.dividers};
`;

export const OrderTotalPrice = styled(Text)`
    font: bold 32px ${({theme}) => theme.fonts.roboto};
`;

export const OrderTotalPriceSkeleton = styled(Skeleton)`
    display: inline-flex;
    flex-shrink: 0;
    width: 140px !important;
    height: 36px !important;
    margin-bottom: 4px;
`;

export const OrderTotalDiscount = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    margin-top: 11px;
`;

export const OrderTotalDiscountPercent = styled(Text)`
    display: inline-flex;
    padding: 6px 8px;
    background: ${({theme}) => theme.palette.darkGray};
    border-radius: 8px;
    color: white;
    font: normal 16px ${({theme}) => theme.fonts.roboto};
`;

export const OrderTotalDiscountPercentSkeleton = styled(Skeleton)`
    display: inline-flex;
    flex-shrink: 0;
    width: 50px !important;
    height: 31px !important;
`;

export const OrderTotalDiscountPrice = styled(Text)`
    display: flex;
    font: normal 16px ${({theme}) => theme.fonts.roboto};
    color: ${({theme}) => theme.palette.darkGray};
    text-decoration-line: line-through;
`;

export const OrderTotalDiscountPriceSkeleton = styled(Skeleton)`
    display: inline-flex;
    flex-shrink: 0;
    width: 64px !important;
    height: 20px !important;
`;

export const OrderTotalCount = styled(Text)`
    font: normal 16px ${({theme}) => theme.fonts.roboto};
    margin-top: 18px;
`;

export const OrderTotalCountSkeleton = styled(Skeleton)`
    display: inline-flex;
    flex-shrink: 0;
    width: 152px !important;
    height: 20px !important;
    margin-top: 15px;
`;

export const OrderMake: React.FC = () => {
    const api = useApi();
    const {basketContentsQuery, basketCountQuery} = useBasket();

    const totalNode = useMemo<React.ReactNode>(() => {
        if (
            basketContentsQuery.data &&
            (!basketContentsQuery.isFetching || !basketContentsQuery.isFetchedAfterMount) &&
            (!basketCountQuery.isFetching || !basketCountQuery.isFetchedAfterMount)
        ) {
            const {sum, full_sum, count, discount_procent} = basketContentsQuery.data.items;

            return (
                <OrderTotal>
                    <OrderTotalPrice>{api.catalog.utils.formatPrice(sum)}</OrderTotalPrice>
                    {discount_procent !== 0 ? (
                        <OrderTotalDiscount>
                            <OrderTotalDiscountPercent>
                                -{discount_procent}%
                            </OrderTotalDiscountPercent>
                            <OrderTotalDiscountPrice>
                                {api.catalog.utils.formatPrice(full_sum)}
                            </OrderTotalDiscountPrice>
                        </OrderTotalDiscount>
                    ) : null}
                    <OrderTotalCount>Итого за {count} товаров</OrderTotalCount>
                </OrderTotal>
            );
        } else {
            return (
                <OrderTotal>
                    <OrderTotalPriceSkeleton variant="rounded" />
                    <OrderTotalDiscount>
                        <OrderTotalDiscountPercentSkeleton variant="rounded" />
                        <OrderTotalDiscountPriceSkeleton variant="rounded" />
                    </OrderTotalDiscount>
                    <OrderTotalCountSkeleton variant="rounded" />
                </OrderTotal>
            );
        }
    }, [
        basketContentsQuery.data,
        basketContentsQuery.isFetching,
        basketContentsQuery.isFetchedAfterMount,
        basketCountQuery.isFetching,
        basketCountQuery.isFetchedAfterMount
    ]);

    return (
        <OrderMakeStyled>
            <SdekScript />
            {totalNode}
            <OrderMakeForm />
        </OrderMakeStyled>
    );
};
