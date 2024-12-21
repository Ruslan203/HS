export interface GetSdekCitiesOptions {
    str: string;
    country?: string;
}

export interface SdekCityItem {
    id: number;
    name: string;
}

export interface GetSdekCitiesResult {
    items: SdekCityItem[];
}

export interface GetSdekPointsOptions {
    cityId: number;
}

export interface SdekPointPhone {
    number: string;
}

export interface SdekPoint {
    address: string;
    address_full: string;
    code: string;
    name: string;
    phones: SdekPointPhone[];
    postal_code: string;
    worktime: string;
}

export interface GetSdekPointsOptionsResult {
    points: SdekPoint[];
}
