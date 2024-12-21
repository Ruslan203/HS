import {UseQueryResult, useQuery} from "@tanstack/react-query";
import {GetBasketContentsResult, useApi} from "@common/api";

export interface UseBasketContentsQueryOptions {
    enabled?: boolean;
}

export type BasketContentsQuery = UseQueryResult<GetBasketContentsResult>;

export const useBasketContentsQuery = ({
    enabled = true
}: UseBasketContentsQueryOptions = {}): BasketContentsQuery => {
    const api = useApi();

    return useQuery(["basket/getBasketContents"], () => api.basket.getContents(), {
        cacheTime: 0,
        enabled
    });
};
