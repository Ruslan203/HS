import React from "react";
import Image from "next/image";
import styled from "styled-components";
import filtersIcon from "./assets/filters-icon.svg";

export const FiltersIconStyled = styled(Image)`
    display: inline-flex;
`;

export const FiltersIcon: React.FC = () => (
    <FiltersIconStyled src={filtersIcon} width={16} height={24} alt="Иконка фильтра" priority />
);
