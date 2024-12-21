import {UseQueryResult, useQuery} from "@tanstack/react-query";
import {useApi} from "@common/api";

export type BasketCountQuery = UseQueryResult<number>;

export const useBasketCountQuery = (): BasketCountQuery => {
    const api = useApi();

    return useQuery(["basket/getBasketCount"], () => api.basket.getCount(), {
        cacheTime: 0
    });
};
