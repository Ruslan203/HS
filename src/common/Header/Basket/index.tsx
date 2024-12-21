import React from "react";
import Link from "next/link";
import styled from "styled-components";
import {useBasket} from "@common/Basket";
import {BasketIcon} from "./Icon";

export const BasketStyled = styled(Link)`
    display: inline-flex;
    position: relative;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    background: #e9e9e7;
    color: ${({theme}) => theme.palette.black};
`;

export const BasketCount = styled.span`
    display: inline-flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: -2px;
    right: -6px;
    min-width: 18px;
    padding: 5px;
    height: 18px;
    border-radius: 10px;
    font: bold 11px ${({theme}) => theme.fonts.roboto};
    color: ${({theme}) => theme.palette.white};
    background: ${({theme}) => theme.palette.red};
`;

export const Basket: React.FC = () => {
    const {basketCountQuery} = useBasket();

    return (
        <BasketStyled href="/basket">
            <BasketIcon />
            {basketCountQuery.isSuccess && basketCountQuery.data ? (
                <BasketCount>{basketCountQuery.data}</BasketCount>
            ) : null}
        </BasketStyled>
    );
};
