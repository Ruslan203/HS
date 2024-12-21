import React, {useEffect, useState} from "react";
import {useInView} from "react-intersection-observer";
import {NotifyMe} from "@common/NotifyMe";
import {
    GetCatalogListsResult,
    SaleFilter,
    SaleFiltersSelected,
    SaleItem,
    SaleItemsQuery
} from "@common/api";
import {Product} from ".";

export interface ProductQueryViewProps {
    saleItemsQuery: SaleItemsQuery;
    catalogLists: GetCatalogListsResult;
    excludeItems?: SaleItem[];
    filtersSelected?: SaleFiltersSelected;
    defaultIsFirstSuccess?: boolean;
    saleFilters?: SaleFilter[] | null;
}

export const ProductQueryView: React.FC<ProductQueryViewProps> = ({
    saleItemsQuery,
    excludeItems = [],
    filtersSelected,
    defaultIsFirstSuccess = false,
    saleFilters
}) => {
    const {ref: endRef, inView} = useInView();

    useEffect(() => {
        if (inView && saleItemsQuery.hasNextPage) {
            saleItemsQuery.fetchNextPage();
        }
    }, [inView]);

    const [isFirstSuccess, setIsFirstSuccess] = useState(defaultIsFirstSuccess);

    useEffect(() => {
        if (saleItemsQuery.isSuccess && !saleItemsQuery.isFetching) {
            setIsFirstSuccess(true);
        }
    }, [saleItemsQuery.isSuccess, saleItemsQuery.isFetching]);

    return (
        <NotifyMe>
            <Product.Container endRef={endRef}>
                <Product.List loading={isFirstSuccess && saleItemsQuery.isFetching}>
                    {saleItemsQuery.data
                        ? saleItemsQuery.data.pages.map((page) =>
                              page.items.map((saleItem) => {
                                  if (excludeItems.some((item) => item.id === saleItem.id)) {
                                      return null;
                                  }

                                  return (
                                      <Product.Item
                                          key={saleItem.id}
                                          saleItem={saleItem}
                                          filtersSelected={filtersSelected}
                                          saleFilters={saleFilters}
                                      />
                                  );
                              })
                          )
                        : null}
                </Product.List>
                {saleItemsQuery.hasNextPage ? (
                    <Product.ShowMoreButton onClick={saleItemsQuery.fetchNextPage.bind(null, {})} />
                ) : null}
            </Product.Container>
        </NotifyMe>
    );
};
