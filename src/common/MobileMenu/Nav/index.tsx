import React from "react";
import styled, {css} from "styled-components";
import {MobileMenuElement} from "../Element";

export const MobileMenuNavStyled = styled(MobileMenuElement)<{disablePadding: boolean}>`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    ${({disablePadding}) =>
        !disablePadding &&
        css`
            padding: 40px 0px;
        `}
`;

export interface MobileMenuNavProps extends React.ComponentProps<typeof MobileMenuNavStyled> {
    disablePadding?: boolean;
}

export const MobileMenuNav: React.FC<MobileMenuNavProps> = ({disablePadding = false, ...props}) => (
    <MobileMenuNavStyled {...props} as="nav" disablePadding={disablePadding} />
);

export * from "./Link";
