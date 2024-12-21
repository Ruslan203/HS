import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useBasket} from "@common/Basket";
import {useNotifyMe} from "@common/NotifyMe";
import {
    CatalogListBrandOption,
    ComplianceItem,
    GetFilterParamsSelectedResult,
    SaleDescriptionItem,
    SaleDiscount,
    SaleFilter,
    SaleFilterParam,
    SaleFilterParamOption,
    SaleFiltersSelected,
    SaleIds,
    SaleImage,
    SaleListItem,
    SaleOption,
    SaleOptionIds,
    useApi
} from "@common/api";
import {useApp} from "@common/app";
import {
    ProductFilter,
    ProductFilterButton,
    ProductFilterColorButton,
    ProductFilterParam,
    ProductItemView
} from "./ItemView";

export interface ProductItemProps {
    saleItem: SaleListItem;
    filtersSelected?: SaleFiltersSelected;
    saleFilters?: SaleFilter[] | null;
}

export const ProductItem: React.FC<ProductItemProps> = ({saleItem, filtersSelected}) => {
    const api = useApi();
    const {catalogLists, allOptions} = useApp();

    const ids = useMemo<SaleIds>(
        () => api.catalog.utils.getSaleIds({item: saleItem, allOptions}),
        [api, saleItem]
    );
    const filterParams = useMemo(
        () => api.catalog.utils.getFilterParams({allOptions, item: saleItem}),
        [api, allOptions, saleItem]
    );
    const optionsIds = useMemo<SaleOptionIds[]>(
        () => api.catalog.utils.getOptionsIds({allOptions, item: saleItem}),
        [api, allOptions, saleItem]
    );
    const [filterParamsSelectedResult, setFilterParamsSelectedResult] =
        useState<GetFilterParamsSelectedResult>(() =>
            api.catalog.utils.getFilterParamsSelected({
                filterParams,
                optionsIds,
                filtersSelected,
                catalogLists
            })
        );
    const {filterParamsSelected, filterParamsAvailable} = filterParamsSelectedResult;
    const optionSelected = useMemo<SaleOption | null>(
        () => api.catalog.utils.getOptionSelected({item: saleItem, filterParamsSelected}),
        [api, saleItem, filterParamsSelected]
    );
    const handleFilterParamSelect = useCallback(
        (param: SaleFilterParam, option: SaleFilterParamOption) => {
            const prev: GetFilterParamsSelectedResult = filterParamsSelectedResult;

            setFilterParamsSelectedResult(
                api.catalog.utils.getFilterParamsSelected({
                    filterParams,
                    optionsIds,
                    prev,
                    param,
                    option
                })
            );
        },
        [api, filterParams, optionsIds, filterParamsSelectedResult]
    );

    useEffect(() => {
        setFilterParamsSelectedResult(
            api.catalog.utils.getFilterParamsSelected({
                filterParams,
                optionsIds,
                filtersSelected,
                catalogLists
            })
        );
    }, [filtersSelected]);

    const image = useMemo<SaleImage | null>(
        () =>
            api.catalog.utils.getImageByFilterParamsSelected({
                item: saleItem,
                filterParamsSelected,
                optionSelected
            }),
        [api, saleItem, filterParamsSelected, optionSelected]
    );
    const imageUrl = useMemo<string | null>(() => {
        if (image && (image.photo370 || image.pic)) {
            return api.url(image.photo370 ?? image.pic);
        } else {
            return null;
        }
    }, [api, image]);
    const fullScreenImageUrl = useMemo<string | null>(() => {
        if (image) {
            return api.url(image.picture);
        } else {
            return null;
        }
    }, [api, image]);
    const brand = useMemo<CatalogListBrandOption | null>(
        () => api.catalog.utils.getSaleBrand({item: saleItem, catalogLists}),
        [api, saleItem, catalogLists]
    );
    const name = useMemo<string>(
        () =>
            api.catalog.utils.getSaleFullName({
                catalogLists,
                optionSelected,
                image
            }),
        [catalogLists, optionSelected, image]
    );
    const desc = useMemo<SaleDescriptionItem[]>(
        () =>
            api.catalog.utils.getSaleDescription({
                item: saleItem,
                optionSelected,
                ids,
                allOptions,
                brand,
                catalogLists
            }),
        [saleItem, optionSelected, ids, allOptions, brand, catalogLists]
    );
    const price = useMemo<number>(() => {
        if (optionSelected) {
            return +optionSelected.price;
        } else {
            return 0;
        }
    }, [optionSelected]);
    const quantity = useMemo<number>(() => {
        if (optionSelected) {
            return +optionSelected.quantity;
        } else {
            return 0;
        }
    }, [optionSelected]);
    const discount = useMemo<SaleDiscount | null>(() => {
        if (optionSelected) {
            return api.catalog.utils.getSaleDiscount({optionSelected});
        } else {
            return null;
        }
    }, [api, optionSelected]);
    const stars = +saleItem.stars;
    const compliance = useMemo<ComplianceItem[]>(
        () => [], // () => api.catalog.utils.getCompliance({catalogLists, item: saleItem}),
        [api, catalogLists, saleItem]
    );
    const pageUrl = useMemo<string>(
        () => api.catalog.utils.getSalePageUrl({item: saleItem, optionSelected}),
        [api, saleItem, optionSelected]
    );

    const {addSaleItemToBasket} = useBasket();
    const [basketLoading, setBasketLoading] = useState(false);
    const handleBasket = useCallback(async () => {
        if (optionSelected !== null) {
            setBasketLoading(true);
            await addSaleItemToBasket(optionSelected);
            setBasketLoading(false);
        }
    }, [addSaleItemToBasket, optionSelected]);

    const {openNotifyMeModal} = useNotifyMe();
    const handleNotifyMe = useCallback(() => {
        openNotifyMeModal(optionSelected);
    }, [openNotifyMeModal, optionSelected]);

    return (
        <ProductItemView
            image={imageUrl}
            fullScreenImage={fullScreenImageUrl}
            company={brand?.name}
            companyPageUrl={brand?.url}
            name={name}
            stars={stars}
            desc={desc}
            price={price}
            quantity={quantity}
            discount={discount}
            compliance={compliance}
            pageUrl={pageUrl}
            filter={
                <ProductFilter>
                    {filterParams.map((param) => {
                        const {id, name, code, options} = param;

                        if (code === "color") {
                            const colorOptions: SaleFilterParamOption[] = options.sort(
                                (optionA, optionB) => {
                                    const availableA: boolean =
                                        filterParamsAvailable[code][optionA.id];
                                    const availableB: boolean =
                                        filterParamsAvailable[code][optionB.id];

                                    if (!availableA && availableB) {
                                        return 1;
                                    } else if (availableA && !availableB) {
                                        return -1;
                                    } else {
                                        return 0;
                                    }
                                }
                            );

                            return (
                                <ProductFilterParam key={id} label={name}>
                                    {colorOptions.map((option) => {
                                        const {id, name, color} = option;
                                        const selected: boolean =
                                            id === filterParamsSelected[code]?.id;
                                        const available: boolean = filterParamsAvailable[code][id];
                                        const handleButtonClick = handleFilterParamSelect.bind(
                                            null,
                                            param,
                                            option
                                        );

                                        if (color === null) {
                                            return null;
                                        }
                                        return (
                                            <ProductFilterColorButton
                                                key={id}
                                                color={color[0]}
                                                secondColor={color[1]}
                                                name={name}
                                                selected={selected}
                                                disabled={!available}
                                                onClick={handleButtonClick}
                                            />
                                        );
                                    })}
                                </ProductFilterParam>
                            );
                        } else {
                            return (
                                <ProductFilterParam key={id} label={name}>
                                    {options.map((option) => {
                                        const {id, name} = option;
                                        const selected = id === filterParamsSelected[code]?.id;
                                        const available = filterParamsAvailable[code][id];
                                        const handleButtonClick = handleFilterParamSelect.bind(
                                            null,
                                            param,
                                            option
                                        );

                                        return (
                                            <ProductFilterButton
                                                key={id}
                                                selected={selected}
                                                disabled={!available}
                                                onClick={handleButtonClick}
                                            >
                                                {name}
                                            </ProductFilterButton>
                                        );
                                    })}
                                </ProductFilterParam>
                            );
                        }
                    })}
                </ProductFilter>
            }
            basketLoading={basketLoading}
            onBasket={handleBasket}
            onNotifyMe={handleNotifyMe}
        />
    );
};
