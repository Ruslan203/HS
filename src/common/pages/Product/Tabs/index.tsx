import React from "react";
import styled from "styled-components";
import {Tab, TabList, Tabs} from "@common/Tabs";
import {useProduct} from "../Context";
import {CompletenessTabPanel} from "./tabs/Completeness";
import {SeriaTabPanel} from "./tabs/Seria";
import {SpecsTabPanel} from "./tabs/Specs";

export const ProductTabsStyled = styled(Tabs)`
    margin-top: 24px;
`;

export const ProductTabs: React.FC = () => {
    const {seria, brand, completeness} = useProduct();

    return (
        <ProductTabsStyled defaultTab="specs">
            <TabList>
                <Tab name="specs">Характеристики</Tab>
                {completeness.length !== 0 ? <Tab name="completeness">Комплектность</Tab> : null}
                {seria ? (
                    <Tab name="seria">
                        Коллекция {seria.name}
                        {brand !== null ? ` от ${brand.name}` : null}
                    </Tab>
                ) : null}
            </TabList>
            <SpecsTabPanel />
            <CompletenessTabPanel />
            <SeriaTabPanel />
        </ProductTabsStyled>
    );
};
