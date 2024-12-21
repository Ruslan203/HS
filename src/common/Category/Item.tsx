import React from "react";
import styled from "styled-components";
import {Link, LinkProps} from "@common/Link";
import {MobileMenuDesktopElement, MobileMenuElement} from "@common/MobileMenu/Element";
import {useCategoryList} from "./List";

export const CategoryDesktopItem = styled(MobileMenuDesktopElement)`
    display: flex;
    padding: 17px 0px;
    border-bottom: 1px solid ${({theme}) => theme.palette.dividers};
`;

export const CategoryMobileItem = styled(MobileMenuElement)`
    display: inline-flex;
    flex-shrink: 0;
    line-height: 1;
    padding: 15px 0px;
    color: ${({theme}) => theme.palette.darkGray};
`;

export const CategoryItem: React.FC<LinkProps> = (props) => {
    const {mobile} = useCategoryList();

    if (mobile) {
        return <CategoryMobileItem {...props} as={Link} />;
    } else {
        return <CategoryDesktopItem {...props} as={Link} />;
    }
};
