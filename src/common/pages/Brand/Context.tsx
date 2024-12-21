import {UseInfiniteQueryResult} from "@tanstack/react-query";
import React, {useContext} from "react";
import {
    BrandLine,
    CatalogListBrandOption,
    CatalogListDefaultOption,
    GetBrandCategoriesResult,
    GetCatalogListsResult,
    GetSaleItemsResult
} from "@common/api";

export interface IBrandContext {
    brand: CatalogListBrandOption;
    brandName: string;
    stars: number | null;
    sold: number | null;
    series: CatalogListDefaultOption[];
    lines: BrandLine[];
    brandCategories: GetBrandCategoriesResult;
    saleItemsQuery: UseInfiniteQueryResult<GetSaleItemsResult>;
    catalogLists: GetCatalogListsResult;
}

export const BrandContext = React.createContext<IBrandContext | null>(null);

export const BrandProvider: React.FC<IBrandContext & React.PropsWithChildren> = ({
    children,
    ...context
}) => <BrandContext.Provider value={context}>{children}</BrandContext.Provider>;

export function useBrand(): IBrandContext {
    const context = useContext(BrandContext);

    if (!context) {
        throw new Error("useBrand must be used within a BrandProvider.");
    }

    return context;
}
