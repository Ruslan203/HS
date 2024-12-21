import {
    GetSdekCitiesOptions,
    GetSdekCitiesResult,
    GetSdekPointsOptions,
    GetSdekPointsOptionsResult,
    SuiteTextileApi
} from "..";

export class SdekApi {
    constructor(private readonly api: SuiteTextileApi) {}

    public async getCities({
        country = "ru",
        str
    }: GetSdekCitiesOptions): Promise<GetSdekCitiesResult> {
        const {data: result} = await this.api.instance.get<GetSdekCitiesResult>("sdek/cities", {
            params: {country, str}
        });

        return result;
    }

    public async getPoints({cityId}: GetSdekPointsOptions): Promise<GetSdekPointsOptionsResult> {
        const {data: result} = await this.api.instance.get<GetSdekPointsOptionsResult>(
            "sdek/points",
            {
                params: {city_id: cityId}
            }
        );

        return result;
    }
}
