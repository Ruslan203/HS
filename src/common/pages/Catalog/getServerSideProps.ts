import urlJoin from "url-join";
import {
    CatalogListBrandOption,
    CatalogListDefaultOption,
    CatalogListFoldersOption,
    GetBrandCategoriesResult,
    GetSaleItemsOptions,
    GetSaleItemsResult,
    SaleFiltersSelected
} from "@common/api";
import {GetAppPageProps, getAppPageProps} from "@common/app";
import {siteUrl} from "@common/config";
import {CatalogPageProps} from "@common/pages/Catalog";
import {CatalogPath, getCatalogPath} from "./Path";
import {CatalogQueryBuilder} from "./QueryBuilder";

export type GetCatalogServerSideProps = GetAppPageProps<CatalogPageProps>;

export const getCatalogServerSideProps: GetCatalogServerSideProps =
    getAppPageProps<CatalogPageProps>(async ({api, query, catalogLists, isPushRequest}) => {
        const catalogPath: CatalogPath = getCatalogPath(query);
        const {name, subname} = catalogPath;

        if (typeof name === "string" && subname === "index.phtml") {
            catalogPath.subname = null;

            return {
                redirect: {
                    statusCode: 301,
                    destination: catalogPath.toString()
                }
            };
        }

        let category: CatalogListFoldersOption | null = null;
        let brand: CatalogListBrandOption | null = null;
        let brandCategories: GetBrandCategoriesResult | null = null;
        let seria: CatalogListDefaultOption | null = null;
        let line: CatalogListDefaultOption | null = null;

        const queryParams = new URLSearchParams(query as Record<string, string>);
        queryParams.delete("name");
        queryParams.delete("subname");
        const canonicalUrl: string = urlJoin(
            siteUrl,
            catalogPath.toString(),
            "/",
            "?" + queryParams.toString()
        );

        category = api.catalog.utils.getCategoryByUrl({
            url: catalogPath.toString(),
            catalogLists
        });
        if (query.category) {
            category ??= api.catalog.utils.getCategoryById({
                id: +query.category,
                catalogLists
            });
        }
        if (name !== null && (subname === null || subname === "preload")) {
            brand = api.catalog.utils.getBrandByCode({code: name, catalogLists});
            if (brand !== null) {
                const {id} = brand;

                brandCategories = await api.catalog.getBrandCategories({id});
            }
        } else if (name !== null && subname !== null) {
            brand = api.catalog.utils.getBrandByCode({code: name, catalogLists});
            seria = api.catalog.utils.getSeriaByUrl({url: catalogPath.toString(), catalogLists});
            if (seria === null) {
                line = api.catalog.utils.getLineByUrl({url: catalogPath.toString(), catalogLists});
            }
        }

        if (
            name !== null &&
            (brand === null || (subname !== null && seria === null && line === null)) &&
            category === null
        ) {
            return {
                notFound: true
            };
        }
        if (isPushRequest) {
            return {
                props: {
                    brandCategories,
                    canonicalUrl
                }
            };
        }

        const catalogQueryBuilder = new CatalogQueryBuilder(query);
        const filtersSelected: SaleFiltersSelected = catalogQueryBuilder.getFiltersSelected({
            catalogLists
        });
        const saleItemsQueryOptions: GetSaleItemsOptions =
            catalogQueryBuilder.toGetSaleItemsOptions({category, filtersSelected});
        const saleItems: GetSaleItemsResult = await api.catalog.getSaleItems({
            brand: brand?.id,
            seria: seria?.id,
            line: line?.id,
            disableFilters: false,
            ...saleItemsQueryOptions
        });

        return {
            props: {
                brandCategories,
                saleItems,
                canonicalUrl
            }
        };
    });
