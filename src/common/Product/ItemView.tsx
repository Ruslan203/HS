import React, {useEffect, useMemo, useRef, useState} from "react";
import Image from "next/image";
import styled, {css} from "styled-components";
import {Fancybox} from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import {motion} from "framer-motion";
import {useBody} from "@common/Body";
import {Button} from "@common/Button";
import {Link} from "@common/Link";
import {Text} from "@common/Text";
import {useApi} from "@common/api";
import starPlus from "@common/icons/assets/star-plus.svg";
import {ProductStars} from "./Stars";
import filterColorDisabled from "./assets/color-disabled.svg";

export const ProductItemStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 28px 0px;
    &:not(:last-child) {
        border-bottom: 1px solid ${({theme}) => theme.palette.dividers};
    }
`;

export const ProductItemContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 30px;
    @media (max-width: 770px) {
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
    }
`;

export const ProductLeft = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 30px;
`;

export const ProductMainInfo = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 30px;
    @media (max-width: 580px) {
        width: 100%;
        column-gap: 15px;
    }
`;

export const ProductMainInfoContent = styled.div`
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    width: 100%;
`;

export const ProductCompany = styled(Link)`
    color: #a7a59e;
    font: 500 12px ${({theme}) => theme.fonts.roboto};
    text-transform: uppercase;
`;

export const ProductName = styled(Link)`
    font: 500 20px ${({theme}) => theme.fonts.roboto};
    margin-top: 10px;
    line-height: 1.35;
    @media (max-width: 580px) {
        font-size: 16px;
    }
`;

export const ProductItemStars = styled(ProductStars)`
    margin-top: 11px;
`;

export const ProductDesc = styled.div`
    margin-top: 36px;
`;

export const ProductDescList = styled.ul`
    list-style: none;
    padding: 0px;
    margin: 0px;
`;

export const ProductDescItem = styled.li`
    font: normal 14px ${({theme}) => theme.fonts.roboto};
    color: ${({theme}) => theme.palette.black};
    line-height: 1.5;
`;

export const ProductDescLink = styled(Link)`
    font-size: inherit;
    font-weight: 500;
`;

export const ProductRight = styled.div<{$fixed: boolean}>`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding-top: 20px;
    @media (max-width: 770px) {
        background: #f4f4f3;
        border-radius: 8px;
        width: 100%;
        padding: 30px;
        ${({$fixed}) =>
            $fixed &&
            css`
                position: fixed;
                width: auto;
                bottom: 0px;
                left: 25px;
                right: 25px;
                border-bottom-left-radius: 0px;
                border-bottom-right-radius: 0px;
            `}
    }
`;

export const ProductRightOffset = styled.div<{$fixed: boolean}>`
    display: none;
    @media (max-width: 770px) {
        ${({$fixed}) =>
            $fixed &&
            css`
                display: flex;
                width: 100%;
                height: 230px;
            `}
    }
`;

export const ProductPrice = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
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
    @media (max-width: 850px) {
        width: 130px;
    }
    @media (max-width: 770px) {
        width: 100%;
    }
`;

export const ProductRating = styled(Text)`
    display: inline-flex;
    align-items: flex-start;
    line-height: 1;
    gap: 4px;
    font: normal 11px ${({theme}) => theme.fonts.roboto};
    margin-top: 16px;
    &:before {
        display: inline-flex;
        width: 20px;
        height: 12px;
        background: url(${starPlus.src});
        content: "";
    }
`;

export const ProductCompliance = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-top: 16px;
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
    margin-top: 14px;
    color: #a7a59e;
`;

export const ProductFilter = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

export const ProductFilterParamStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const ProductFilterParamLabel = styled(Text)`
    font: normal 16px ${({theme}) => theme.fonts.roboto};
`;

export const ProductFilterParamVariants = styled.div`
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    max-width: 540px;
`;

export interface ProductFilterParamProps extends React.PropsWithChildren {
    label: string;
}

export const ProductFilterParam: React.FC<ProductFilterParamProps> = ({label, children}) => {
    if (React.Children.count(children) <= 1) {
        return null;
    }

    return (
        <ProductFilterParamStyled>
            <ProductFilterParamLabel>{label}:</ProductFilterParamLabel>
            <ProductFilterParamVariants>{children}</ProductFilterParamVariants>
        </ProductFilterParamStyled>
    );
};

export const ProductFilterButtonStyled = styled.button<{$selected: boolean; $disabled: boolean}>`
    display: inline-flex;
    justify-content: center;
    padding: 12px 21px;
    background: ${({theme}) => theme.palette.white};
    color: ${({theme}) => theme.palette.black};
    border: none;
    border-radius: 6px;
    font: normal 14px ${({theme}) => theme.fonts.roboto};
    ${({$selected, theme}) => {
        if ($selected) {
            return css`
                box-shadow: inset 0px 0px 0px 2px ${theme.palette.black};
                cursor: default;
            `;
        } else {
            return css`
                box-shadow: inset 0px 0px 0px 1px ${theme.palette.gray};
                cursor: pointer;
            `;
        }
    }}
    ${({$disabled}) =>
        $disabled &&
        css`
            cursor: not-allowed;
            background: #f5f5f5;
        `}
`;

