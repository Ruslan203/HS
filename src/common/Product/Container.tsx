import React from "react";
import {InViewHookResponse} from "react-intersection-observer";
import styled from "styled-components";

export const ProductContainerStyled = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    max-width: 880px;
`;

export const ProductContainerEnd = styled.div``;

export interface ProductContainerProps extends React.PropsWithChildren {
    endRef?: InViewHookResponse["ref"] | null;
}

export const ProductContainer: React.FC<ProductContainerProps> = ({endRef = null, children}) => (
    <ProductContainerStyled>
        {children}
        {endRef ? <ProductContainerEnd ref={endRef} /> : null}
    </ProductContainerStyled>
);
