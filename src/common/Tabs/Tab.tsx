import React from "react";
import styled, {css} from "styled-components";
import {Button} from "@common/Button";
import {useTabs} from "./Context";

export const TabStyled = styled(Button)<{current: boolean}>`
    flex-shrink: 0;
    ${({current}) =>
        current &&
        css`
            cursor: default;
        `}
`;

export interface TabProps {
    name: string;
    children: React.ReactNode;
}

export const Tab: React.FC<TabProps> = ({name, children}) => {
    const {currentTab, setCurrentTab} = useTabs();
    const current = name === currentTab;

    return (
        <TabStyled
            variant={current ? "primary" : "quaternary"}
            current={current}
            onClick={setCurrentTab.bind(null, name)}
        >
            {children}
        </TabStyled>
    );
};