export interface ProductFilterButtonProps extends React.PropsWithChildren {
    selected?: boolean;
    disabled?: boolean;
    onClick?: () => unknown;
}

export const ProductFilterButton: React.FC<ProductFilterButtonProps> = ({
    selected = false,
    disabled = false,
    children,
    onClick
}) => (
    <ProductFilterButtonStyled
        $selected={selected}
        disabled={disabled}
        $disabled={disabled}
        onClick={onClick}
    >
        {children}
    </ProductFilterButtonStyled>
);

export const ProductFilterColorButtonStyled = styled.button<{
    $color: string;
    $selected: boolean;
    $disabled: boolean;
    $secondColor: string | null;
}>`
    display: inline-flex;
    position: relative;
    width: 40px;
    height: 40px;
    border: 5px solid ${({theme, $secondColor}) => $secondColor ?? theme.palette.white};
    border-radius: 50%;
    background: ${({$color}) => $color};
    box-shadow: 0px 0px 0px 1px
        ${({$selected, theme}) => ($selected ? theme.palette.black : theme.palette.gray)};
    ${({$disabled, $selected, $color}) =>
        $disabled
            ? css`
                  cursor: not-allowed;
                  box-shadow: none;
                  border-color: ${$color};
              `
            : css`
                  cursor: ${$selected ? "default" : "pointer"};
              `}
`;

export const ProductFilterColorButtonDisabledIcon = styled(Image)`
    display: inline-flex;
    position: absolute;
    top: -6px;
    left: -6px;
    image-rendering: optimizeQuality;
`;

export interface ProductFilterColorButtonProps {
    color: string;
    secondColor?: string | null;
    name?: string;
    selected?: boolean;
    disabled?: boolean;
    onClick?: () => unknown;
}

export const ProductFilterColorButton: React.FC<ProductFilterColorButtonProps> = ({
    color,
    secondColor = null,
    name,
    selected = false,
    disabled = false,
    onClick
}) => (
    <ProductFilterColorButtonStyled
        title={name}
        $color={color}
        $selected={selected}
        $disabled={disabled}
        $secondColor={secondColor}
        disabled={disabled}
        onClick={onClick}
    >
        {disabled ? (
            <ProductFilterColorButtonDisabledIcon
                src={filterColorDisabled}
                width={42}
                height={42}
                alt="Иконка недоступного цвета"
                priority
            />
        ) : null}
    </ProductFilterColorButtonStyled>
);

export const ProductImageContainer = styled(motion.a)`
    display: inline-flex;
    position: relative;
    flex-shrink: 0;
    width: 255px;
    height: 255px;
    @media (max-width: 850px) {
        width: 184px;
        height: 184px;
    }
    @media (max-width: 770px) {
        width: 255px;
        height: 255px;
    }
    @media (max-width: 650px) {
        width: 184px;
        height: 184px;
    }
    @media (max-width: 580px) {
        width: 160px;
        height: 160px;
    }
    @media (max-width: 435px) {
        width: 140px;
        height: 140px;
    }
    @media (max-width: 400px) {
        width: 120px;
        height: 120px;
    }
`;

export const ProductImageNotFound = styled(ProductImageContainer)`
    cursor: not-allowed;
`;

export const ProductImage = styled(Image)`
    display: inline-flex;
    cursor: pointer;
`;

export interface ProductDiscount {
    percent: number;
    price: number;
}

export interface ProductComplianceItem {
    id: number;
    name: string;
    logo: string | null;
    logoOpacity?: number;
    logoHeight?: number;
}

export interface ProductDescriptionItem {
    name: string | null;
    value: string;
    url: string | null;
}

export interface ProductItemViewProps {
    image?: string | null;
    fullScreenImage?: string | null;
    company?: string | null;
    name: string;
    stars?: number | null;
    desc: ProductDescriptionItem[];
    price: number;
    pageUrl: string;
    companyPageUrl?: string;
    discount?: ProductDiscount | null;
    quantity?: number;
    compliance?: ProductComplianceItem[];
    filter?: React.ReactNode;
    basketLoading?: boolean;
    onBasket?: () => unknown;
    onNotifyMe?: () => unknown;
}

