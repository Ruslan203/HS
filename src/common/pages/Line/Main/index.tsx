import React from "react";
import {Tab, TabList, Tabs} from "@common/Tabs";
import {useLine} from "../Context";
import {AboutTabPanel} from "./tabs/About";
import {ProductsTabPanel} from "./tabs/Products";

export const LineMain: React.FC = () => {
    const {brandName, line} = useLine();

    return (
        <Tabs defaultTab="products">
            <TabList>
                <Tab name="products">Линия {line.name}</Tab>
                {line.text ? (
                    <Tab name="about">
                        О линии {line.name} от {brandName}
                    </Tab>
                ) : null}
            </TabList>
            <ProductsTabPanel />
            <AboutTabPanel />
        </Tabs>
    );
};
