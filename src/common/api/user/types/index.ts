import {OrderInfo} from "@common/api/basket/types";

export interface UserInfo {
    id: number;
    name: string;
    firstname: string;
    lastname: string;
    middlename: string;
    address: string;
    email: string;
    maillist: null;
    sale: string;
    subscribe_sms: string;
    sms_sent: string;
    totalorders: string;
    totalsum: string;
    totalzakaz: string;
    isAdmin: boolean;
}

export interface GetUserInfoResult {
    result: "success";
    info: UserInfo | false;
}

export interface GetUserOrdersResult {
    result: "success";
    orders: OrderInfo[];
}

export * from "./utils";
