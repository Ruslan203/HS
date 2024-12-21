import React from "react";
import styled from "styled-components";
import {Product} from "@common/Product";
import {TabPanel, useTabs} from "@common/Tabs";
import {Title} from "@common/Title";
import {useSaleItemsQuery} from "@common/api";
import {useProduct} from "../../Context";

export const SeriaProductList = styled(Product.List)`
    max-width: 860px;
    margin-top: 20px;
`;

export const SeriaTabPanelTitle = styled(Title)`
    margin-bottom: 20px;
`;

export const SeriaTabPanel: React.FC = () => {
    const {saleItem, seria, brand, catalogLists} = useProduct();
    const {currentTab} = useTabs();

    const seriaSaleItemsQuery = useSaleItemsQuery({
        seria: seria?.id,
        enabled: seria !== null && currentTab === "seria"
    });

    if (!seria) {
        return null;
    }

    return (
        <TabPanel name="seria">
            <SeriaTabPanelTitle>
                Коллекция {seria.name}
                {brand !== null ? ` от ${brand.name}` : null}
            </SeriaTabPanelTitle>
            {seriaSaleItemsQuery.isFetching ? (
                <Product.ListLoading />
            ) : (
                <Product.QueryView
                    saleItemsQuery={seriaSaleItemsQuery}
                    excludeItems={seriaSaleItemsQuery.data?.pages[0].total === 1 ? [] : [saleItem]}
                    catalogLists={catalogLists}
                />
            )}
        </TabPanel>
    );
};
