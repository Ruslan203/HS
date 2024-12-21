import React, {useCallback, useMemo} from "react";
import styled from "styled-components";
import {motion} from "framer-motion";
import {produce} from "immer";
import {Button} from "@common/Button";
import {CircularProgress} from "@common/CircularProgress";
import {
    MobileMenu,
    MobileMenuDrawerFooter,
    MobileMenuDrawerFooterButtons
} from "@common/MobileMenu";
import {MobileMenuDesktopElement, MobileMenuElement} from "@common/MobileMenu/Element";
import {
    SaleFilter,
    SaleFilterOption,
    SaleFilterSelected,
    SaleFiltersSelected,
    SaleImage,
    SaleListItem,
    SaleOption,
    useApi
} from "@common/api";
import {useApp} from "@common/app";
import {useCatalog} from "@common/pages/Catalog";
import {SidebarFiltersCheckbox} from "./Checkbox";
import {SidebarFiltersGroup} from "./Group";

export const SidebarDesktopFilters = styled(MobileMenuDesktopElement)`
    display: flex;
    flex-direction: column;
    gap: 30px;
    align-items: flex-start;
`;

export const SidebarDesktopFiltersLoading = styled(MobileMenuDesktopElement)`
    display: flex;
    width: 100%;
    height: calc(100vh - ${({theme}) => theme.header.height} - 200px);
    justify-content: center;
    align-items: center;
    cursor: progress;
`;

export const SidebarMobileFilters = styled(MobileMenuElement)`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
`;

export const SidebarFilters: React.FC = () => {
    const {
        saleFilters,
        filtersMenuOpened,
        filtersSelected,
        setFiltersSelected,
        closeFiltersMenu,
        isLoading,
        isFirstLoading,
        saleItemsQuery,
        resetFilters
    } = useCatalog();

    const {catalogLists, allOptions} = useApp();
    const api = useApi();

    const handleFiltersCheckboxChange = useCallback(
        (
            filter: SaleFilter,
            option: SaleFilterOption,
            filtersSelected: SaleFiltersSelected,
            setFiltersSelected: (filtersSelected: SaleFiltersSelected) => void
        ) => {
            setFiltersSelected(
                produce(filtersSelected, (filtersSelected) => {
                    const filterSelected: SaleFilterSelected = filtersSelected[filter.code] ?? {
                        id: filter.id,
                        code: filter.code,
                        name: filter.name,
                        options: {}
                    };

                    if (option.id in filterSelected.options) {
                        delete filterSelected.options[option.id];
                    } else {
                        const optionSelected: SaleFilterOption = {
                            id: option.id,
                            name: option.name,
                            code: option.code,
                            count: option.count,
                            colors: option.colors
                        };

                        filterSelected.options[option.id] = optionSelected;
                    }

                    filtersSelected[filter.code] = filterSelected;
                })
            );
        },
        []
    );

    const textTransform = (options: SaleOption[] | boolean, images: SaleImage[]): string => {
        return api.catalog.utils.getSaleFullName({
            catalogLists,
            optionSelected: (options as SaleOption[])[0],
            image: images[0]
        });
    };
    const newItems = useMemo(() => {
        return saleItemsQuery?.data?.pages.reduce((arg: SaleListItem[], val) => {
            const item: SaleListItem[] = val.items;
            arg.push(...item);
            return arg;
        }, []);
    }, [saleItemsQuery?.data?.pages]);

    const productWithSizes = useMemo(() => {
        return newItems?.map((item) => {
            item.size = api.catalog.utils
                .getFilterParams({allOptions, item})[0]
                ?.options.reduce((arg, val) => {
                    arg += val.name;
                    return arg;
                }, "");
            return item;
        });
    }, [newItems]);

    const isActiveProduct = (optionName: string, id: number) => {
        return !!productWithSizes?.find(({options, images, line, country, size}) => {
            const newName = `${textTransform(options, images)}${country}${line}${size}`;

            const isActive = newName.includes(optionName) || newName.includes(`${id}`);

            return isActive;
        });
    };

    const filteredList = () => {
        return saleFilters.map((val) => {
            val.options = [
                ...val.options.map((val) => {
                    const isActive = isActiveProduct(val.name, val.id);
                    val.disabled = !isActive;
                    return val;
                })
            ];
            return {...val};
        });
    };
    const filtered = filteredList();

    const handleMobileFiltersSelectedApply = useCallback(() => {
        setFiltersSelected(filtersSelected);
        closeFiltersMenu();
    }, [setFiltersSelected, filtersSelected, closeFiltersMenu]);

    if (isFirstLoading || saleFilters.length === 0) {
        return (
            <SidebarDesktopFiltersLoading>
                <CircularProgress />
            </SidebarDesktopFiltersLoading>
        );
    }

    return (
        <>
            <SidebarDesktopFilters as={motion.div} animate={{opacity: isLoading ? 0.4 : 1}}>
                {filtered.map((filter) => {
                    return (
                        <SidebarFiltersGroup key={filter.id} label={filter.name}>
                            {filter.options.map((option) => {
                                return (
                                    <SidebarFiltersCheckbox
                                        key={option.id}
                                        checked={!!filtersSelected[filter.code]?.options[option.id]}
                                        count={option.count}
                                        onChange={handleFiltersCheckboxChange.bind(
                                            null,
                                            filter,
                                            option,
                                            filtersSelected,
                                            setFiltersSelected
                                        )}
                                    >
                                        {option.name}
                                    </SidebarFiltersCheckbox>
                                );
                            })}
                        </SidebarFiltersGroup>
                    );
                })}
            </SidebarDesktopFilters>
            <MobileMenu
                label="Фильтры"
                open={filtersMenuOpened}
                footer={
                    <MobileMenuDrawerFooter>
                        <MobileMenuDrawerFooterButtons>
                            <Button variant="outlined" fullWidth onClick={resetFilters}>
                                Сбросить
                            </Button>
                            <Button fullWidth onClick={handleMobileFiltersSelectedApply}>
                                Применить
                            </Button>
                        </MobileMenuDrawerFooterButtons>
                    </MobileMenuDrawerFooter>
                }
                onClose={closeFiltersMenu}
            >
                <SidebarMobileFilters as="div">
                    {filtered.map((filter) => {
                        return (
                            <SidebarFiltersGroup key={filter.id} label={filter.name}>
                                {filter.options.map((option) => {
                                    return (
                                        <SidebarFiltersCheckbox
                                            key={option.id}
                                            checked={
                                                !!filtersSelected[filter.code]?.options[option.id]
                                            }
                                            onChange={handleFiltersCheckboxChange.bind(
                                                null,
                                                filter,
                                                option,
                                                filtersSelected,
                                                setFiltersSelected
                                            )}
                                        >
                                            {option.name}
                                        </SidebarFiltersCheckbox>
                                    );
                                })}
                            </SidebarFiltersGroup>
                        );
                    })}
                </SidebarMobileFilters>
            </MobileMenu>
        </>
    );
};
