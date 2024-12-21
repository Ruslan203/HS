import React from "react";
import Image from "next/image";
import styled from "styled-components";
import {Text} from "@common/Text";
import closeIcon from "./assets/close-icon.svg";

export const FilterParamsStyled = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin-bottom: 40px;
`;

export const FilterParamList = styled.div`
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    width: 100%;
`;

export const FilterParamStyled = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 5px 12px;
    background: ${({theme}) => theme.palette.black};
    border-radius: 16px;
`;

export const FilterParamDeleteButton = styled.button`
    display: inline-flex;
    padding: 0px;
    border: none;
    background: none;
    cursor: pointer;
`;

export const FilterParamDeleteButtonIcon = styled(Image)`
    display: inline-flex;
`;

export interface FilterParamProps extends React.PropsWithChildren {
    onDelete?: () => unknown;
}

export const FilterParam: React.FC<FilterParamProps> = ({children, onDelete}) => (
    <FilterParamStyled>
        <FilterParamLabel>{children}</FilterParamLabel>
        <FilterParamDeleteButton onClick={onDelete}>
            <FilterParamDeleteButtonIcon
                src={closeIcon}
                width={10}
                height={10}
                alt="Иконка удаления фильтра"
                priority
            />
        </FilterParamDeleteButton>
    </FilterParamStyled>
);

export const FilterParamLabel = styled(Text)`
    color: ${({theme}) => theme.palette.white};
    cursor: default;
`;

export const FilterResetButton = styled.button`
    display: inline-flex;
    padding: 5px 12px;
    background: none;
    border: none;
    cursor: pointer;
    font: normal 14px ${({theme}) => theme.fonts.roboto};
    color: ${({theme}) => theme.palette.black};
`;

export interface FilterParamsProps extends React.PropsWithChildren {
    onReset?: () => unknown;
}

export const FilterParams: React.FC<FilterParamsProps> = ({children, onReset}) => (
    <FilterParamsStyled>
        <FilterParamList>
            {children}
            <FilterResetButton onClick={onReset}>Сбросить все</FilterResetButton>
        </FilterParamList>
    </FilterParamsStyled>
);
