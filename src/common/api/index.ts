import axios, {AxiosInstance} from "axios";
import urlJoin from "url-join";
import {apiUrl, serverPort} from "@common/config";
import {AuthApi} from "./auth";
import {BasketApi} from "./basket";
import {CatalogApi} from "./catalog";
import {NotifyMeApi} from "./notify-me";
import {SdekApi} from "./sdek";
import {TinkoffApi} from "./tinkoff";
import {UserApi} from "./user";

export interface SuiteTextileApiOptions {
    headers?: Record<string, string | string[] | undefined>;
}

export class SuiteTextileApi {
    public readonly apiUrl: string = apiUrl;
    public readonly instance: AxiosInstance;
    public readonly instanceBaseUrl: string;

    constructor({headers}: SuiteTextileApiOptions = {}) {
        this.instanceBaseUrl = urlJoin(
            typeof window === "undefined" ? `http://127.0.0.1:${serverPort}/` : "/",
            "/api"
        );
        this.instance = axios.create({
            baseURL: this.instanceBaseUrl,
            headers
        });
    }

    public readonly catalog = new CatalogApi(this);
    public readonly basket = new BasketApi(this);
    public readonly notifyMe = new NotifyMeApi(this);
    public readonly sdek = new SdekApi(this);
    public readonly user = new UserApi(this);
    public readonly auth = new AuthApi(this);
    public readonly tinkoff = new TinkoffApi(this);

    public url(...parts: string[]): string {
        return urlJoin(this.apiUrl, ...parts);
    }
}

export const createApi = (options: SuiteTextileApiOptions = {}) => new SuiteTextileApi(options);

export * from "./Context";
export * from "./catalog/types";
export * from "./catalog/hooks";
export * from "./basket/types";
export * from "./basket/hooks";
export * from "./notify-me/types";
export * from "./sdek/types";
export * from "./user/types";
export * from "./auth/types";
export * from "./user/hooks";
export * from "./tinkoff/types";
export * from "./tinkoff/hooks";
