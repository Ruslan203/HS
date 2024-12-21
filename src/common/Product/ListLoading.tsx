import React from "react";
import styled from "styled-components";
import {CircularProgress} from "@common/CircularProgress";

export const ProductListLoadingStyled = styled.div`
    display: flex;
    width: 100%;
    height: calc(100vh - ${({theme}) => theme.header.height} - 200px);
    justify-content: center;
    align-items: center;
    cursor: progress;
`;

export const ProductListLoading: React.FC = () => (
    <ProductListLoadingStyled>
        <CircularProgress />
    </ProductListLoadingStyled>
);
