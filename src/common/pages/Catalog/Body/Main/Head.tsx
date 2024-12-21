import React, {useCallback, useMemo} from "react";
import styled from "styled-components";
import {produce} from "immer";
import {CircularProgress} from "@common/CircularProgress";
import {Option, Select} from "@common/Select";
import {Text} from "@common/Text";
import {SaleFilterOption, SaleFilterSelected} from "@common/api";
import {SaleSort} from "../../../../api/catalog/types/sale-items";
import {useCatalog} from "../../Context";
import {FilterParam, FilterParams} from "./FilterParams";

export const HeadStyled = styled.div`
    display: flex;
    flex-direction: column;
`;

export const HeadBottom = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 6px;
    padding-bottom: 20px;
    border-bottom: 1px solid ${({theme}) => theme.palette.dividers};
    width: 100%;
`;

export const Count = styled(Text)`
    color: #666255;
`;

export const Head: React.FC = () => {
    const {
        saleItemsQuery,
        sort,
        setSort,
        filtersSelected,
        setFiltersSelected,
        resetFilters,
        isLoading,
        isFirstLoading
    } = useCatalog();

    const saleItemsTotal: number = saleItemsQuery.isSuccess
        ? saleItemsQuery.data.pages[saleItemsQuery.data.pages.length - 1]?.total
        : 0;

    const handleSortChange = useCallback(
        (event: React.ChangeEvent<HTMLSelectElement>) => {
            const value: string = event.target.value;
            let sort: SaleSort | null;

            if (value === "null") {
                sort = null;
            } else {
                sort = value as SaleSort;
            }

            setSort(sort);
        },
        [setSort]
    );

    const handleFilterDelete = useCallback(
        (filter: SaleFilterSelected, option: SaleFilterOption) => {
            setFiltersSelected(
                produce(filtersSelected, (filtersSelected) => {
                    delete filtersSelected[filter.code]?.options[option.id];
                })
            );
        },
        [setFiltersSelected, filtersSelected]
    );

    const filtersNode = useMemo<React.ReactNode>(() => {
        const filterListSelected: SaleFilterSelected[] = Object.values(filtersSelected);

        if (filterListSelected.length === 0) {
            return null;
        }

        return (
            <FilterParams onReset={resetFilters}>
                {filterListSelected.map((filter) =>
                    Object.values(filter.options).map((option) => (
                        <FilterParam
                            key={option.id}
                            onDelete={handleFilterDelete.bind(null, filter, option)}
                        >
                            {option.name}
                        </FilterParam>
                    ))
                )}
            </FilterParams>
        );
    }, [filtersSelected, handleFilterDelete]);
    const totalNode = useMemo<React.ReactNode>(() => {
        if (isLoading || isFirstLoading) {
            return <CircularProgress size={18} />;
        }

        let totalName: string;
        if (saleItemsTotal === 1) {
            totalName = "модель";
        } else if (saleItemsTotal === 2 || saleItemsTotal === 3 || saleItemsTotal === 4) {
            totalName = "модели";
        } else {
            totalName = "моделей";
        }

        return (
            <Count>
                {saleItemsTotal} {totalName}
            </Count>
        );
    }, [saleItemsTotal, isLoading, isFirstLoading]);

    return (
        <HeadStyled>
            {filtersNode}
            <HeadBottom>
                {totalNode}
                <Select value={sort ?? "null"} onChange={handleSortChange}>
                    <Option value="null">По популярности</Option>
                    <Option value={SaleSort.CHEAPER}>Подешевле</Option>
                    <Option value={SaleSort.EXPENSIVE}>Подороже</Option>
                    <Option value={SaleSort.NAME}>По названию</Option>
                    <Option value={SaleSort.NEW}>По новинкам</Option>
                </Select>
            </HeadBottom>
        </HeadStyled>
    );
};
