import {SuiteTextileApi} from "..";
import {AddNotifyOptions, AddNotifyResult} from "./types";

export class NotifyMeApi {
    constructor(private readonly api: SuiteTextileApi) {}

    public async addNotify({phone, email, id}: AddNotifyOptions): Promise<AddNotifyResult> {
        const {data: result} = await this.api.instance.get<AddNotifyResult>(
            "notifyme/createnotif",
            {
                params: {phone, email, id}
            }
        );

        return result;
    }
}
