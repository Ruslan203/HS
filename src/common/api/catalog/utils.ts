import {produce} from "immer";
import urlJoin from "url-join";
import {SuiteTextileApi} from "..";
import {
    BrandLine,
    CatalogAnyList,
    CatalogList,
    CatalogListBrandOption,
    CatalogListCategoriesOption,
    CatalogListColorOption,
    CatalogListDefaultOption,
    CatalogListFoldersOption,
    ComplianceItem,
    GetAllCategoriesOptions,
    GetAllOptionsOptions,
    GetBrandByCodeOptions,
    GetBrandLinesOptions,
    GetCatalogNameOptions,
    GetCategoriesOptions,
    GetCategoryByIdOptions,
    GetCategoryByUrlOptions,
    GetComplianceOptions,
    GetFilterParamFirstOptionAvailableOptions,
    GetFilterParamsAvailableOptions,
    GetFilterParamsOptions,
    GetFilterParamsSelectedByAvailableOptions,
    GetFilterParamsSelectedOptions,
    GetFilterParamsSelectedResult,
    GetFilterParentParamOptions,
    GetFullNameOptions,
    GetImageByFilterParamsSelectedOptions,
    GetImagesByFilterParamsSelectedOptions,
    GetLineByUrlOptions,
    GetLineSeriesOptions,
    GetOptionSelectedOptions,
    GetOptionsIdsOptions,
    GetParentCategoryOptions,
    GetSaleBrandOptions,
    GetSaleCareOptions,
    GetSaleColorFullNameOptions,
    GetSaleCompletenessOptions,
    GetSaleDescriptionOptions,
    GetSaleDiscountOptions,
    GetSaleFiltersOptions,
    GetSaleIdsOptions,
    GetSaleMetadata,
    GetSalePageUrlOptions,
    GetSaleSeriaOptions,
    GetSaleSpecificationsOptions,
    GetSeriaByCodeOptions,
    GetSeriaByUrlOptions,
    GetSeriesByBrandOptions,
    SaleAllOptions,
    SaleCareItem,
    SaleDescriptionItem,
    SaleDiscount,
    SaleFilter,
    SaleFilterOption,
    SaleFilterParam,
    SaleFilterParamAvailable,
    SaleFilterParamOption,
    SaleFilterParamsAvailable,
    SaleFilterParamsSelected,
    SaleFilterSelected,
    SaleIds,
    SaleImage,
    SaleMetadata,
    SaleOption,
    SaleOptionCode,
    SaleOptionIds,
    SaleSet,
    SaleSetItem,
    SaleSpecification,
    SaleSpecificationItem
} from "./types";

export class CatalogApiUtils {
    public static readonly saleFilterCodes: string[] = [
        "brand",
        "seria",
        "sheettype",
        "line",
        "degree",
        "sex",
        "types",
        "bathrobetype",
        "toweltype",
        "filler",
        "material",
        "ts",
        "shades",
        "color",
        "country",
        "vid",
        "plotnost",
        "height",
        "kind",
        "bracing",
        "textile",
        "composition",
        "size",
        "weight",
        "compliance"
    ];

