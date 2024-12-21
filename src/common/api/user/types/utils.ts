import {OrderInfo} from "@common/api/basket/types";
import {GetCatalogListsResult} from "@common/api/catalog/types";
import {UserInfo} from ".";

export interface GetFioOptions {
    lastname: string;
    firstname: string;
    middlename: string;
}

export interface GetUserFullNameOptions {
    info: UserInfo;
}

export interface GetPhoneOptions {
    info: UserInfo;
}

export interface GetOrderStatusOptions {
    order: OrderInfo;
    catalogLists: GetCatalogListsResult;
}
