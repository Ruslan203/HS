import React from "react";
import {Product} from "@common/Product";
import {useCatalog} from "../../Context";

export const Body: React.FC = () => {
    const {
        saleItemsQuery,
        catalogLists,
        saleFilters,
        filtersSelected,
        isFirstLoading,
        isFirstSuccess
    } = useCatalog();

    if (isFirstLoading) {
        return <Product.ListLoading />;
    }

    return (
        <Product.QueryView
            saleItemsQuery={saleItemsQuery}
            catalogLists={catalogLists}
            filtersSelected={filtersSelected}
            defaultIsFirstSuccess={isFirstSuccess}
            saleFilters={saleFilters}
        />
    );
};