    public static readonly priceFormatter = new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        maximumFractionDigits: 0
    });

    constructor(private readonly api: SuiteTextileApi) {}

    public getAllOptions({catalogLists}: GetAllOptionsOptions): SaleAllOptions {
        const codes: string[] = Object.keys(catalogLists).filter(
            (key) =>
                typeof catalogLists[key] === "object" &&
                typeof catalogLists[key]["code"] === "string"
        );
        const allOptions: SaleAllOptions = {};

        for (const code of codes) {
            allOptions[code] = catalogLists[code];
        }

        return allOptions;
    }

    public getFilterParams({allOptions, item}: GetFilterParamsOptions): SaleFilterParam[] {
        if (typeof item.options === "boolean") {
            return [];
        }

        const codes: SaleOptionCode[] = Object.keys(allOptions).filter((code) => code !== "fas");
        const fasOptionsPlain = item.options as unknown as
            | Record<string, string | string[]>[]
            | boolean;
        const filterParamMap: Record<string, SaleFilterParam> = {};

        if (!Array.isArray(fasOptionsPlain)) {
            return [];
        }
        for (const fasOptionPlain of fasOptionsPlain) {
            const option = fasOptionPlain as unknown as SaleOption;

            const isKit = option.kit === "on";
            if (isKit && "size" in fasOptionPlain && "size" in allOptions) {
                const globalOption: CatalogAnyList = allOptions["size"];
                if (!("size" in filterParamMap)) {
                    filterParamMap["size"] = {
                        id: globalOption.id,
                        name: globalOption.name,
                        code: globalOption.code,
                        options: [],
                        parent: null,
                        parents: []
                    };
                }
                const filterParam: SaleFilterParam = filterParamMap["size"];
                let kitOption: SaleFilterParamOption | null =
                    filterParam.options.find((option) => option.id === "kit") ?? null;
                if (kitOption === null) {
                    kitOption = {
                        id: "kit",
                        code: "size",
                        name: "Комплект",
                        color: null,
                        fasOptions: [],
                        isKit: true
                    };
                    filterParam.options.push(kitOption);
                }

                kitOption.fasOptions.push(option);
                continue;
            }

            for (const code of codes) {
                if (!(code in fasOptionPlain) || !(code in allOptions)) {
                    continue;
                }
                const list: CatalogAnyList = allOptions[code];
                if (!(code in filterParamMap)) {
                    filterParamMap[code] = {
                        id: list.id,
                        name: list.name,
                        code: list.code,
                        options: [],
                        parent: null,
                        parents: []
                    };
                }
                const filterParam: SaleFilterParam = filterParamMap[code];

                const optionIdOrIds: string | string[] = fasOptionPlain[code];
                const optionIds: number[] = (
                    Array.isArray(optionIdOrIds) ? optionIdOrIds : [optionIdOrIds]
                ).map(Number);

                if (optionIds.length > 1) {
                    continue;
                }
                for (const optionId of optionIds) {
                    if (!filterParam.options.find((option) => option?.id === optionId)) {
                        const option = (list.options[optionId] ?? null) as unknown as
                            | ({
                                  id: number;
                              } & Record<string, string>)
                            | null;
                        if (option === null) {
                            continue;
                        }

                        const filterOption: SaleFilterParamOption = {
                            id: option.id,
                            code: option.code,
                            name: option.name,
                            color:
                                list.code === "color"
                                    ? [
                                          "#" + option.hex,
                                          option.hex_alt ? "#" + option.hex_alt : null
                                      ]
                                    : null,
                            fasOptions: [],
                            isKit: false
                        };
                        filterParam.options.push(filterOption);
                    }
                }
            }
        }

        const filterParams: SaleFilterParam[] = Object.values(filterParamMap).filter((param) => {
            return param.options.length > 1;
        });
        for (let index = 0; index < filterParams.length; index++) {
            const parent: SaleFilterParam | null = filterParams[index - 1] ?? null;
            const param: SaleFilterParam = filterParams[index];

            param.parent = parent;
            param.parents = filterParams.slice(0, index);
        }
        const filterParamCodes: string[] = filterParams.map(({code}) => code);
        for (const filterParam of filterParams) {
            for (const filterOption of filterParam.options) {
                if (filterOption.isKit) {
                    filterOption.fasOptions = fasOptionsPlain.filter((fasOptionPlain) => {
                        const fasOption = fasOptionPlain as unknown as SaleOption;
                        const isKit = fasOption.kit === "on";

                        return isKit;
                    }) as unknown as SaleOption[];
                    continue;
                }

                filterOption.fasOptions = fasOptionsPlain.filter((fasOptionPlain) => {
                    const fasOption = fasOptionPlain as unknown as SaleOption;
                    const isKit = fasOption.kit === "on";
                    if (filterParam.code === "size" && isKit) {
                        return false;
                    }

                    return filterParamCodes.every((filterParamCode) => {
                        const optionIdOrIds: string | string[] = fasOptionPlain[filterParamCode];
                        const optionIds: number[] = (
                            Array.isArray(optionIdOrIds) ? optionIdOrIds : [optionIdOrIds]
                        ).map(Number);

                        if (filterParamCode === filterParam.code) {
                            return optionIds.some((optionId) => optionId === filterOption.id);
                        } else {
                            return filterParams.every((param) => {
                                if (param.code === filterParamCode) {
                                    return true;
                                }

                                return param.options.some((option) => {
                                    const optionIdOrIds: string | string[] =
                                        fasOptionPlain[param.code];
                                    const optionIds: number[] = (
                                        Array.isArray(optionIdOrIds)
                                            ? optionIdOrIds
                                            : [optionIdOrIds]
                                    ).map(Number);

                                    return optionIds.some((optionId) => optionId === option.id);
                                });
                            });
                        }
                    });
                }) as unknown as SaleOption[];
            }
        }

        return filterParams;
    }

    public getFilterParamsSelected({
        filterParams,
        filtersSelected = {},
        saleOption = null,
        optionsIds,
        prev = null,
        param = null,
        option = null,
        catalogLists = null
    }: GetFilterParamsSelectedOptions): GetFilterParamsSelectedResult {
        let filterParamsSelected: SaleFilterParamsSelected;

        if (prev !== null && param !== null && option !== null) {
            filterParamsSelected = produce(prev.filterParamsSelected, (filterParamsSelected) => {
                filterParamsSelected[param.code] = option;
                return filterParamsSelected;
            });
        } else {
            filterParamsSelected = {};

            for (const param of filterParams) {
                if (!param.options[0]) {
                    continue;
                }

                if (saleOption !== null) {
                    const filterOption: SaleFilterParamOption | null =
                        param.options.find(({fasOptions}) => {
                            return fasOptions.some(({id}) => {
                                return id === saleOption.id;
                            });
                        }) ?? null;

                    if (filterOption !== null) {
                        filterParamsSelected[param.code] = filterOption;
                        continue;
                    }
                } else if (param.code !== "color" && param.code in filtersSelected) {
                    const filterSelected: SaleFilterSelected = filtersSelected[param.code];
                    const filterOptions: SaleFilterOption[] = Object.values(filterSelected.options);

                    const filterParam: SaleFilterParamOption | null =
                        param.options.find((option) =>
                            filterOptions.some((filterOption) => filterOption.id === option.id)
                        ) ?? null;
                    if (filterParam !== null) {
                        filterParamsSelected[param.code] = filterParam;
                        continue;
                    }
                }

                filterParamsSelected[param.code] = param.options[0];
            }
            if (
                catalogLists !== null &&
                ("color" in filtersSelected || "shades" in filtersSelected)
            ) {
                const param: SaleFilterParam | null =
                    filterParams.find((param) => param.code === "color") ?? null;

                if (param !== null) {
                    const colorFilterSelected: SaleFilterSelected | null =
                        filtersSelected[param.code] ?? null;
                    const colorFilterOptions: SaleFilterOption[] =
                        colorFilterSelected !== null
                            ? Object.values(colorFilterSelected.options)
                            : [];
                    const shadesFilterSelected: SaleFilterSelected | null =
                        filtersSelected["shades"] ?? null;
                    const shadesFilterOptions: SaleFilterOption[] =
                        shadesFilterSelected !== null
                            ? Object.values(shadesFilterSelected.options)
                            : [];

                    const filterParam: SaleFilterParamOption | null =
                        param.options.find(
                            (option) =>
                                colorFilterOptions.some(
                                    (filterOption) => filterOption.id === option.id
                                ) ||
                                shadesFilterOptions.some((filterOption) => {
                                    const shadesOption: CatalogListDefaultOption | null =
                                        catalogLists.shades.options[filterOption.id] ?? null;
                                    if (shadesOption === null) {
                                        return false;
                                    }

                                    const colors: number[] = shadesOption.color
                                        .split(",")
                                        .map(Number);

                                    return colors.some((colorId) => colorId === option.id);
                                })
                        ) ?? null;
                    if (filterParam !== null) {
                        filterParamsSelected[param.code] = filterParam;
                    }
                }
            }
        }

        let filterParamsAvailable: SaleFilterParamsAvailable = this.getFilterParamsAvailable({
            optionsIds,
            filterParams,
            filterParamsSelected
        });
        filterParamsSelected = this.getFilterParamsSelectedByAvailable({
            filterParams,
            filterParamsSelected,
            filterParamsAvailable
        });
        for (let index = 0; index < filterParams.length - 2; index++) {
            filterParamsAvailable = this.getFilterParamsAvailable({
                optionsIds,
                filterParams,
                filterParamsSelected
            });
            filterParamsSelected = this.getFilterParamsSelectedByAvailable({
                filterParams,
                filterParamsSelected,
                filterParamsAvailable
            });
        }

        return {filterParamsSelected, filterParamsAvailable};
    }

    public getFilterParentParam({
        filterParams
    }: GetFilterParentParamOptions): SaleFilterParam | null {
        return filterParams[0] ?? null;
    }

    public getOptionsIds({allOptions, item}: GetOptionsIdsOptions): SaleOptionIds[] {
        const codes: SaleOptionCode[] = Object.keys(allOptions);
        const itemOptions = item.options as unknown as
            | Record<string, string | string[]>[]
            | boolean;
        const ids: SaleOptionIds[] = [];

        if (!Array.isArray(itemOptions)) {
            return [];
        }
        for (const itemOption of itemOptions) {
            const optionIds: SaleOptionIds = {};

            for (const code of codes) {
                if (!(code in itemOption) || !(code in allOptions)) {
                    continue;
                }

                const idOrIds: string | string[] = itemOption[code];
                const ids: number[] = (
                    Array.isArray(idOrIds) ? idOrIds : idOrIds?.split(",") ?? []
                ).map(Number);

                optionIds[code] = ids;
            }

            ids.push(optionIds);
        }

        return ids;
    }

    public getFilterParamsAvailable({
        optionsIds,
        filterParams,
        filterParamsSelected
    }: GetFilterParamsAvailableOptions): SaleFilterParamsAvailable {
        const available: SaleFilterParamsAvailable = {};

        for (const param of filterParams) {
            if (!(param.code in available)) {
                available[param.code] = {};
            }
            const availableOptions: SaleFilterParamAvailable = available[param.code];

            for (const option of param.options) {
                availableOptions[option.id] = false;
            }
        }
        for (const param of filterParams) {
            if (param.parent === null) {
                for (const option of param.options) {
                    available[param.code][option.id] = true;
                }
            } else {
                const parentsSelected: [SaleFilterParam, SaleFilterParamOption | null][] =
                    param.parents.map((parent) => [parent, filterParamsSelected[parent.code]]);

                for (const option of param.options) {
                    available[param.code][option.id] = !!optionsIds.find((ids) => {
                        let available = !!ids[param.code]?.find((id) => id === option.id);

                        for (const [parent, parentOption] of parentsSelected) {
                            if (parentOption === null) {
                                continue;
                            }
                            if (parentOption.id === "kit" && "size" in ids) {
                                available &&= parentOption.fasOptions.some(
                                    (fasOption) =>
                                        fasOption.size
                                            ?.map(Number)
                                            .every(
                                                (sizeId, index) => sizeId === ids["size"][index]
                                            ) ?? false
                                );
                                continue;
                            }

                            available &&= ids[parent.code].some((id) => id === parentOption.id);
                        }

                        return available;
                    });
                }
            }
        }

        return available;
    }

    public getFilterParamFirstOptionAvailable({
        param,
        filterParamsAvailable
    }: GetFilterParamFirstOptionAvailableOptions): SaleFilterParamOption | null {
        for (const option of param.options) {
            const available: boolean = filterParamsAvailable[param.code][option.id];

            if (available) {
                return option;
            }
        }

        return null;
    }

    public getFilterParamsSelectedByAvailable({
        filterParams,
        filterParamsSelected,
        filterParamsAvailable
    }: GetFilterParamsSelectedByAvailableOptions): SaleFilterParamsSelected {
        return produce(filterParamsSelected, (filterParamsSelected) => {
            for (const param of filterParams) {
                const option: SaleFilterParamOption | null = filterParamsSelected[param.code];
                const available: boolean = option
                    ? filterParamsAvailable[param.code][option.id]
                    : false;
                if (available) {
                    continue;
                }

                const optionAvailable: SaleFilterParamOption | null =
                    this.getFilterParamFirstOptionAvailable({
                        param,
                        filterParamsAvailable
                    });

                filterParamsSelected[param.code] = optionAvailable;
            }
        });
    }

    public getOptionSelected({
        item,
        filterParamsSelected
    }: GetOptionSelectedOptions): SaleOption | null {
        const itemOptions = item.options as unknown as
            | Record<string, string | string[]>[]
            | boolean;

        if (!Array.isArray(itemOptions)) {
            return null;
        }
        const optionSelected = (itemOptions.find((itemOption) => {
            let found = true;

            for (const code in filterParamsSelected) {
                const filterParamOption: SaleFilterParamOption | null = filterParamsSelected[code];
                if (!(code in itemOption) || filterParamOption === null) {
                    continue;
                }

                const idOrIds: string | string[] = itemOption[code];
                const ids: number[] = (Array.isArray(idOrIds) ? idOrIds : [idOrIds]).map(Number);

                if (filterParamOption.isKit) {
                    found &&= filterParamOption.fasOptions.some(
                        (fasOption) =>
                            fasOption.size
                                ?.map(Number)
                                .every((sizeId, index) => sizeId === ids[index]) ?? false
                    );
                    continue;
                }

                found &&= ids.some((id) => id === filterParamOption.id);
            }

            return found;
        }) ?? null) as SaleOption | null;

        return optionSelected;
    }

    public getSaleFullName({optionSelected, catalogLists, image}: GetFullNameOptions): string {
        const nameParts: string[] = [];

        if (optionSelected === null) {
            return "";
        }
        if (optionSelected.name) {
            const optionName: string = optionSelected.name;

            nameParts.push(optionName);
        }
        const allCodes: string[] = Object.keys(catalogLists);
        for (const code of Object.keys(optionSelected).sort((codeA, codeB) =>
            allCodes.indexOf(codeA) > allCodes.indexOf(codeB) ? 1 : -1
        )) {
            if (!(code in catalogLists)) {
                continue;
            }

            const list: CatalogList<CatalogListDefaultOption> = catalogLists[code];
            if (list.hide === "on") {
                continue;
            }

            const idOrIds = (optionSelected as unknown as Record<string, unknown | unknown[]>)[
                code
            ];
            const ids: number[] = Array.isArray(idOrIds) ? idOrIds.map(Number) : [Number(idOrIds)];
            const items: CatalogListDefaultOption[] = ids
                .map((id) => list.options[id])
                .filter((item) => !!item);
            if (items.length === 0) {
                continue;
            }

            switch (code) {
                case "color":
                    {
                        const colorItems = items as unknown as CatalogListColorOption[];
                        nameParts.push(
                            ...colorItems.map((item) =>
                                this.getSaleColorFullName({color: item, image})
                            )
                        );
                    }
                    break;
                default:
                    nameParts.push(...items.map((item) => item.name.replace(/\\/g, "")));
                    break;
            }
        }

        return nameParts.join(", ");
    }

    public getSaleColorFullName({color, image}: GetSaleColorFullNameOptions): string {
        const nameParts: string[] = [color.name];

        if (image !== null && image?.name) {
            nameParts.push(`(${image.name})`);
        }

        return nameParts.join(" ");
    }

    public getImagesByFilterParamsSelected({
        item,
        filterParamsSelected,
        optionSelected
    }: GetImagesByFilterParamsSelectedOptions): SaleImage[] {
        const itemImages = item.images as unknown as Record<string, string | number | string[]>[];
        const codes: string[] = ["fas", ...Object.keys(filterParamsSelected)];

        return (itemImages.filter((itemImage) => {
            let found = true;

            for (const code of codes) {
                if (!(code in itemImage)) {
                    continue;
                }
                if (code === "fas" && optionSelected) {
                    const idOrIds: string | number | string[] = itemImage["fas"];
                    const ids: number[] = (Array.isArray(idOrIds) ? idOrIds : [idOrIds]).map(
                        Number
                    );

                    found &&= ids.some((id) => id === optionSelected.id);
                } else {
                    const filterParamOption: SaleFilterParamOption | null =
                        filterParamsSelected[code];
                    if (!filterParamOption) {
                        continue;
                    }

                    const idOrIds: string | number | string[] = itemImage[code];
                    const ids: number[] = (Array.isArray(idOrIds) ? idOrIds : [idOrIds]).map(
                        Number
                    );

                    found &&= ids.some((id) => id === filterParamOption.id);
                }
            }

            return found;
        }) ?? null) as unknown as SaleImage[];
    }

    public getImageByFilterParamsSelected(
        options: GetImageByFilterParamsSelectedOptions
    ): SaleImage | null {
        return this.getImagesByFilterParamsSelected(options)[0] ?? null;
    }

    public getSaleIds({item, allOptions}: GetSaleIdsOptions): SaleIds {
        const ids: SaleIds = {};
        const itemPlain = item as unknown as Record<string, unknown>;

        for (const code in itemPlain) {
            const option: unknown = itemPlain[code];

            if (!(code in allOptions) || typeof option !== "string") {
                continue;
            }

            ids[code] = option.split(",").map(Number);
        }

        return ids;
    }

    public getSaleDescription({
        item,
        optionSelected,
        ids,
        allOptions,
        catalogLists,
        includeCodes = []
    }: GetSaleDescriptionOptions): SaleDescriptionItem[] {
        const descriptionIds: [string, number[]][] = Object.entries(ids).filter(([code]) => {
            return (
                code === "country" ||
                code === "weight" ||
                code === "plotnost" ||
                code === "composition" ||
                code === "seria" ||
                code === "line" ||
                code === "fillpower" ||
                code === "filler" ||
                code === "material" ||
                includeCodes.some((includeCode) => includeCode === code)
            );
        });

        const description: SaleDescriptionItem[] = [];

        if (item.pagetitle) {
            description.push({
                name: null,
                value: item.pagetitle,
                url: null
            });
        }
        if (item.structure) {
            description.push({
                name: "Состав",
                value: item.structure,
                url: null
            });
        }
        if (item.chehol) {
            description.push({
                name: "Чехол",
                value: item.chehol,
                url: null
            });
        }
        if (item.cushionheight) {
            description.push({
                name: "Высота подушек",
                value: item.cushionheight + " см",
                url: null
            });
        }
        for (const [code, descriptionItemIds] of descriptionIds) {
            let values: string[] = descriptionItemIds
                .map((id) => allOptions[code].options?.[id]?.name ?? null)
                .filter((name) => !!name);
            switch (code) {
                case "plotnost":
                    values = values.map((value) => value + " гр/м²");
                    break;
            }

            const value: string = values.join(", ");
            if (!value) {
                continue;
            }

            let name: string;
            switch (code) {
                case "country":
                    if (values.length === 1) {
                        name = "Страна";
                    } else {
                        name = "Страны";
                    }
                    break;
                default:
                    name = allOptions[code].name;
                    break;
            }

            let url: string | null;
            switch (code) {
                case "seria":
                case "line":
                    {
                        const option: CatalogListDefaultOption | null =
                            allOptions[code].options?.[descriptionItemIds[0]] ?? null;

                        url = option.url ?? null;
                    }
                    break;
                default:
                    url = null;
                    break;
            }

            description.push({name, value, url});
        }
        if (optionSelected !== null && optionSelected.ts) {
            const ts: CatalogListDefaultOption | null =
                catalogLists.ts.options[optionSelected.ts] ?? null;

            description.push({
                name: catalogLists.ts.name,
                value: ts.name,
                url: null
            });
        }

        if (optionSelected !== null && optionSelected.tog) {
            description.push({
                name: "TOG",
                value: optionSelected.tog,
                url: null
            });
        }
        if (optionSelected !== null && optionSelected.weight) {
            description.push({
                name: "Вес",
                value: optionSelected.weight + " гр.",
                url: null
            });
        }
        if (item.nm) {
            description.push({
                name: "Nm",
                value: item.nm,
                url: null
            });
        }

        return description;
    }

    public getSaleBrand({item, catalogLists}: GetSaleBrandOptions): CatalogListBrandOption | null {
        const brand: CatalogListBrandOption | null = catalogLists.brand.options[item.brand];

        if (brand !== null) {
            return {
                ...brand,
                name: brand.name.replace(/\\/g, "")
            };
        } else {
            return null;
        }
    }

    public getSaleDiscount({optionSelected}: GetSaleDiscountOptions): SaleDiscount | null {
        const price = Number(optionSelected.price);
        const discountPrice = Number(optionSelected.newprice);

        if (!Number.isNaN(discountPrice) && discountPrice !== 0) {
            const percent: number = Math.round(((discountPrice - price) * 100) / discountPrice);

            if (percent === 0) {
                return null;
            }

            return {
                price: discountPrice,
                percent
            };
        } else {
            return null;
        }
    }

    public getSaleSpecifications({
        ids,
        allOptions,
        category
    }: GetSaleSpecificationsOptions): SaleSpecification[] {
        const specs: SaleSpecification[] = [];

        for (const [code, itemIds] of Object.entries(ids)) {
            if (code === "compliance") {
                continue;
            }

            const option = allOptions[code];
            const items: SaleSpecificationItem[] = itemIds
                .map((id) => option.options[id])
                .filter((option) => !!option)
                .map(({id, code, name, url}) => {
                    let pageUrl: string | null;
                    if (url) {
                        pageUrl = url;
                    } else if (category) {
                        const params = new URLSearchParams();
                        params.set(option.code, code);

                        pageUrl = urlJoin(category.url, `?${params}`);
                    } else {
                        pageUrl = null;
                    }

                    return {
                        id,
                        code,
                        name: name.replace(/\\/g, ""),
                        pageUrl
                    };
                });
            if (items.length === 0) {
                continue;
            }

            specs.push({
                id: option.id,
                name: option.name,
                code: option.code,
                items
            });
        }

        return specs;
    }

    public getSaleSeria({ids, catalogLists}: GetSaleSeriaOptions): CatalogListDefaultOption | null {
        if (!("seria" in ids) || !("seria" in catalogLists)) {
            return null;
        }

        const seria: CatalogListDefaultOption | null =
            catalogLists.seria.options[ids["seria"][0]] ?? null;

        return seria;
    }

    public getCategoryByUrl({
        url,
        catalogLists
    }: GetCategoryByUrlOptions): CatalogListCategoriesOption | null {
        url = urlJoin(url, "/");

        return catalogLists.categories.options.find((category) => category.url === url) ?? null;
    }

    public getCategoryById({
        id,
        catalogLists
    }: GetCategoryByIdOptions): CatalogListCategoriesOption | null {
        return catalogLists.categories.options.find((category) => category.id === id) ?? null;
    }

    public getSaleFilters({catalogLists, saleItemsFilters}: GetSaleFiltersOptions): SaleFilter[] {
        const filters: SaleFilter[] = [];

        for (const code in saleItemsFilters) {
            const list: CatalogList<CatalogListDefaultOption> | null = catalogLists[code] ?? null;
            if (!list) {
                continue;
            }

            const id: number = list.id;
            const name: string = list.name;
            const saleItemsFilter: Record<string, number> = saleItemsFilters[code];
            const options: SaleFilterOption[] = [];
            for (const [optionId, count] of Object.entries(saleItemsFilter)) {
                const catalogListsOption: CatalogListDefaultOption = list.options[optionId] ?? null;
                if (!catalogListsOption) {
                    continue;
                }

                const {id, code} = catalogListsOption;
                const name: string = catalogListsOption.name.replace(/\\/g, "");
                let colors: CatalogListColorOption[] | null;
                if (catalogListsOption.color) {
                    colors = catalogListsOption.color
                        .split(",")
                        .map(Number)
                        .map((optionId) => catalogLists.color.options[optionId] ?? null)
                        .filter((color) => color !== null);
                } else {
                    colors = null;
                }

                const option: SaleFilterOption = {
                    id,
                    code,
                    name,
                    count,
                    colors
                };
                options.push(option);
            }
            if (options.length === 0) {
                continue;
            }

            const filter: SaleFilter = {
                id,
                code,
                name,
                options
            };
            filters.push(filter);
        }

        return filters;
    }

    public getBrandByCode({
        code,
        catalogLists
    }: GetBrandByCodeOptions): CatalogListBrandOption | null {
        return (
            Object.values(catalogLists.brand.options).find((brand) => brand.code === code) ?? null
        );
    }

    public getSeriesByBrand({
        catalogLists,
        brand
    }: GetSeriesByBrandOptions): CatalogListDefaultOption[] {
        return Object.values(catalogLists.seria.options)
            .filter((seria) => +seria.brand === brand.id)
            .sort((seriaA, seriaB) => {
                if (seriaA.name > seriaB.name) {
                    return 1;
                } else if (seriaA.name < seriaB.name) {
                    return -1;
                } else {
                    return 0;
                }
            });
    }

    public getSeriaByCode({
        code,
        catalogLists
    }: GetSeriaByCodeOptions): CatalogListDefaultOption | null {
        return (
            Object.values(catalogLists.seria.options).find((seria) => seria.code === code) ?? null
        );
    }

    public getSeriaByUrl({
        url,
        catalogLists
    }: GetSeriaByUrlOptions): CatalogListDefaultOption | null {
        return Object.values(catalogLists.seria.options).find((seria) => seria.url === url) ?? null;
    }

    public getLineByUrl({url, catalogLists}: GetLineByUrlOptions): CatalogListDefaultOption | null {
        return Object.values(catalogLists.line.options).find((line) => line.url === url) ?? null;
    }

    public formatPrice(price: number): string {
        return CatalogApiUtils.priceFormatter.format(price);
    }

    public getCategories({catalogLists}: GetCategoriesOptions): CatalogListFoldersOption[] {
        return catalogLists.folders.options;
    }

    public getAllCategories({
        catalogLists
    }: GetAllCategoriesOptions): CatalogListCategoriesOption[] {
        return catalogLists.categories.options.filter((option) => option._type === 1842);
    }

    public getParentCategory({
        catalogLists,
        category
    }: GetParentCategoryOptions): CatalogListCategoriesOption | null {
        return catalogLists.categories.options.find(({id}) => id === category.parent_id) ?? null;
    }

    public getCompliance({catalogLists, item}: GetComplianceOptions): ComplianceItem[] {
        const ids: number[] = item.compliance?.split(",").map(Number) ?? [];
        const result: ComplianceItem[] = [];

        for (const id of ids) {
            if (!(id in catalogLists.compliance.options)) {
                continue;
            }

            const option: CatalogListDefaultOption = catalogLists.compliance.options[id];

            let logo: string | null;
            let logoOpacity = 0.5;
            let logoHeight = 20;
            switch (option.code) {
                case "oeko-tex":
                    logo = this.api.url("/files/27/oekotex.png");
                    break;
                case "ekgost":
                    logo = this.api.url("/files/27/ekgost.png");
                    break;
                case "rostest":
                    logo = this.api.url("/files/27/icon-cert.svg");
                    logoOpacity = 1;
                    logoHeight = 16;
                    break;
                default:
                    logo = null;
                    break;
            }

            const item: ComplianceItem = {
                id: option.id,
                code: option.code,
                name: option.name,
                logo,
                logoOpacity,
                logoHeight
            };

            result.push(item);
        }

        return result;
    }

    public getSaleCare({ids, catalogLists}: GetSaleCareOptions): SaleCareItem[] {
        if (!ids.care) {
            return [];
        }

        const care: SaleCareItem[] = [];

        for (const careId of ids.care) {
            const item: CatalogListDefaultOption | null = catalogLists.care.options[careId] ?? null;
            if (!item) {
                continue;
            }

            const {name, code} = item;
            let logo: string;
            switch (code) {
                case "stirka30":
                    logo = this.api.url("/files/27/stirka30.png");
                    break;
                case "stirka40":
                    logo = this.api.url("/files/27/stirka40.png");
                    break;
                case "stirka50":
                    logo = this.api.url("/files/27/stirka50.png");
                    break;
                case "stirka60":
                    logo = this.api.url("/files/27/stirka60.png");
                    break;
                case "notiron":
                    logo = this.api.url("/files/27/notiron.png");
                    break;
                case "notbleach":
                    logo = this.api.url("/files/27/notbleach.png");
                    break;
                case "washing-prohibited":
                    continue;
                case "donottumbledry":
                    continue;
                case "lowtemperature":
                    logo = this.api.url("/files/27/lowtemperature.png");
                    break;
                default:
                    continue;
            }

            care.push({name, logo});
        }

        return care;
    }

    public getSalePageUrl({item, optionSelected}: GetSalePageUrlOptions): string {
        const urlParts: string[] = [item.url];

        if (optionSelected !== null) {
            urlParts.push(optionSelected.id.toString());
        }

        return urlJoin(...urlParts, "/");
    }

    public getSaleCompleteness({
        item: saleItem,
        catalogLists
    }: GetSaleCompletenessOptions): SaleSet[] {
        if (typeof saleItem.options === "boolean") {
            return [];
        }

        const optionsByNameMap: Map<string, SaleOption[]> = new Map();
        for (const option of saleItem.options) {
            if (!optionsByNameMap.has(option.name)) {
                optionsByNameMap.set(option.name, [option]);
            } else {
                optionsByNameMap.get(option.name)?.push(option);
            }
        }

        const completeness: SaleSet[] = [];
        for (const [name, options] of optionsByNameMap.entries()) {
            const kompSet: Set<number> = new Set();
            for (const option of options) {
                if (option.komp === "") {
                    continue;
                }

                option.komp
                    .split(",")
                    .map(Number)
                    .forEach((kompId) => kompSet.add(kompId));
            }
            const kompOptions: CatalogListDefaultOption[] = [...kompSet]
                .map((kompId) => catalogLists.komp.options[kompId] ?? null)
                .filter((komp) => komp !== null);

            const items: SaleSetItem[] = [];
            for (const kompOption of kompOptions) {
                const sizeOption: CatalogListDefaultOption | null =
                    catalogLists.size.options[kompOption.size] ?? null;

                const {id, name} = kompOption;
                const size: string = sizeOption?.name ?? "";
                const item: SaleSetItem = {
                    id,
                    name,
                    size
                };
                if (items.some(({name, size}) => name === item.name || size === item.size)) {
                    continue;
                }

                items.push(item);
            }
            if (items.length === 0) {
                continue;
            }

            const id: string = options.map((option) => option.id).join("-");
            const set: SaleSet = {
                id,
                name,
                items
            };
            completeness.push(set);
        }

        return completeness;
    }

    public getSaleMetadata({
        item,
        catalogLists,
        optionSelected,
        image,
        ids,
        allOptions,
        brand = null
    }: GetSaleMetadata): SaleMetadata {
        const title: string = this.getSaleFullName({
            catalogLists,
            optionSelected,
            image
        });

        const desc: SaleDescriptionItem[] = this.getSaleDescription({
            item,
            optionSelected,
            ids,
            allOptions,
            brand,
            catalogLists,
            includeCodes: ["brand"]
        });
        const description: string = desc
            .map(({name, value}) => (name ? name + ": " : "") + value)
            .join(", ")
            .substring(0, 255);

        const metadata: SaleMetadata = {
            title,
            description
        };

        return metadata;
    }

    public getCatalogName({category, filtersSelected}: GetCatalogNameOptions): string {
        if (!category) {
            return "Элитный текстиль для дома";
        } else {
            let catalogName = category.pagetitle ? category.pagetitle : category.name;
            const filterListSelected: SaleFilterSelected[] = Object.values(filtersSelected);

            if (filterListSelected.length > 0) {
                catalogName +=
                    " " +
                    filterListSelected
                        .map((filter) =>
                            Object.values(filter.options)
                                .map((option) => option.name)
                                .join(", ")
                        )
                        .join(" ");
            }

            return catalogName;
        }
    }

    public getBrandLines({brand = null, catalogLists}: GetBrandLinesOptions): BrandLine[] {
        if (brand === null) {
            return [];
        }

        return brand.line
            .split(",")
            .map(Number)
            .map((optionId) => catalogLists.line.options[optionId])
            .filter((option) => !!option)
            .map((line) => {
                const {id, code, name} = line;
                const series: CatalogListDefaultOption[] = this.getLineSeries({line, catalogLists});
                const brandLine: BrandLine = {
                    id,
                    code,
                    name,
                    series
                };

                return brandLine;
            });
    }

    public getLineSeries({line, catalogLists}: GetLineSeriesOptions): CatalogListDefaultOption[] {
        const series: CatalogListDefaultOption[] = line.seria
            .split(",")
            .map(Number)
            .map((optionId) => catalogLists.seria.options[optionId])
            .filter((option) => !!option);

        return series;
    }
}
