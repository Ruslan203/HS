import {UseInfiniteQueryResult} from "@tanstack/react-query";
import React, {useContext} from "react";
import {
    CatalogListBrandOption,
    CatalogListDefaultOption,
    GetCatalogListsResult,
    GetSaleItemsResult
} from "@common/api";

export interface LineContextValue {
    line: CatalogListDefaultOption;
    brand: CatalogListBrandOption;
    brandName: string;
    serias: CatalogListDefaultOption[];
    stars: number | null;
    sold: number | null;
    saleItemsQuery: UseInfiniteQueryResult<GetSaleItemsResult>;
    catalogLists: GetCatalogListsResult;
}

export const LineContext = React.createContext<LineContextValue | null>(null);

export const LineProvider: React.FC<LineContextValue & React.PropsWithChildren> = ({
    children,
    ...context
}) => <LineContext.Provider value={context}>{children}</LineContext.Provider>;

export function useLine(): LineContextValue {
    const context = useContext(LineContext);

    if (!context) {
        throw new Error("useLine must be used within a LineProvider.");
    }

    return context;
}
