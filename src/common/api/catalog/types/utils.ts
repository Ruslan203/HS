import {
    CatalogAnyList,
    CatalogListBrandOption,
    CatalogListCategoriesOption,
    CatalogListColorOption,
    CatalogListDefaultOption,
    CatalogListFolders,
    CatalogListFoldersOption,
    GetCatalogListsResult
} from "./lists";
import {SaleImage, SaleItem, SaleItemsFilters, SaleListItem, SaleOption} from "./sale-items";

export interface GetAllOptionsOptions {
    catalogLists: GetCatalogListsResult;
}

export type SaleOptionCode = Exclude<keyof GetCatalogListsResult, "result" | "folders">;

export type SaleAllOptions = Record<SaleOptionCode, Exclude<CatalogAnyList, CatalogListFolders>>;

export interface GetFilterParamsOptions {
    allOptions: SaleAllOptions;
    item: SaleListItem;
}

export interface SaleFilterParamOption {
    id: number | string;
    code: string;
    name: string;
    color: [string, string | null] | null;
    fasOptions: SaleOption[];
    isKit: boolean;
}

export interface SaleFilterParam {
    id: number;
    code: string;
    name: string;
    options: SaleFilterParamOption[];
    parent: SaleFilterParam | null;
    parents: SaleFilterParam[];
}

export type SaleFilterParamsSelected = Record<string, SaleFilterParamOption | null>;

export type SaleFilterParamAvailable = Record<number | string, boolean>;

export type SaleFilterParamsAvailable = Record<string, SaleFilterParamAvailable>;

export interface GetFilterParamsSelectedOptions {
    filterParams: SaleFilterParam[];
    optionsIds: SaleOptionIds[];
    filtersSelected?: SaleFiltersSelected;
    saleOption?: SaleOption | null;
    prev?: GetFilterParamsSelectedResult | null;
    param?: SaleFilterParam | null;
    option?: SaleFilterParamOption | null;
    catalogLists?: GetCatalogListsResult | null;
}

export interface GetFilterParamsAvailableOptions {
    optionsIds: SaleOptionIds[];
    filterParams: SaleFilterParam[];
    filterParamsSelected: SaleFilterParamsSelected;
}

export interface GetFilterParentParamOptions {
    filterParams: SaleFilterParam[];
}

export interface GetOptionsIdsOptions {
    allOptions: SaleAllOptions;
    item: SaleListItem;
}

export type SaleOptionIds = Record<string, number[]>;

export interface GetFilterParamsSelectedByAvailableOptions {
    filterParams: SaleFilterParam[];
    filterParamsSelected: SaleFilterParamsSelected;
    filterParamsAvailable: SaleFilterParamsAvailable;
}

export interface GetFilterParamFirstOptionAvailableOptions {
    param: SaleFilterParam;
    filterParamsAvailable: SaleFilterParamsAvailable;
}

export interface GetFullNameOptions {
    optionSelected: SaleOption | null;
    catalogLists: GetCatalogListsResult;
    image: SaleImage | null;
}

export interface GetOptionSelectedOptions {
    item: SaleListItem;
    filterParamsSelected: SaleFilterParamsSelected;
}

export interface GetImagesByFilterParamsSelectedOptions {
    item: SaleListItem;
    filterParamsSelected: SaleFilterParamsSelected;
    optionSelected: SaleOption | null;
}

export type GetImageByFilterParamsSelectedOptions = GetImagesByFilterParamsSelectedOptions;

export interface GetSaleIdsOptions {
    item: SaleListItem;
    allOptions: SaleAllOptions;
}

export type SaleIds = Record<string, number[]>;

export interface GetSaleDescriptionOptions {
    item: SaleListItem;
    optionSelected: SaleOption | null;
    ids: SaleIds;
    allOptions: SaleAllOptions;
    brand: CatalogListBrandOption | null;
    catalogLists: GetCatalogListsResult;
    includeCodes?: string[];
}

export interface GetSaleBrandOptions {
    item: SaleListItem;
    catalogLists: GetCatalogListsResult;
}

export interface GetSaleDiscountOptions {
    optionSelected: SaleOption;
}

export interface SaleDiscount {
    percent: number;
    price: number;
}

export interface SaleSpecificationItem {
    id: number;
    code: string;
    name: string;
    pageUrl: string | null;
}

