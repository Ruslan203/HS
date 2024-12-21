import React, {useState} from "react";
import styled from "styled-components";
import {TabsProvider} from "./Context";

export const TabsStyled = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
`;

export interface TabsProps extends React.PropsWithChildren {
    defaultTab: string;
    className?: string;
}

export const Tabs: React.FC<TabsProps> = ({defaultTab, className, children}) => {
    const [currentTab, setCurrentTab] = useState<string>(defaultTab);

    return (
        <TabsProvider currentTab={currentTab} setCurrentTab={setCurrentTab}>
            <TabsStyled className={className}>{children}</TabsStyled>
        </TabsProvider>
    );
};

export * from "./Context";
export * from "./Tab";
export * from "./TabList";
export * from "./Panel";
