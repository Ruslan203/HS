import {UseMutationResult, useMutation} from "@tanstack/react-query";
import {useApi} from "@common/api";
import {OrderPaymentOptions, OrderPaymentResult} from "../types";

export type UseOrderPaymentMutation = UseMutationResult<
    OrderPaymentResult,
    unknown,
    OrderPaymentOptions
>;

export const useOrderPaymentMutation = (): UseOrderPaymentMutation => {
    const api = useApi();

    return useMutation(["tinkoff/order-payment"], (options) => api.tinkoff.orderPayment(options));
};
