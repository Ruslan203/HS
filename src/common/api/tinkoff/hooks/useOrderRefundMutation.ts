import {UseMutationResult, useMutation} from "@tanstack/react-query";
import {useApi} from "@common/api";
import {OrderRefundOptions, OrderRefundResult} from "../types";

export type UseOrderRefundMutation = UseMutationResult<
    OrderRefundResult,
    unknown,
    OrderRefundOptions
>;

export const useOrderRefundMutation = (): UseOrderRefundMutation => {
    const api = useApi();

    return useMutation(["tinkoff/order-refund"], (options) => api.tinkoff.orderRefund(options));
};
