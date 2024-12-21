import {useCallback, useMemo} from "react";
import {NextRouter} from "next/router";
import {
    CatalogList,
    CatalogListDefaultOption,
    CatalogListFoldersOption,
    GetCatalogListsResult,
    GetSaleItemsOptions,
    SaleFilterOption,
    SaleFiltersSelected,
    SaleSort,
    useApi
} from "@common/api";
import {CatalogApiUtils} from "@common/api/catalog/utils";
import {CatalogPath, getCatalogPath} from "./Path";

export type CatalogQueryItem = string | string[] | undefined;

export type CatalogQuery = Record<string, CatalogQueryItem>;

export type CatalogQuerySort = undefined | "cheaper" | "expensive" | "name" | "new";

export enum CatalogQueryNames {
    SORT = "sort"
}

export interface ToGetSaleItemsOptionsOptions {
    category: CatalogListFoldersOption | null;
    filtersSelected: SaleFiltersSelected;
}

export interface GetFiltersSelectedOptions {
    catalogLists: GetCatalogListsResult;
}

export class CatalogQueryBuilder {
    public readonly path: CatalogPath;

    constructor(public readonly query: CatalogQuery) {
        this.path = getCatalogPath(query);
    }

    public getSort(): SaleSort | null {
        const sortQuery: CatalogQueryItem = this.query[CatalogQueryNames.SORT];

        switch (sortQuery) {
            case "cheaper":
                return SaleSort.CHEAPER;
            case "expensive":
                return SaleSort.EXPENSIVE;
            case "name":
                return SaleSort.NAME;
            case "new":
                return SaleSort.NEW;
            default:
                return null;
        }
    }

    public getSortQuery(sort: SaleSort | null): CatalogQuery {
        let sortQuery: CatalogQuerySort;
        switch (sort) {
            case SaleSort.CHEAPER:
                sortQuery = "cheaper";
                break;
            case SaleSort.EXPENSIVE:
                sortQuery = "expensive";
                break;
            case SaleSort.NAME:
                sortQuery = "name";
                break;
            case SaleSort.NEW:
                sortQuery = "new";
                break;
            default:
                sortQuery = undefined;
                break;
        }

        return {
            [CatalogQueryNames.SORT]: sortQuery
        };
    }

    public getFiltersSelected({catalogLists}: GetFiltersSelectedOptions): SaleFiltersSelected {
        const filtersSelected: SaleFiltersSelected = {};

        for (const code of CatalogApiUtils.saleFilterCodes) {
            if (!(code in catalogLists) || !(code in this.query)) {
                continue;
            }

            const listsOptions: CatalogListDefaultOption[] = Object.values(
                catalogLists[code].options
            );
            const options = String(this.query[code])
                .split("~")
                .map((optionCode) => {
                    const option: CatalogListDefaultOption | null =
                        listsOptions.find(({code}) => code === optionCode) ?? null;

                    if (option !== null) {
                        return {
                            id: option.id,
                            code: option.code,
                            name: option.name.replace(/\\/g, "")
                        };
                    } else {
                        return null;
                    }
                })
                .filter((option) => !!option) as SaleFilterOption[];
            if (options.length === 0) {
                continue;
            }

            const optionMap: Record<string, SaleFilterOption> = {};
            for (const option of options) {
                optionMap[option.id] = option;
            }

            const list: CatalogList<CatalogListDefaultOption> = catalogLists[code];
            filtersSelected[code] = {
                id: list.id,
                code: list.code,
                name: list.name,
                options: optionMap
            };
        }

        return filtersSelected;
    }

    public getFiltersSelectedQuery(filtersSelected: SaleFiltersSelected): CatalogQuery {
        const filtersQuery: CatalogQuery = {};

        for (const filter of Object.values(filtersSelected)) {
            filtersQuery[filter.code] = Object.values(filter.options)
                .map(({code}) => code)
                .join("~");
        }

        return filtersQuery;
    }

    public resetFilters(): CatalogQuery {
        const query: CatalogQuery = {};

        for (const code of CatalogApiUtils.saleFilterCodes) {
            query[code] = undefined;
        }

        return query;
    }

    public getCategory(): number | null {
        return this.query.category ? +this.query.category : null;
    }

    public toGetSaleItemsOptions({
        category,
        filtersSelected
    }: ToGetSaleItemsOptionsOptions): GetSaleItemsOptions {
        const options: GetSaleItemsOptions = {};

        if (category === null) {
            options.goods = "all";
        } else {
            options.goods = category.id;
        }
        options.sort = this.getSort() ?? undefined;

        const filters: Record<string, string> = {};
        for (const filterSelected of Object.values(filtersSelected)) {
            filters[filterSelected.code] = Object.values(filterSelected.options)
                .map(({id}) => id)
                .join(",");
        }
        options.filters = filters;

        return options;
    }
}

export interface UseCatalogQueryBuilderOptions {
    router: NextRouter;
    catalogLists: GetCatalogListsResult;
}

export interface UseCatalogQueryBuilderResult {
    catalogQueryBuilder: CatalogQueryBuilder;
    sort: SaleSort | null;
    setSort: (sort: SaleSort | null) => void;
    filtersSelected: SaleFiltersSelected;
    setFiltersSelected: (filtersSelected: SaleFiltersSelected) => void;
    resetFilters: () => void;
}

export const useCatalogQueryBuilder = ({
    router,
    catalogLists
}: UseCatalogQueryBuilderOptions): UseCatalogQueryBuilderResult => {
    const api = useApi();

    const catalogQueryBuilder = useMemo(
        () => new CatalogQueryBuilder(router.query),
        [router.query]
    );

    const pushQuery = useCallback(
        (query: CatalogQuery) => {
            const params = new URLSearchParams();

            for (const [name, value] of Object.entries({...router.query, ...query})) {
                if (value) {
                    if (typeof value === "string") {
                        params.set(name, value);
                    } else {
                        for (const subvalue of value) {
                            params.append(name, subvalue);
                        }
                    }
                } else {
                    params.delete(name);
                }
            }

            router.push(
                {
                    query: params.toString()
                },
                undefined,
                {shallow: true}
            );
        },
        [router.query]
    );

    const sort = useMemo<SaleSort | null>(
        () => catalogQueryBuilder.getSort(),
        [catalogQueryBuilder]
    );
    const setSort = useCallback(
        (sort: SaleSort | null) => {
            pushQuery(catalogQueryBuilder.getSortQuery(sort));
        },
        [catalogQueryBuilder, pushQuery]
    );

    const filtersSelected = useMemo<SaleFiltersSelected>(
        () => catalogQueryBuilder.getFiltersSelected({catalogLists}),
        [catalogQueryBuilder, api, catalogLists]
    );
    const setFiltersSelected = useCallback(
        (filtersSelected: SaleFiltersSelected) => {
            pushQuery(catalogQueryBuilder.getFiltersSelectedQuery(filtersSelected));
        },
        [catalogQueryBuilder, pushQuery]
    );
    const resetFilters = useCallback(() => {
        pushQuery(catalogQueryBuilder.resetFilters());
    }, [catalogQueryBuilder, api, pushQuery]);

    return {catalogQueryBuilder, sort, setSort, filtersSelected, setFiltersSelected, resetFilters};
};
