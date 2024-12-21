import React from "react";
import styled from "styled-components";
import {Category} from "@common/Category";
import {MobileMenuDesktopElement, MobileMenuElement} from "@common/MobileMenu/Element";
import {useCatalog} from "@common/pages/Catalog";

export const SidebarDesktopCategories = styled(MobileMenuDesktopElement)`
    display: flex;
    width: 100%;
`;

export const SidebarMobileCategories = styled(MobileMenuElement)`
    display: flex;
    width: 100%;
`;

export const SidebarCategories: React.FC = () => {
    const {catalogCategories} = useCatalog();

    return (
        <SidebarDesktopCategories as="div">
            <Category.List>
                {catalogCategories.map(({id, name, url}) => (
                    <Category.Item key={id} href={url}>
                        {name}
                    </Category.Item>
                ))}
            </Category.List>
        </SidebarDesktopCategories>
    );
};
