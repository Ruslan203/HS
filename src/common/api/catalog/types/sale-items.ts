export interface SaleOption {
    id: number;
    seria: string;
    color: string[] | null;
    size: string[] | null;
    fas: string;
    name: string;
    price: string;
    newprice: string;
    picture: string;
    photo370: string;
    photo56: string;
    komp: string;
    degree: string;
    sheettype: string;
    ts: string;
    weight: string;
    types: string;
    komplekt: string;
    quantity: string;
    sex: string;
    tog: string;
    kit: string;
}

export interface SaleImage {
    id: number;
    color: string[];
    name: string;
    picture: string;
    pic: string;
    photo370: string;
    photo56: string;
    fas: string[];
}

export interface SaleListItem {
    id: number;
    name: string;
    url: string;
    parent_id: number;
    stars: string;
    sold: string;
    images: SaleImage[];
    options: SaleOption[] | boolean;
    brand_id: string;
    shades_id: string;
    picture: string;
    text: string;
    brand: string;
    seria: string;
    types: string;
    material: string;
    shades: string;
    color: string;
    country: string;
    plotnost: string;
    size: string;
    fas: string;
    compliance: string;
    pagetitle: string;
    structure: string;
    napolnitel: string;
    chehol: string;
    tkan: string;
    cushionheight: string;
    line: string;
    fillpower: string;
    filler: string;
    nm: string;
}

export type SaleItemsFilters = Record<string, Record<string, number>>;

export interface GetSaleItemsResult {
    result: string;
    items: SaleListItem[];
    filters: SaleItemsFilters;
    start: number;
    perPage: number;
    total: number;
}

export enum SaleSort {
    CHEAPER = "#min_price",
    EXPENSIVE = "-#min_price",
    NAME = "_name",
    NEW = "-_create_time"
}

export type SaleGoods = "all" | number;

export interface GetSaleItemsOptions {
    goods?: SaleGoods;
    start?: number;
    brand?: number;
    seria?: number;
    line?: number;
    sort?: SaleSort;
    filters?: Record<string, string>;
    disableFilters?: boolean;
}

export type SaleItem = SaleListItem;

export interface GetSaleItemOptions {
    path: string;
}

export interface GetSaleItemResult {
    result: string;
    item: SaleItem | false;
}
