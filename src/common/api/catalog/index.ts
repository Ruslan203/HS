import {
    GetBrandCategoriesOptions,
    GetBrandCategoriesResult,
    GetCatalogListsResult,
    GetSaleItemOptions,
    GetSaleItemResult,
    GetSaleItemsOptions,
    GetSaleItemsResult,
    SuiteTextileApi
} from "..";
import {CatalogApiUtils} from "./utils";

export class CatalogApi {
    constructor(private readonly api: SuiteTextileApi) {
        this.utils = new CatalogApiUtils(this.api);
    }

    public readonly utils: CatalogApiUtils;

    public readonly saleItemsPerPage = 5;

    public async getLists(): Promise<GetCatalogListsResult> {
        const {data} = await this.api.instance.get<GetCatalogListsResult>("catalog/lists");

        return data;
    }

    public async getSaleItems({
        goods = "all",
        start,
        sort,
        brand,
        seria,
        line,
        filters,
        disableFilters = true
    }: GetSaleItemsOptions = {}): Promise<GetSaleItemsResult> {
        const {data} = await this.api.instance.get<GetSaleItemsResult>("catalog/sale-items", {
            params: {
                goods,
                start,
                sort,
                brand,
                seria,
                line,
                perPage: this.saleItemsPerPage,
                disableFilters: disableFilters ? "1" : "0",
                ...filters
            }
        });

        return data;
    }

    public async getSaleItem({path}: GetSaleItemOptions): Promise<GetSaleItemResult> {
        const {data} = await this.api.instance.get<GetSaleItemResult>("catalog/sale-item", {
            params: {path}
        });

        return data;
    }

    public async getBrandCategories({
        id
    }: GetBrandCategoriesOptions): Promise<GetBrandCategoriesResult> {
        const {data: result} = await this.api.instance.get<GetBrandCategoriesResult>(
            "catalog/brand-categories",
            {params: {id}}
        );

        return result;
    }
}
