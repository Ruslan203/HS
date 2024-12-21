import React from "react";
import {Tab, TabList, Tabs} from "@common/Tabs";
import {useSeria} from "../Context";
import {AboutTabPanel} from "./tabs/About";
import {ProductsTabPanel} from "./tabs/Products";

export const SeriaMain: React.FC = () => {
    const {brandName, seria} = useSeria();

    return (
        <Tabs defaultTab="products">
            <TabList>
                <Tab name="products">Коллекция {seria.name}</Tab>
                {seria.text ? (
                    <Tab name="about">
                        О коллекции {seria.name} от {brandName}
                    </Tab>
                ) : null}
            </TabList>
            <ProductsTabPanel />
            <AboutTabPanel />
        </Tabs>
    );
};
