import React from "react";
import {Product} from "@common/Product";
import {TabPanel} from "@common/Tabs";
import {Title} from "@common/Title";
import {useCatalog} from "@common/pages/Catalog";
import {useSeria} from "@common/pages/Seria/Context";

export const ProductsTabPanel: React.FC = () => {
    const {isFirstLoading, isFirstSuccess} = useCatalog();
    const {brandName, seria, saleItemsQuery, catalogLists} = useSeria();

    return (
        <TabPanel name="products">
            <Title component="h2" variant="h5">
                Коллекция {seria.name} от {brandName}
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
