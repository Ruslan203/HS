import React from "react";
import {Tab, TabList, Tabs} from "@common/Tabs";
import {useBrand} from "../Context";
import {AboutTabPanel} from "./tabs/About";
import {ProductsTabPanel} from "./tabs/Products";

export const Main: React.FC = () => {
    const {brand} = useBrand();

    return (
        <Tabs defaultTab="products">
            <TabList>
                <Tab name="products">Продукция {brand.name.replace(/\\/g, "")}</Tab>
                {brand.text ? <Tab name="about">О компании</Tab> : null}
            </TabList>
            <ProductsTabPanel />
            <AboutTabPanel />
        </Tabs>
    );
};
