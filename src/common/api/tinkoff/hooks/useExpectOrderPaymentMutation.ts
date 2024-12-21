import {UseMutationResult, useMutation} from "@tanstack/react-query";
import {useApi} from "@common/api";
import {ExpectOrderPaymentOptions, ExpectOrderPaymentResult} from "../types";

export type UseExpectOrderPaymentMutation = UseMutationResult<
    ExpectOrderPaymentResult,
    unknown,
    ExpectOrderPaymentOptions
>;

export const useExpectOrderPaymentMutation = (): UseExpectOrderPaymentMutation => {
    const api = useApi();

    return useMutation(["tinkoff/expect-order-payment"], (options) =>
        api.tinkoff.expectOrderPayment(options)
    );
};
