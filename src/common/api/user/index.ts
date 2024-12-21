import {GetUserInfoResult, GetUserOrdersResult, SuiteTextileApi} from "..";
import {UserApiUtils} from "./utils";

export class UserApi {
    constructor(private readonly api: SuiteTextileApi) {}

    public readonly utils = new UserApiUtils();

    public async getInfo(): Promise<GetUserInfoResult> {
        const {data: result} = await this.api.instance.get<GetUserInfoResult>("user/info");

        return result;
    }

    public async getOrders(): Promise<GetUserOrdersResult> {
        const {data: result} = await this.api.instance.get<GetUserOrdersResult>("user/orders");

        return result;
    }
}
