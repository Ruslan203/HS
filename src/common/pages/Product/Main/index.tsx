import React from "react";
import styled from "styled-components";
import {ProductDetails} from "./Details";
import {ProductDetailsRight} from "./DetailsRight";
import {ProductPhoto} from "./Photo";

export const MainStyled = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 30px;
    width: 100%;
    margin-top: 30px;
    @media (max-width: 1100px) {
        flex-direction: column;
        justify-content: flex-start;
    }
`;

export const Main: React.FC = () => {
    return (
        <MainStyled>
            <ProductPhoto />
            <ProductDetails />
            <ProductDetailsRight />
        </MainStyled>
    );
};
