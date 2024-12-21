import {UseMutationResult, useMutation} from "@tanstack/react-query";
import {
    AddBasketBulkOptions,
    AddBasketBulkResult,
    BasketContentsQuery,
    BasketCountQuery,
    useApi
} from "@common/api";

export interface UseAddBasketBulkMutationOptions {
    basketCountQuery: BasketCountQuery;
    basketContentsQuery: BasketContentsQuery;
}

export type AddBasketBulkMutation = UseMutationResult<
    AddBasketBulkResult,
    unknown,
    AddBasketBulkOptions
>;

export const useAddBasketBulkMutation = ({
    basketCountQuery,
    basketContentsQuery
}: UseAddBasketBulkMutationOptions): AddBasketBulkMutation => {
    const api = useApi();

    return useMutation<AddBasketBulkResult, unknown, AddBasketBulkOptions>(
        ["addBasketBulk"],
        (options) => api.basket.addBulk(options),
        {
            onSuccess: async () => {
                await basketCountQuery.refetch();
                await basketContentsQuery.refetch();
            }
        }
    );
};
