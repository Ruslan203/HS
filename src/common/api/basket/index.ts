import {SuiteTextileApi} from "..";
import {
    AddBasketBulkOptions,
    AddBasketBulkResult,
    DeleteBasketItemOptions,
    DeleteBasketItemResult,
    GetBasketContentsResult,
    GetDeliveryPriceOptions,
    GetDeliveryPriceResult,
    GetOrderSuccessOptions,
    GetOrderSuccessResult,
    PlaceOrderOptions,
    PlaceOrderResult
} from "./types";

export class BasketApi {
    constructor(private readonly api: SuiteTextileApi) {}

    public async getContents(): Promise<GetBasketContentsResult> {
        const {data} = await this.api.instance.get<GetBasketContentsResult>(
            "basket/getBasketContents"
        );

        return data;
    }

    public async getCount(): Promise<number> {
        const {data: result} = await this.api.instance.get<{data: number}>("basket/getBasketCount");

        return result.data;
    }

    public async addBulk({
        colors,
        sizes,
        quantity
    }: AddBasketBulkOptions): Promise<AddBasketBulkResult> {
        const {data} = await this.api.instance.get<AddBasketBulkResult>("basket/addBulk", {
            params: {
                colors: colors.join(","),
                sizes: sizes.join(","),
                quantity
            }
        });

        return data;
    }

    public async deleteItem({id, color}: DeleteBasketItemOptions): Promise<DeleteBasketItemResult> {
        const {data} = await this.api.instance.post<DeleteBasketItemResult>(
            "basket/deleteItem",
            {
                id,
                color
            },
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );

        return data;
    }

    public async getDeliveryPrice({
        cityId,
        deliveryType
    }: GetDeliveryPriceOptions): Promise<GetDeliveryPriceResult> {
        const {data: result} = await this.api.instance.get<GetDeliveryPriceResult>(
            "basket/getDeliveryPrice",
            {
                params: {
                    city_id: cityId,
                    delivery_type: deliveryType
                }
            }
        );

        return result;
    }

    public async placeOrder({
        cityId,
        deliveryType,
        sdekPoint,
        address,
        postCode,
        lastName,
        firstName,
        middleName,
        phone,
        email,
        payment,
        text
    }: PlaceOrderOptions): Promise<PlaceOrderResult> {
        const {data: result} = await this.api.instance.get<PlaceOrderResult>("basket/placeOrder", {
            params: {
                city_id: cityId,
                delivery_type: deliveryType,
                sdek_point: sdekPoint,
                address,
                post_code: postCode,
                lastname: lastName,
                firstname: firstName,
                middlename: middleName,
                phone,
                email,
                payment,
                text
            }
        });

        return result;
    }

    public async getOrderSuccess({id}: GetOrderSuccessOptions): Promise<GetOrderSuccessResult> {
        const {data: result} = await this.api.instance.get<GetOrderSuccessResult>(
            "basket/getOrderSuccess",
            {params: {id}}
        );

        return result;
    }
}
