import {OrderPaymentInfo} from "../tinkoff/types";

export interface BasketItem {
    id: number;
    color: string;
    color_name: string;
    fas: unknown;
    full_name: string;
    good: unknown;
    good_id: number;
    height: number;
    image: string;
    bigimage: string;
    item_id: number;
    length: number;
    name: string;
    no_sale: boolean;
    parent_name: string;
    path: string;
    price: string;
    price_old: string;
    quantity: number;
    size: string;
    sum: number;
    type: string;
    url: string;
    weight: number;
    width: number;
    availability: string;
}

export interface BasketContentsItems {
    items: BasketItem[];
    sum: number;
    full_sum: number;
    discount: number;
    discount_procent: number;
    count: number;
}

export interface GetBasketContentsResult {
    result: string;
    items: BasketContentsItems;
    discountData: false;
}

export interface AddBasketBulkOptions {
    colors: number[];
    sizes: number[];
    quantity?: number;
}

export interface AddBasketBulkFailureResult {
    result: "failure";
    reason: string;
}

export type AddBasketBulkResult = AddBasketBulkFailureResult;

export interface DeleteBasketItemOptions {
    id: number;
    color: number;
}

export interface DeleteBasketItemResult {
    result: string;
}

export interface GetDeliveryPriceOptions {
    cityId: number;
    deliveryType: string;
}

export interface GetDeliveryPriceResult {
    code: number;
    price: number;
    result: string;
}

export interface PlaceOrderOptions {
    cityId: number;
    deliveryType: number;
    sdekPoint?: string;
    address?: string;
    postCode?: string;
    lastName: string;
    firstName: string;
    middleName: string;
    phone: string;
    email: string;
    payment: number;
    text: string;
}

export interface PlaceOrderSuccessResult {
    result: "success";
    id: string;
    payment?: OrderPaymentInfo;
    gtag_data: unknown;
    yametrik_data: unknown;
}

export interface PlaceOrderFailureResult {
    result: "failure";
    reason: string;
}

export type PlaceOrderResult = PlaceOrderSuccessResult | PlaceOrderFailureResult;

export interface GetOrderSuccessOptions {
    id: number;
}

export interface OrderItem {
    id: number;
    item_id: number;
    fas: unknown;
    name: string;
    good: unknown;
    parent_name: string;
    full_name: string;
    availability: string;
    path: string;
    image: string;
    bigimage: string;
    price: string;
    price_old: string;
    url: string;
    quantity: number;
    size: string;
    color: string;
    color_name: string;
    good_id: number;
    type: string;
    no_sale: boolean;
    weight: number;
    length: number;
    height: number;
    width: number;
    parent_id: number;
    link1: number;
    imagename: string;
    sum: number;
}

export interface OrderItems {
    items: OrderItem[];
    sum: number;
    full_sum: number;
    discount: number;
    discount_procent: number;
    count: number;
}

export interface OrderUser {
    name: string;
    email: string;
    phone: string;
    lastname: string;
    firstname: string;
    middlename: string;
}

export interface OrderDelivery {
    type: string;
    address: string;
}

export type OrderPaymentStatus = null | "new" | "pre_paid" | "paid";

export interface OrderInfo {
    id: number;
    created: number;
    status_id: string;
    status: string;
    items: OrderItems;
    user: OrderUser;
    sum: string;
    isPaid: boolean;
    payment: string;
    paymentUrl: string;
    text: string;
    delivery: OrderDelivery;
    paymentStatus: OrderPaymentStatus;
}

export interface GetOrderSuccessResult {
    result: "success";
    order: OrderInfo | false;
}
