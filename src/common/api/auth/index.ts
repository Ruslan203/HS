import {
    LoginOptions,
    LoginResult,
    SendPasswordOptions,
    SendPasswordResult,
    SuiteTextileApi
} from "..";

export class AuthApi {
    constructor(private readonly api: SuiteTextileApi) {}

    public async login({name, password}: LoginOptions): Promise<LoginResult> {
        const {data: result} = await this.api.instance.get<LoginResult>("auth/login", {
            params: {name, password}
        });

        return result;
    }

    public async sendPassword({phone}: SendPasswordOptions): Promise<SendPasswordResult> {
        const {data: result} = await this.api.instance.get("auth/sendPassword", {params: {phone}});

        return result;
    }

    public async logoff(): Promise<void> {
        await this.api.instance.get("auth/logoff");
    }
}
