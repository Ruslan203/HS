import React from "react";
import styled from "styled-components";
import {useTabs} from "./Context";

export const TabPanelStyled = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 10px;
    width: 100%;
`;

export interface TabPanelProps extends React.PropsWithChildren {
    name: string;
    className?: string;
}

export const TabPanel: React.FC<TabPanelProps> = ({name, className, children}) => {
    const {currentTab} = useTabs();

    if (name !== currentTab) {
        return null;
    }

    return <TabPanelStyled className={className}>{children}</TabPanelStyled>;
};
