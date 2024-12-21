import React, {useCallback, useEffect, useState} from "react";
import Image from "next/image";
import NextLink from "next/link";
import styled, {css} from "styled-components";
import {useBasket} from "@common/Basket";
import {Link} from "@common/Link";
import {Skeleton} from "@common/Skeleton";
import {Text} from "@common/Text";
import {TextField} from "@common/TextField";
import {BasketItem, useApi} from "@common/api";
import closeIcon from "./assets/close-icon.svg";

export const OrderProductList = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    margin-top: 40px;
    width: 100%;
`;

export const OrderProductItemStyled = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
`;

export const OrderProductItemMain = styled.div<{divider?: boolean}>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    width: 100%;
    padding: 20px 0px;
    ${({divider = true}) =>
        divider &&
        css`
            border-bottom: 1px solid ${({theme}) => theme.palette.dividers};
        `}
    @media (max-width: 630px) {
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
    }
`;

export const OrderProductItemLeft = styled.div`
    display: flex;
    align-items: center;
`;

export const OrderProductItemRight = styled.div`
    display: flex;
    align-items: center;
    flex-shrink: 0;
    @media (max-width: 630px) {
        align-self: flex-end;
    }
`;

export const OrderProductImageLink = styled(NextLink)`
    display: inline-flex;
    flex-shrink: 0;
`;

export const OrderProductImage = styled(Image)`
    display: inline-flex;
    flex-shrink: 0;
    cursor: pointer;
    width: 80px !important;
    height: 80px !important;
`;

export const OrderProductNotFoundImage = styled(OrderProductImage)`
    background: white;
    cursor: not-allowed;
`;

export const OrderProductName = styled(Link)`
    display: inline-flex;
    margin-left: 20px;
`;

export const OrderProductNameSkeleton = styled(Skeleton)`
    display: inline-flex;
    flex-shrink: 0;
    margin-left: 20px;
    width: 220px !important;
    height: 22px !important;
`;

export const OrderProductCountInput = styled(TextField)`
    display: inline-flex;
    flex-shrink: 0;
    width: 80px;
`;

export const OrderProductCountInputSkeleton = styled(Skeleton)`
    display: inline-flex;
    flex-shrink: 0;
    width: 80px !important;
    height: 40px !important;
`;

export const OrderProductPrice = styled(Text)`
    display: inline-flex;
    font: 500 16px ${({theme}) => theme.fonts.roboto};
    margin-left: 20px;
`;

export const OrderProductPriceSkeleton = styled(Skeleton)`
    display: inline-flex;
    flex-shrink: 0;
    width: 80px !important;
    height: 22px !important;
    margin-left: 20px;
`;

export const OrderProductDeleteButton = styled.button<{skeleton?: boolean}>`
    display: inline-flex;
    margin-left: 40px;
    cursor: pointer;
    border: none;
    padding: 0px;
    background: none;
    ${({skeleton}) =>
        skeleton &&
        css`
            cursor: progress;
            opacity: 0.35;
        `}
`;

export const OrderProductDeleteButtonIcon = styled(Image)`
    display: inline-flex;
`;

export const OrderProductQuantity = styled(Text)`
    display: inline-flex;
    margin-top: 10px;
    font: normal 12px ${({theme}) => theme.fonts.roboto};
    color: #a7a59e;
`;

export const OrderProductQuantitySkeleton = styled(Skeleton)`
    display: inline-flex;
    flex-shrink: 0;
    width: 100px !important;
    height: 16px !important;
    margin-top: 10px;
`;

export interface OrderProductItemProps {
    basketItem: BasketItem;
}

export const OrderProductItem: React.FC<OrderProductItemProps> = ({basketItem}) => {
    const api = useApi();
    const {addBasketBulkMutation, deleteBasketItem} = useBasket();
    const [count, setCount] = useState<string>(String(basketItem.quantity));

    const handleCountChange = useCallback(
        (event: React.ChangeEvent) => {
            const inputEl = event.target as HTMLInputElement;

            setCount(inputEl.value);
        },
        [basketItem]
    );

    const handleDelete = useCallback(() => {
        const id: number = basketItem.item_id;
        const color = Number(basketItem.color);

        deleteBasketItem({
            id,
            color
        });
    }, [basketItem]);

    useEffect(() => {
        const quantity = Number(count);

        if (quantity !== Number(basketItem.quantity) && quantity !== 0) {
            const colors: number[] = [Number(basketItem.color)];
            const sizes: number[] = [basketItem.item_id];

            addBasketBulkMutation.mutate({
                colors,
                sizes,
                quantity
            });
        }
    }, [count]);

    const [imageError, setImageError] = useState(false);

    return (
        <OrderProductItemStyled>
            <OrderProductItemMain>
                <OrderProductItemLeft>
                    {basketItem.image && !imageError ? (
                        <OrderProductImageLink href={basketItem.url}>
                            <OrderProductImage
                                src={api.url(basketItem.image)}
                                width={80}
                                height={80}
                                alt={basketItem.full_name}
                                priority
                                onError={setImageError.bind(null, true)}
                            />
                        </OrderProductImageLink>
                    ) : (
                        <OrderProductNotFoundImage
                            as="div"
                            title="У этого товара нет изображения!"
                        />
                    )}
                    <OrderProductName href={basketItem.url}>
                        {basketItem.full_name}
                    </OrderProductName>
                </OrderProductItemLeft>
                <OrderProductItemRight>
                    <OrderProductCountInput
                        type="number"
                        value={count}
                        min="1"
                        onChange={handleCountChange}
                    />
                    <OrderProductPrice>
                        {api.catalog.utils.formatPrice(Number(basketItem.price))}
                    </OrderProductPrice>
                    <OrderProductDeleteButton onClick={handleDelete}>
                        <OrderProductDeleteButtonIcon
                            src={closeIcon}
                            width={10}
                            height={10}
                            alt="Иконка удаления товара из корзины"
                            priority
                        />
                    </OrderProductDeleteButton>
                </OrderProductItemRight>
            </OrderProductItemMain>
            <OrderProductQuantity>В наличии {basketItem.availability} шт.</OrderProductQuantity>
        </OrderProductItemStyled>
    );
};

export const OrderProductItemSkeleton: React.FC = () => (
    <OrderProductItemStyled>
        <OrderProductItemMain>
            <OrderProductItemLeft>
                <OrderProductImageLink as={Text}>
                    <OrderProductImage as={Skeleton} variant="circular" />
                </OrderProductImageLink>
                <OrderProductNameSkeleton variant="rounded" />
            </OrderProductItemLeft>
            <OrderProductItemRight>
                <OrderProductCountInputSkeleton variant="rounded" />
                <OrderProductPriceSkeleton variant="rounded" />
                <OrderProductDeleteButton skeleton disabled>
                    <OrderProductDeleteButtonIcon
                        src={closeIcon}
                        width={10}
                        height={10}
                        alt="Иконка удаления товара из корзины"
                        priority
                    />
                </OrderProductDeleteButton>
            </OrderProductItemRight>
        </OrderProductItemMain>
        <OrderProductQuantitySkeleton variant="rounded" />
    </OrderProductItemStyled>
);
