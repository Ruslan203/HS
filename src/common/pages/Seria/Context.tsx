import {UseInfiniteQueryResult} from "@tanstack/react-query";
import React, {useContext} from "react";
import {
    CatalogListBrandOption,
    CatalogListDefaultOption,
    GetCatalogListsResult,
    GetSaleItemsResult
} from "@common/api";

export interface ISeriaContext {
    seria: CatalogListDefaultOption;
    brand: CatalogListBrandOption;
    brandName: string;
    stars: number | null;
    sold: number | null;
    saleItemsQuery: UseInfiniteQueryResult<GetSaleItemsResult>;
    catalogLists: GetCatalogListsResult;
}

export const SeriaContext = React.createContext<ISeriaContext | null>(null);

export const SeriaProvider: React.FC<ISeriaContext & React.PropsWithChildren> = ({
    children,
    ...context
}) => <SeriaContext.Provider value={context}>{children}</SeriaContext.Provider>;

export function useSeria(): ISeriaContext {
    const context = useContext(SeriaContext);

    if (!context) {
        throw new Error("useSeria must be used within a SeriaProvider.");
    }

    return context;
}