export const ProductItemView: React.FC<ProductItemViewProps> = ({
    image = null,
    fullScreenImage = null,
    name,
    company = null,
    stars = null,
    desc,
    price,
    pageUrl,
    companyPageUrl,
    discount = null,
    quantity = 0,
    compliance,
    filter,
    basketLoading = false,
    onBasket,
    onNotifyMe
}) => {
    const api = useApi();
    const {lockScroll, unlockScroll} = useBody();
    const productRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        const productEl: HTMLDivElement | null = productRef.current;

        if (productEl) {
            Fancybox.bind(productEl, "[data-fancybox]", {
                hideScrollbar: false,
                on: {
                    ready: lockScroll,
                    close: unlockScroll
                }
            });
        }

        return () => {
            if (productEl) {
                Fancybox.unbind(productEl, "[data-fancybox]");
            }
        };
    }, [productRef]);

    const [rightFixed, setRightFixed] = useState(false);
    useEffect(() => {
        const scrollListener = () => {
            const productEl: HTMLDivElement | null = productRef.current;

            if (!productEl) {
                return;
            }

            function offset(el: Element) {
                const rect = el.getBoundingClientRect(),
                    scrollLeft = window.scrollX || document.documentElement.scrollLeft,
                    scrollTop = window.scrollY || document.documentElement.scrollTop;

                return {top: rect.top + scrollTop, left: rect.left + scrollLeft};
            }

            const productHeight = productEl.offsetHeight;
            const productOffset = offset(productEl).top;
            const productOffsetBottom = productEl.offsetHeight - 150;
            const productStart = 6;

            let productPoint = window.innerHeight - productHeight / productStart;
            if (productHeight > window.innerHeight) {
                productPoint = window.innerHeight - window.innerHeight / productStart;
            }
            if (window.scrollY > productOffset + productOffsetBottom - productPoint) {
                setRightFixed(false);
            } else {
                setRightFixed(window.scrollY > productOffset + 300 - productPoint);
            }
        };

        scrollListener();
        window.addEventListener("scroll", scrollListener);

        return () => {
            window.removeEventListener("scroll", scrollListener);
        };
    }, []);

    const [imageError, setImageError] = useState<boolean>(false);
    const [imageLoaded, setImageLoaded] = useState<boolean>(true);
    const isImageMounted = useRef(false);

    useEffect(() => {
        if (isImageMounted.current) {
            setImageLoaded(false);
            setImageError(false);
        } else {
            isImageMounted.current = true;
        }
    }, [image]);

    return (
        <ProductItemStyled ref={productRef}>
            <ProductItemContainer>
                <ProductLeft>
                    <ProductMainInfo>
                        {image && !imageError ? (
                            <ProductImageContainer
                                animate={{opacity: imageLoaded ? 1 : 0.4}}
                                data-fancybox
                                href={fullScreenImage ?? image}
                            >
                                <ProductImage
                                    src={image}
                                    alt={name}
                                    title={name}
                                    fill
                                    sizes="(max-width: 500px) 33vw"
                                    priority
                                    onLoadStart={setImageLoaded.bind(null, false)}
                                    onError={setImageError.bind(null, true)}
                                    onLoad={setImageLoaded.bind(null, true)}
                                />
                            </ProductImageContainer>
                        ) : (
                            <ProductImageNotFound title="У этого товара нет изображения!" />
                        )}
                        <ProductMainInfoContent>
                            {company ? (
                                <ProductCompany href={companyPageUrl ?? pageUrl}>
                                    {company}
                                </ProductCompany>
                            ) : null}
                            <ProductName href={pageUrl}>{name}</ProductName>
                            {stars !== null ? <ProductItemStars stars={stars} /> : null}
                            {desc.length !== 0 ? (
                                <ProductDesc>
                                    <ProductDescList>
                                        {desc.map((item, index) => (
                                            <ProductDescItem key={index}>
                                                {item.name ? <>{item.name}: </> : null}
                                                {item.url ? (
                                                    <ProductDescLink href={item.url}>
                                                        {item.value}
                                                    </ProductDescLink>
                                                ) : (
                                                    item.value
                                                )}
                                            </ProductDescItem>
                                        ))}
                                    </ProductDescList>
                                </ProductDesc>
                            ) : null}
                        </ProductMainInfoContent>
                    </ProductMainInfo>
                    {filter}
                </ProductLeft>
                <ProductRight $fixed={rightFixed}>
                    {priceNode}
                    {compliance?.length ? (
                        <ProductCompliance>
                            {compliance.map(
                                ({id, name, logo, logoOpacity = 1, logoHeight = 20}) => (
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
                                )
                            )}
                        </ProductCompliance>
                    ) : null}
                    <ProductQuantity>
                        {quantity != 0 ? <>В наличии {quantity} шт.</> : <>Под заказ 2-3 недели.</>}
                    </ProductQuantity>
                    {quantity != 0 ? (
                        <ProductButton
                            variant="secondary"
                            loading={basketLoading}
                            onClick={onBasket}
                        >
                            В корзину
                        </ProductButton>
                    ) : (
                        <ProductButton variant="quaternary" onClick={onNotifyMe}>
                            Уведомить
                        </ProductButton>
                    )}
                </ProductRight>
                <ProductRightOffset $fixed={rightFixed} />
            </ProductItemContainer>
        </ProductItemStyled>
    );
};
