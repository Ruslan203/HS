import React from "react";
import styled from "styled-components";
import {useMobileMenu} from "@common/MobileMenu";
import {MobileMenuDesktopElement, MobileMenuElement} from "@common/MobileMenu/Element";
import {useAuth} from "@common/auth";
import {useHeader} from "..";
import {isNavContext} from "../Nav";
import {UserButton} from "./Button";
import {UserMenu} from "./Menu";

export const UserDesktop = styled(MobileMenuDesktopElement)`
    display: flex;
`;

export const UserMobile = styled(MobileMenuElement)`
    display: flex;
    justify-content: flex-end;
    width: 100%;
    padding: 20px 0px;
`;

export const User: React.FC = () => {
    const {openSignInModal} = useHeader();
    const {isForMobile} = useMobileMenu();
    const {userInfo} = useAuth();

    const children: React.ReactNode =
        userInfo === false ? <UserButton onClick={openSignInModal}>Вход</UserButton> : <UserMenu />;

    if (isForMobile) {
        return <UserMobile as="div">{children}</UserMobile>;
    } else if (!isNavContext()) {
        return <UserDesktop as="div">{children}</UserDesktop>;
    } else {
        return null;
    }
};
