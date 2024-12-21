import {SuiteTextileApi} from "..";
import {
    CancelOrderOptions,
    CancelOrderResult,
    CloseOrderReceiptOptions,
    CloseOrderReceiptResult,
    ExpectOrderPaymentOptions,
    ExpectOrderPaymentResult,
    OrderPaymentOptions,
    OrderPaymentResult,
    OrderRefundOptions,
    OrderRefundResult
} from "./types";

export class TinkoffApi {
    constructor(private readonly api: SuiteTextileApi) {}

    public async orderPayment({orderId}: OrderPaymentOptions): Promise<OrderPaymentResult> {
        const {data: result} = await this.api.instance.get<OrderPaymentResult>(
            "tinkoff/order-payment",
            {params: {id: orderId}}
        );

        return result;
    }

    public async closeOrderReceipt({
        orderId
    }: CloseOrderReceiptOptions): Promise<CloseOrderReceiptResult> {
        const {data: result} = await this.api.instance.get<CloseOrderReceiptResult>(
            "tinkoff/close-order-receipt",
            {params: {id: orderId}}
        );

        return result;
    }

    public async expectOrderPayment({
        orderId
    }: ExpectOrderPaymentOptions): Promise<ExpectOrderPaymentResult> {
        const {data: result} = await this.api.instance.get<ExpectOrderPaymentResult>(
            "tinkoff/expect-order-payment",
            {params: {id: orderId}}
        );

        return result;
    }

    public async orderRefund({orderId, amount}: OrderRefundOptions): Promise<OrderRefundResult> {
        const {data: result} = await this.api.instance.get<OrderRefundResult>(
            "tinkoff/order-refund",
            {
                params: {id: orderId, amount}
            }
        );

        return result;
    }

    public async cancelOrder({orderId}: CancelOrderOptions): Promise<CancelOrderResult> {
        const {data: result} = await this.api.instance.get<CancelOrderResult>(
            "tinkoff/cancel-order",
            {
                params: {id: orderId}
            }
        );

        return result;
    }
}
