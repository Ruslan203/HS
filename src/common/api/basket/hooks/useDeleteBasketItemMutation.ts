import {UseMutationResult, useMutation} from "@tanstack/react-query";
import {
    BasketContentsQuery,
    BasketCountQuery,
    DeleteBasketItemOptions,
    DeleteBasketItemResult,
    useApi
} from "@common/api";

export interface UseDeleteBasketItemMutationOptions {
    basketCountQuery: BasketCountQuery;
    basketContentsQuery: BasketContentsQuery;
}

export type DeleteBasketItemMutation = UseMutationResult<
    DeleteBasketItemResult,
    unknown,
    DeleteBasketItemOptions
>;

export const useDeleteBasketItemMutation = ({
    basketCountQuery,
    basketContentsQuery
}: UseDeleteBasketItemMutationOptions): DeleteBasketItemMutation => {
    const api = useApi();

    return useMutation<DeleteBasketItemResult, unknown, DeleteBasketItemOptions>(
        ["deleteBasketItem"],
        (options) => api.basket.deleteItem(options),
        {
            onSuccess: async () => {
                await basketCountQuery.refetch();
                await basketContentsQuery.refetch();
            }
        }
    );
};
