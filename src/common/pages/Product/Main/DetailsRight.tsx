import React, {useCallback, useMemo, useState} from "react";
import Image from "next/image";
import styled from "styled-components";
import {useBasket} from "@common/Basket";
import {Button} from "@common/Button";
import {NotifyMe} from "@common/NotifyMe";
import {Text} from "@common/Text";
import {useApi} from "@common/api";
import {useProduct} from "../Context";

export const ProductDetailsRightStyled = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background: #f4f4f3;
    border-radius: 8px;
    padding: 30px;
    @media (max-width: 1100px) {
        width: 100%;
    }
`;

export const ProductPrice = styled.div`
    display: flex;
    flex-direction: row;
    gap: 16px;
`;

export const ProductPriceText = styled(Text)`
    font: 500 20px ${({theme}) => theme.fonts.roboto};
`;

export const ProductDiscountStyled = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

export const ProductDiscountPercent = styled(Text)`
    display: inline-flex;
    background: ${({theme}) => theme.palette.darkGray};
    color: ${({theme}) => theme.palette.white};
    padding: 5px 8px;
    border-radius: 8px;
    font: normal 11px ${({theme}) => theme.fonts.roboto};
`;

export const ProductDiscountPrice = styled(Text)`
    display: inline-flex;
    font: normal 11px ${({theme}) => theme.fonts.roboto};
    color: ${({theme}) => theme.palette.darkGray};
    text-decoration-line: line-through;
`;

export const ProductButton = styled(Button)`
    width: 184px;
    margin-top: 20px;
    @media (max-width: 1100px) {
        width: 100%;
    }
`;

export const ProductCompliance = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-top: 22px;
`;

export const ProductComplianceItem = styled.div`
    display: inline-flex;
    gap: 14px;
    align-items: center;
`;

export const ProductComplianceLogo = styled(Image)<{$opacity: number}>`
    object-fit: contain;
    object-position: left;
    opacity: ${({$opacity}) => $opacity};
    vertical-align: top;
`;

export const ProductComplianceName = styled(Text)`
    font: normal 11px ${({theme}) => theme.fonts.roboto};
`;

export const ProductQuantity = styled(Text)`
    font: normal 11px ${({theme}) => theme.fonts.roboto};
    margin-top: 16px;
    color: #a7a59e;
`;

export const ProductDetailsRight: React.FC = () => {
    const api = useApi();
    const {quantity, price, discount, compliance, optionSelected} = useProduct();

    const priceNode = useMemo<React.ReactNode>(() => {
        return (
            <ProductPrice>
                <ProductPriceText>{api.catalog.utils.formatPrice(price)}</ProductPriceText>
                {discount ? (
                    <ProductDiscountStyled>
                        <ProductDiscountPercent>-{discount.percent}%</ProductDiscountPercent>
                        <ProductDiscountPrice>
                            {api.catalog.utils.formatPrice(discount.price)}
                        </ProductDiscountPrice>
                    </ProductDiscountStyled>
                ) : null}
            </ProductPrice>
        );
    }, [api, price, discount]);

    const {addSaleItemToBasket} = useBasket();
    const [basketLoading, setBasketLoading] = useState(false);
    const handleBasket = useCallback(async () => {
        if (optionSelected !== null) {
            setBasketLoading(true);
            await addSaleItemToBasket(optionSelected);
            setBasketLoading(false);
        }
    }, [addSaleItemToBasket, optionSelected]);

    return (
        <ProductDetailsRightStyled>
            {priceNode}
            {quantity != 0 ? (
                <ProductButton variant="secondary" loading={basketLoading} onClick={handleBasket}>
                    В корзину
                </ProductButton>
            ) : (
                <NotifyMe>
                    {({openNotifyMeModal}) => (
                        <ProductButton
                            variant="quaternary"
                            onClick={openNotifyMeModal.bind(null, optionSelected)}
                        >
                            Уведомить
                        </ProductButton>
                    )}
                </NotifyMe>
            )}
            {compliance.length > 0 ? (
                <ProductCompliance>
                    {compliance.map(({id, name, logo, logoOpacity, logoHeight}) => (
                        <ProductComplianceItem key={id}>
                            {logo ? (
                                <ProductComplianceLogo
                                    src={logo}
                                    width={52}
                                    height={logoHeight}
                                    alt={name}
                                    priority
                                    $opacity={logoOpacity}
                                />
                            ) : null}
                            <ProductComplianceName>{name}</ProductComplianceName>
                        </ProductComplianceItem>
                    ))}
                </ProductCompliance>
            ) : null}
            <ProductQuantity>
                {quantity != 0 ? <>В наличии {quantity} шт.</> : <>Под заказ 2-3 недели.</>}
            </ProductQuantity>
        </ProductDetailsRightStyled>
    );
};
