import React, {useCallback, useMemo} from "react";
import Image from "next/image";
import styled, {css} from "styled-components";
import {Link} from "@common/Link";
import {ProductStars} from "@common/Product/Stars";
import filterColorDisabled from "@common/Product/assets/color-disabled.svg";
import {Text} from "@common/Text";
import {Tooltip} from "@common/Tooltip";
import {
    GetFilterParamsSelectedResult,
    SaleFilterParam,
    SaleFilterParamOption,
    useApi
} from "@common/api";
import {useProduct} from "../Context";

export const ProductDetailsStyled = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex-shrink: 1;
`;

export const ProductCompany = styled(Link)`
    color: #a7a59e;
    font: 500 12px ${({theme}) => theme.fonts.roboto};
    text-transform: uppercase;
`;

export const ProductName = styled(Text)`
    font: 500 20px ${({theme}) => theme.fonts.roboto};
    line-height: 1.5;
    margin-top: 10px;
    max-width: 550px;
    @media (max-width: 500px) {
        font: 500 17px ${({theme}) => theme.fonts.roboto};
    }
`;

export const ProductDesc = styled.div`
    margin-top: 25px;
    max-width: 550px;
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

export const ProductEvaluations = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
`;

export const ProductEvaluationsText = styled(Text)``;

export const ProductFilter = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 20px;
`;

export const ProductFilterParamStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const ProductFilterParamLabel = styled(Text)`
    font: normal 14px ${({theme}) => theme.fonts.roboto};
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

export const ProductFilterParam: React.FC<ProductFilterParamProps> = ({label, children}) => (
    <ProductFilterParamStyled>
        <ProductFilterParamLabel>{label}:</ProductFilterParamLabel>
        <ProductFilterParamVariants>{children}</ProductFilterParamVariants>
    </ProductFilterParamStyled>
);

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

export interface FilterColorButtonProps {
    $color: string;
    $selected: boolean;
    $disabled: boolean;
    $secondColor: string | null;
}

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

export const ProductCare = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 35px;
`;

export const ProductCareItem = styled.span`
    display: inline-flex;
`;

export const ProductCareLogo = styled(Image)`
    display: inline-flex;
    object-fit: contain;
    opacity: 0.4;
`;

export const ProductDetails: React.FC = () => {
    const api = useApi();
    const {
        brand,
        name,
        stars,
        sold,
        desc,
        filterParams,
        filterParamsSelected,
        filterParamsSelectedResult,
        setFilterParamsSelectedResult,
        filterParamsAvailable,
        care,
        optionsIds
    } = useProduct();

    const handleFilterParamSelect = useCallback(
        (param: SaleFilterParam, option: SaleFilterParamOption) => {
            const prev: GetFilterParamsSelectedResult = filterParamsSelectedResult;

            setFilterParamsSelectedResult(
                api.catalog.utils.getFilterParamsSelected({
                    filterParams,
                    optionsIds,
                    prev,
                    param,
                    option
                })
            );
        },
        [api, filterParams, optionsIds, filterParamsSelectedResult]
    );

    const soldName = useMemo<string>(() => {
        if (sold === 1) {
            return "оценка";
        } else if (sold === 2 || sold === 3 || sold === 4) {
            return "оценки";
        } else {
            return "оценок";
        }
    }, [sold]);

    return (
        <ProductDetailsStyled>
            {brand ? <ProductCompany href={brand.url}>{brand.name}</ProductCompany> : null}
            <ProductName>{name}</ProductName>
            <ProductEvaluations>
                <ProductStars stars={stars} />
                <ProductEvaluationsText>
                    {sold} {soldName}
                </ProductEvaluationsText>
            </ProductEvaluations>
            {desc.length !== 0 ? (
                <ProductDesc>
                    <ProductDescList>
                        {desc.map((item, index) => (
                            <ProductDescItem key={index}>
                                {item.name ? <>{item.name}: </> : null}
                                {item.url ? (
                                    <ProductDescLink href={item.url}>{item.value}</ProductDescLink>
                                ) : (
                                    item.value
                                )}
                            </ProductDescItem>
                        ))}
                    </ProductDescList>
                </ProductDesc>
            ) : null}
            <ProductFilter>
                {filterParams.map((param) => {
                    const {id, name, code, options} = param;

                    if (code === "color") {
                        const colorOptions: SaleFilterParamOption[] = options.sort(
                            (optionA, optionB) => {
                                const availableA: boolean = filterParamsAvailable[code][optionA.id];
                                const availableB: boolean = filterParamsAvailable[code][optionB.id];

                                if (!availableA && availableB) {
                                    return 1;
                                } else if (availableA && !availableB) {
                                    return -1;
                                } else {
                                    return 0;
                                }
                            }
                        );

                        return (
                            <ProductFilterParam key={id} label={name}>
                                {colorOptions.map((option) => {
                                    const {id, name, color} = option;
                                    const selected: boolean = id === filterParamsSelected[code]?.id;
                                    const available: boolean = filterParamsAvailable[code][id];
                                    const handleButtonClick = handleFilterParamSelect.bind(
                                        null,
                                        param,
                                        option
                                    );

                                    if (color === null) {
                                        return null;
                                    }
                                    return (
                                        <ProductFilterColorButton
                                            key={id}
                                            color={color[0]}
                                            secondColor={color[1]}
                                            name={name}
                                            selected={selected}
                                            disabled={!available}
                                            onClick={handleButtonClick}
                                        />
                                    );
                                })}
                            </ProductFilterParam>
                        );
                    } else {
                        return (
                            <ProductFilterParam key={id} label={name}>
                                {options.map((option) => {
                                    const {id, name} = option;
                                    const selected = id === filterParamsSelected[code]?.id;
                                    const available: boolean =
                                        filterParamsAvailable[code]?.[id] ?? false;
                                    const handleButtonClick = handleFilterParamSelect.bind(
                                        null,
                                        param,
                                        option
                                    );

                                    return (
                                        <ProductFilterButton
                                            key={id}
                                            selected={selected}
                                            disabled={!available}
                                            onClick={handleButtonClick}
                                        >
                                            {name}
                                        </ProductFilterButton>
                                    );
                                })}
                            </ProductFilterParam>
                        );
                    }
                })}
            </ProductFilter>
            {care.length !== 0 ? (
                <ProductCare>
                    {care.map((item, index) => (
                        <Tooltip key={index} title={item.name} placement="top">
                            <ProductCareItem>
                                <ProductCareLogo
                                    src={item.logo}
                                    width={37}
                                    height={24}
                                    alt={item.name}
                                    priority
                                />
                            </ProductCareItem>
                        </Tooltip>
                    ))}
                </ProductCare>
            ) : null}
        </ProductDetailsStyled>
    );
};
