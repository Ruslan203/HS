import React from "react";
import {usePathname} from "next/navigation";
import styled from "styled-components";
import urlJoin from "url-join";
import {Category} from "@common/Category";
import {MobileMenuElement} from "@common/MobileMenu/Element";
import {useBrand} from "../Context";

export const MobileCategoriesStyled = styled(MobileMenuElement)`
    display: flex;
    width: 100%;
    margin-top: -25px;
    margin-bottom: -15px;
`;

export const MobileCategories: React.FC = () => {
    const pathname = usePathname();
    const {
        brandCategories: {categories}
    } = useBrand();

    if (categories.length === 0) {
        return null;
    }

    return (
        <MobileCategoriesStyled as="div">
            <Category.List columns={2} mobile>
                {categories.map((category) => (
                    <Category.Item
                        key={category.id}
                        href={urlJoin(pathname, "?category=" + category.id)}
                        shallow
                    >
                        {category.name}
                    </Category.Item>
                ))}
            </Category.List>
        </MobileCategoriesStyled>
    );
};