export interface SaleSpecification {
    id: number;
    name: string;
    code: string;
    items: SaleSpecificationItem[];
}

export interface GetSaleSpecificationsOptions {
    ids: SaleIds;
    allOptions: SaleAllOptions;
    category: CatalogListFoldersOption | null;
}

export interface GetSaleSeriaOptions {
    ids: SaleIds;
    catalogLists: GetCatalogListsResult;
}

export interface GetCategoryByUrlOptions {
    url: string;
    catalogLists: GetCatalogListsResult;
}

export interface SaleFilterOption {
    id: number;
    code: string;
    name: string;
    count: number;
    colors: CatalogListColorOption[] | null;
    disabled?: boolean;
}

export interface SaleFilter {
    id: number;
    code: string;
    name: string;
    options: SaleFilterOption[];
}

export type SaleFilterSelected = Omit<SaleFilter, "options"> & {
    options: Record<string, SaleFilterOption>;
};

export type SaleFiltersSelected = Record<string, SaleFilterSelected>;

export interface GetSaleFiltersOptions {
    catalogLists: GetCatalogListsResult;
    saleItemsFilters: SaleItemsFilters;
}

export interface GetBrandByCodeOptions {
    code: string;
    catalogLists: GetCatalogListsResult;
}

export interface GetSeriaByCodeOptions {
    code: string;
    catalogLists: GetCatalogListsResult;
}

export interface GetSeriaByUrlOptions {
    url: string;
    catalogLists: GetCatalogListsResult;
}

export interface GetLineByUrlOptions {
    url: string;
    catalogLists: GetCatalogListsResult;
}

export interface GetCategoriesOptions {
    catalogLists: GetCatalogListsResult;
}

export interface GetParentCategoryOptions {
    catalogLists: GetCatalogListsResult;
    category: CatalogListFoldersOption;
}

export interface GetComplianceOptions {
    catalogLists: GetCatalogListsResult;
    item: SaleListItem;
}

export interface ComplianceItem {
    id: number;
    code: string;
    name: string;
    logo: string | null;
    logoOpacity: number;
    logoHeight: number;
}

export interface GetSeriesByBrandOptions {
    catalogLists: GetCatalogListsResult;
    brand: CatalogListBrandOption;
}

export interface GetAllCategoriesOptions {
    catalogLists: GetCatalogListsResult;
}

export interface GetCategoryByIdOptions {
    catalogLists: GetCatalogListsResult;
    id: number;
}

export interface SaleDescriptionItem {
    name: string | null;
    value: string;
    url: string | null;
}

export interface SaleCareItem {
    name: string;
    logo: string;
}

export interface GetSaleCareOptions {
    ids: SaleIds;
    catalogLists: GetCatalogListsResult;
}

export interface GetSaleColorFullNameOptions {
    color: CatalogListColorOption;
    image: SaleImage | null;
}

export interface GetSalePageUrlOptions {
    item: SaleItem;
    optionSelected: SaleOption | null;
}

export interface GetFilterParamsSelectedResult {
    filterParamsSelected: SaleFilterParamsSelected;
    filterParamsAvailable: SaleFilterParamsAvailable;
}

export interface SaleSetItem {
    id: number;
    name: string;
    size: string;
}

export interface SaleSet {
    id: string;
    name: string;
    items: SaleSetItem[];
}

export interface GetSaleCompletenessOptions {
    item: SaleItem;
    catalogLists: GetCatalogListsResult;
}

export interface GetSaleMetadata {
    item: SaleItem;
    optionSelected: SaleOption | null;
    catalogLists: GetCatalogListsResult;
    image: SaleImage | null;
    ids: SaleIds;
    allOptions: SaleAllOptions;
    brand?: CatalogListBrandOption | null;
}

export interface SaleMetadata {
    title: string;
    description: string;
}

export interface GetCatalogNameOptions {
    category: CatalogListCategoriesOption | null;
    filtersSelected: SaleFiltersSelected;
}

export interface GetBrandLinesOptions {
    brand?: CatalogListBrandOption | null;
    catalogLists: GetCatalogListsResult;
}

export interface BrandLine {
    id: number;
    code: string;
    name: string;
    series: CatalogListDefaultOption[];
}

export interface GetLineSeriesOptions {
    line: CatalogListDefaultOption;
    catalogLists: GetCatalogListsResult;
}
