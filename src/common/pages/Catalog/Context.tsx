import {UseInfiniteQueryResult} from "@tanstack/react-query";
import React, {useContext} from "react";
import {
    CatalogListFoldersOption,
    GetCatalogListsResult,
    GetSaleItemsResult,
    SaleFilter,
    SaleFiltersSelected,
    SaleSort
} from "@common/api";

export interface ICatalogContext {
    catalogName: string;
    catalogLists: GetCatalogListsResult;
    saleItemsQuery: UseInfiniteQueryResult<GetSaleItemsResult>;
    category: CatalogListFoldersOption | null;
    saleFilters: SaleFilter[];
    sort: SaleSort | null;
    filtersSelected: SaleFiltersSelected;
    setFiltersSelected: (filtersSelected: SaleFiltersSelected) => void;
    resetFilters: () => void;
    setSort: (sort: SaleSort | null) => void;
    filtersMenuOpened: boolean;
    openFiltersMenu: () => void;
    closeFiltersMenu: () => void;
    catalogCategories: CatalogListFoldersOption[];
    parentCategory: CatalogListFoldersOption | null;
    isFirstSuccess: boolean;
    isFirstLoading: boolean;
    isLoading: boolean;
}

export const CatalogContext = React.createContext<ICatalogContext | null>(null);

export const CatalogProvider: React.FC<ICatalogContext & React.PropsWithChildren> = ({
    children,
    ...context
}) => <CatalogContext.Provider value={context}>{children}</CatalogContext.Provider>;

export function useCatalog(): ICatalogContext {
    const context = useContext(CatalogContext);

    if (!context) {
        throw new Error("useCatalog must be used within a CatalogProvider.");
    }

    return context;
}

export const useCatalogOrNull = () => useContext(CatalogContext);
