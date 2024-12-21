import React from "react";
import styled from "styled-components";
import {useMobileMenu} from "@common/MobileMenu";

export const UserDesktopButton = styled.button`
    padding: 14px 20px;
    cursor: pointer;
    border: 2px solid #b9b8b8;
    border-radius: 8px;
    font: normal 16px ${({theme}) => theme.fonts.roboto};
`;

export const UserMobileButton = styled.button`
    border: none;
    background: none;
    padding: 0px;
    cursor: pointer;
    font: normal 20px ${({theme}) => theme.fonts.roboto};
    padding: 20px 0px;
`;

export const UserButton: React.FC<Omit<React.ComponentProps<"button">, "ref">> = (props) => {
    const {isForMobile} = useMobileMenu();

    if (isForMobile) {
        return <UserMobileButton {...props} />;
    } else {
        return <UserDesktopButton {...props} />;
    }
};
