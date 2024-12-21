import {UseInfiniteQueryResult, useInfiniteQuery} from "@tanstack/react-query";
import {useApi} from "@common/api";
import {GetSaleItemsOptions, GetSaleItemsResult} from "../types";

export interface UseSaleItemsQueryOptions extends GetSaleItemsOptions {
    initialSaleItems?: GetSaleItemsResult | null;
    enabled?: boolean;
    disableFilters?: boolean;
}

export type SaleItemsQuery = UseInfiniteQueryResult<GetSaleItemsResult>;

export const useSaleItemsQuery = ({
    initialSaleItems,
    enabled,
    disableFilters = true,
    ...queryOptions
}: UseSaleItemsQueryOptions = {}): SaleItemsQuery => {
    const api = useApi();

    return useInfiniteQuery(
        ["saleItems", queryOptions, disableFilters],
        ({pageParam = 1}) => {
            const start = (pageParam - 1) * api.catalog.saleItemsPerPage;

            return api.catalog.getSaleItems({start, disableFilters, ...queryOptions});
        },
        {
            getNextPageParam: (lastPage) => {
                const page = Math.ceil(lastPage.start / api.catalog.saleItemsPerPage) + 1;
                const totalPages = Math.ceil(lastPage.total / api.catalog.saleItemsPerPage);

                if (page < totalPages) {
                    return page + 1;
                } else {
                    return false;
                }
            },
            placeholderData: initialSaleItems
                ? () => {
                      return {
                          pageParams: [undefined, 1],
                          pages: [initialSaleItems]
                      };
                  }
                : undefined,
            enabled,
            keepPreviousData: true
        }
    );
};
