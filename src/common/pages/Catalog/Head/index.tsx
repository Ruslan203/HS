import React from "react";
import styled, {css} from "styled-components";
import {BackLink} from "@common/BackLink";
import {Category} from "@common/Category";
import {MobileMenuElement} from "@common/MobileMenu/Element";
import {Title} from "@common/Title";
import {FiltersIcon} from "@common/icons/Filters";
import {useCatalog} from "../Context";
import {CatalogMenuButton} from "./Search";

export const CatalogHeadStyled = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

export const CatalogHeadMobileCategories = styled(MobileMenuElement)`
    display: flex;
    width: 100%;
    margin-bottom: 10px;
`;

export const CatalogHeadInfo = styled.div<{$mobileHidden: boolean}>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    @media (max-width: ${({theme}) => theme.mobile.screenMaxWidth}) {
        ${({$mobileHidden}) =>
            $mobileHidden &&
            css`
                display: none;
            `}
        ${CatalogHeadMobileCategories} + & {
            margin-top: 10px;
        }
    }
`;

export const CatalogHeadBackLink = styled(BackLink)`
    margin-top: 10px;
    @media (max-width: ${({theme}) => theme.mobile.screenMaxWidth}) {
        margin-top: 5px;
    }
`;

export const CatalogHeadTitle = styled(Title)<{$minimize: boolean}>`
    ${({$minimize}) =>
        $minimize &&
        css`
            font-size: 24px;
            line-height: 1.4;
        `}
    @media (max-width: ${({theme}) => theme.mobile.screenMaxWidth}) {
        font-size: 24px;
        line-height: 1.4;
    }
`;

export const CatalogHeadStoreTitle = styled(Title)`
    @media (max-width: ${({theme}) => theme.mobile.screenMaxWidth}) {
        display: none;
    }
`;

export const CatalogHead: React.FC = () => {
    const {catalogName, category, parentCategory, catalogCategories, openFiltersMenu} =
        useCatalog();

    return (
        <CatalogHeadStyled>
            {catalogCategories.length > 0 ? (
                <CatalogHeadMobileCategories as="div">
                    <Category.List mobile>
                        {catalogCategories.map(({id, name, url}) => (
                            <Category.Item key={id} href={url}>
                                {name}
                            </Category.Item>
                        ))}
                    </Category.List>
                </CatalogHeadMobileCategories>
            ) : null}
            <CatalogHeadInfo $mobileHidden={!category && catalogCategories.length !== 0}>
                {category ? (
                    <CatalogHeadTitle $minimize={catalogName.length > 35}>
                        {catalogName}
                    </CatalogHeadTitle>
                ) : (
                    <CatalogHeadStoreTitle>Магазин</CatalogHeadStoreTitle>
                )}
                {catalogCategories.length === 0 ? (
                    <CatalogMenuButton onClick={openFiltersMenu}>
                        <FiltersIcon />
                    </CatalogMenuButton>
                ) : null}
            </CatalogHeadInfo>
            {parentCategory ? (
                <CatalogHeadBackLink href={parentCategory.url}>
                    {parentCategory.name}
                </CatalogHeadBackLink>
            ) : null}
        </CatalogHeadStyled>
    );
};
