import {UseMutationResult, useMutation} from "@tanstack/react-query";
import {useApi} from "@common/api";
import {CloseOrderReceiptOptions, CloseOrderReceiptResult} from "../types";

export type UseCloseOrderReceiptMutation = UseMutationResult<
    CloseOrderReceiptResult,
    unknown,
    CloseOrderReceiptOptions
>;

export const useCloseOrderReceiptMutation = (): UseCloseOrderReceiptMutation => {
    const api = useApi();

    return useMutation(["tinkoff/close-order-receipt"], (options) =>
        api.tinkoff.closeOrderReceipt(options)
    );
};
