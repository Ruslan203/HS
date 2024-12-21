import React from "react";
import styled from "styled-components";
import {MobileMenuDesktopElement} from "@common/MobileMenu/Element";
import {Title} from "@common/Title";
import {useCatalog} from "../../Context";
import {SidebarCategories} from "./Categories";
import {SidebarFilters} from "./Filters";

export const CatalogSidebarStyled = styled(MobileMenuDesktopElement)`
    display: flex;
    flex-direction: column;
    width: 330px;
    margin-bottom: 80px;
`;

export const CatalogSidebarTitle = styled(Title)`
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 20px;
`;

export const CatalogSidebar: React.FC = () => {
    const {catalogCategories} = useCatalog();

    if (catalogCategories.length > 0) {
        return (
            <CatalogSidebarStyled as="aside">
                <CatalogSidebarTitle component="h3">Каталог</CatalogSidebarTitle>
                <SidebarCategories />
            </CatalogSidebarStyled>
        );
    } else {
        return (
            <CatalogSidebarStyled as="aside">
                <SidebarFilters />
            </CatalogSidebarStyled>
        );
    }
};
