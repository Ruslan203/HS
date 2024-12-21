import {UseMutationResult, useMutation} from "@tanstack/react-query";
import {useApi} from "@common/api";
import {CancelOrderOptions, CancelOrderResult} from "../types";

export type UseCancelOrderMutation = UseMutationResult<
    CancelOrderResult,
    unknown,
    CancelOrderOptions
>;

export const useCancelOrderMutation = (): UseCancelOrderMutation => {
    const api = useApi();

    return useMutation(["tinkoff/cancel-order"], (options) => api.tinkoff.cancelOrder(options));
};
