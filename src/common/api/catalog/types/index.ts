export * from "./lists";
export * from "./sale-items";
export * from "./utils";

export interface GetBrandCategoriesOptions {
    id: number;
}

export interface BrandCategory {
    id: number;
    name: string;
    url: string;
    count: number;
    path: string;
}

export interface GetBrandCategoriesResult {
    result: string;
    categories: BrandCategory[];
}
