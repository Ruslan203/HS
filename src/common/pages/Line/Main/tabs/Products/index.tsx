import React from "react";
import {Product} from "@common/Product";
import {TabPanel} from "@common/Tabs";
import {Title} from "@common/Title";
import {useCatalog} from "@common/pages/Catalog";
import {useLine} from "../../../Context";

export const ProductsTabPanel: React.FC = () => {
    const {isFirstLoading, isFirstSuccess} = useCatalog();
    const {brandName, line, saleItemsQuery, catalogLists} = useLine();

    return (
        <TabPanel name="products">
            <Title component="h2" variant="h5">
                Линия {line.name} от {brandName}
            </Title>
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
