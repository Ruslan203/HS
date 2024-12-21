export interface OrderPaymentOptions {
    orderId: number;
}

export interface OrderPaymentInfo {
    id: string;
    url: string;
}

export interface OrderPaymentSuccessResult {
    result: "success";
    payment: OrderPaymentInfo;
}

export interface OrderPaymentErrorResult {
    result: "error";
    reason: string;
}

export type OrderPaymentResult = OrderPaymentSuccessResult | OrderPaymentErrorResult;

export interface CloseOrderReceiptOptions {
    orderId: number;
}

export interface CloseOrderReceiptSuccessResult {
    result: "success";
    payment: OrderPaymentInfo;
}

export interface CloseOrderReceiptErrorResult {
    result: "error";
    reason: string;
    tinkoffReceipt: unknown;
    tinkoffResult: unknown;
}

export type CloseOrderReceiptResult = CloseOrderReceiptSuccessResult | CloseOrderReceiptErrorResult;

export interface ExpectOrderPaymentOptions {
    orderId: number;
}

export interface ExpectOrderPaymentSuccessResult {
    result: "success";
    payment: OrderPaymentInfo;
}

export interface ExpectOrderPaymentErrorResult {
    result: "error";
    reason: string;
    tinkoffReceipt: unknown;
    tinkoffResult: unknown;
}

export type ExpectOrderPaymentResult =
    | ExpectOrderPaymentSuccessResult
    | ExpectOrderPaymentErrorResult;

export interface OrderRefundOptions {
    orderId: number;
    amount: string;
}

export interface OrderRefundErrorResult {
    result: "error";
    reason: string;
}

export interface OrderRefundSuccessResult {
    result: "success";
}

export type OrderRefundResult = OrderRefundSuccessResult | OrderRefundErrorResult;

export interface CancelOrderOptions {
    orderId: number;
}

export interface CancelOrderErrorResult {
    result: "error";
    reason: string;
}

export interface CancelOrderSuccessResult {
    result: "success";
}

export type CancelOrderResult = CancelOrderSuccessResult | CancelOrderErrorResult;
