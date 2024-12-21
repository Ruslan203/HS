import React, {useContext} from "react";
import styled from "styled-components";
import {css} from "styled-components";
import {motion} from "framer-motion";
import {ProductItemStyled} from "./ItemView";

export const ProductListStyled = styled(motion.div)<{$loading?: boolean}>`
    display: flex;
    flex-direction: column;
    width: 100%;
    ${({$loading}) =>
        $loading &&
        css`
            cursor: progress;
        `}
    > ${ProductItemStyled} {
        &:not(:last-child) {
            border-bottom: 1px solid ${({theme}) => theme.palette.dividers};
        }
    }
`;

export interface ProductListProps extends React.ComponentProps<typeof ProductListStyled> {
    loading?: boolean;
}

export const ProductList: React.FC<ProductListProps> = ({loading = false, ...props}) => (
    <ProductListContext.Provider value={{loading}}>
        <ProductListStyled {...props} animate={{opacity: loading ? 0.4 : 1}} $loading={loading} />
    </ProductListContext.Provider>
);

export interface IProductListContext {
    loading: boolean;
}

export const ProductListContext = React.createContext<IProductListContext | null>(null);

export function useProductList(): IProductListContext {
    const context = useContext(ProductListContext);

    if (!context) {
        throw new Error("useProductList must be used within a ProductList.");
    }

    return context;
}
