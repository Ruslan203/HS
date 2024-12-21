import React from "react";
import styled from "styled-components";
import {IconButton} from "@common/IconButton";
import {MobileMenuElement} from "@common/MobileMenu/Element";
import {TextField, TextFieldProps} from "@common/TextField";

export const CatalogSearchStyled = styled(TextField)`
    width: 100%;
`;

export const CatalogSearchContainer = styled.div`
    display: flex;
    gap: 30px;
    align-items: center;
    margin-top: 20px;
    width: 100%;
    max-width: 560px;
`;

export const CatalogMenuButtonStyled = styled(MobileMenuElement)``;

export const CatalogMenuButton: React.FC<React.ComponentProps<typeof IconButton>> = (props) => (
    <CatalogMenuButtonStyled {...props} as={IconButton} />
);

export const CatalogSearch: React.FC<TextFieldProps> = (props) => (
    <CatalogSearchStyled type="search" name="search" placeholder="Поиск" {...props} />
);
