import React from "react";
import {usePathname} from "next/navigation";
import styled from "styled-components";
import {motion} from "framer-motion";
import urlJoin from "url-join";
import {Category} from "@common/Category";
import {MobileMenuDesktopElement} from "@common/MobileMenu/Element";
import {Product} from "@common/Product";
import {TabPanel} from "@common/Tabs";
import {Title} from "@common/Title";
import {useBrand} from "@common/pages/Brand";
import {useCatalog} from "@common/pages/Catalog";

export const Catalog = styled(motion.div)`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
`;

export const CatalogTitle = styled(MobileMenuDesktopElement)`
    margin-bottom: 30px;
`;

export const ProductList = styled(Product.List)`
    margin-top: 30px;
`;

export const ProductsTabPanel: React.FC = () => {
    const pathname = usePathname();
    const {isFirstLoading, isFirstSuccess} = useCatalog();
    const {
        saleItemsQuery,
        catalogLists,
        brandName,
        brandCategories: {categories}
    } = useBrand();

    return (
        <TabPanel name="products">
            <Catalog>
                <CatalogTitle as={Title} component="h2" variant="h5">
                    Каталог {brandName}
                </CatalogTitle>
                {categories.length > 0 ? (
                    <Category.List columns={2} collapse>
                        {categories.map((category) => (
                            <Category.Item
                                key={category.id}
                                href={urlJoin(pathname, "?category=" + category.id)}
                                shallow
                            >
                                {category.name} ({category.count})
                            </Category.Item>
                        ))}
                    </Category.List>
                ) : null}
            </Catalog>
            {isFirstLoading ? (
                <Product.ListLoading />
            ) : (
                <Product.QueryView
                    saleItemsQuery={saleItemsQuery}
                    catalogLists={catalogLists}
                    defaultIsFirstSuccess={isFirstSuccess}
                />
            )}
        </TabPanel>
    );
};
