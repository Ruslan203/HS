import React, {useCallback, useContext, useState} from "react";
import Link from "next/link";
import styled from "styled-components";
import {Container} from "@common/Container";
import {Logo} from "@common/Logo";
import {MobileMenuElement} from "@common/MobileMenu/Element";
import {MobileMenuToggle} from "@common/MobileMenu/Toggle";
import {useModalState} from "@common/Modal";
import {useApp} from "@common/app";
import {useTheme} from "@common/theme";
import {Basket} from "./Basket";
import {Nav, NavLink} from "./Nav";
import {User} from "./User";
import {SignInModal} from "./modals/SignIn";

export const HeaderStyled = styled.header``;

export const HeaderFixedContent = styled.div`
    display: flex;
    position: fixed;
    top: 0px;
    z-index: ${({theme}) => theme.zIndex.header};
    width: 100%;
    height: ${({theme}) => theme.header.height};
    background: ${({theme}) => theme.palette.primary};
    @media (max-width: ${({theme}) => theme.mobile.screenMaxWidth}) {
        height: ${({theme}) => theme.header.mobileHeight};
    }
`;

export const HeaderOffset = styled.div`
    display: flex;
    width: 100%;
    height: ${({theme}) => theme.header.height};
    @media (max-width: ${({theme}) => theme.mobile.screenMaxWidth}) {
        height: ${({theme}) => theme.header.mobileHeight};
    }
`;

export const HeaderContainer = styled(Container)`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const HeaderRight = styled.div`
    display: flex;
    gap: 16px;
    align-items: center;
`;

export const LogoLink = styled(Link)`
    display: inline-flex;
`;

export const HeaderMobileMenuToggle = styled(MobileMenuToggle)`
    position: fixed;
    left: 30px;
    top: calc(
        calc(${({theme}) => theme.header.height} - ${({theme}) => theme.mobileMenu.toggleSize}) / 2
    );
    @media (max-width: ${({theme}) => theme.mobile.screenMaxWidth}) {
        top: calc(
            calc(
                    ${({theme}) => theme.header.mobileHeight} -
                        ${({theme}) => theme.mobileMenu.toggleSize}
                ) / 2
        );
    }
`;

export const HeaderMobileMenuOffset = styled(MobileMenuElement)`
    display: inline-flex;
    width: ${({theme}) => theme.mobileMenu.toggleSize};
    height: ${({theme}) => theme.mobileMenu.toggleSize};
`;

export const Header: React.FC = () => {
    const {categories} = useApp();
    const theme = useTheme();
    const [signInModalOpened, openSignInModal, closeSignInModal] = useModalState(false);
    const [menuOpened, setMenuOpened] = useState(false);

    const toggleMenu = useCallback(() => {
        setMenuOpened(!menuOpened);
    }, [menuOpened]);
    const closeMenu = useCallback(() => {
        setMenuOpened(false);
    }, []);

    return (
        <HeaderContext.Provider value={{openSignInModal, closeSignInModal, menuOpened, closeMenu}}>
            <HeaderStyled>
                <HeaderMobileMenuToggle
                    open={menuOpened}
                    color={menuOpened ? "black" : "white"}
                    zIndex={theme.zIndex.navMenuToggle}
                    onToggle={toggleMenu}
                />
                <HeaderFixedContent>
                    <HeaderContainer>
                        <HeaderMobileMenuOffset />
                        <LogoLink href="/">
                            <Logo />
                        </LogoLink>
                        <Nav>
                            {categories.map(({id, name, url}) => (
                                <NavLink key={id} href={url} shallow>
                                    {name}
                                </NavLink>
                            ))}
                            <User />
                        </Nav>
                        <HeaderRight>
                            <Basket />
                            <User />
                        </HeaderRight>
                    </HeaderContainer>
                    <SignInModal open={signInModalOpened} onClose={closeSignInModal} />
                </HeaderFixedContent>
            </HeaderStyled>
        </HeaderContext.Provider>
    );
};

export interface IHeaderContext {
    openSignInModal: () => void;
    closeSignInModal: () => void;
    menuOpened: boolean;
    closeMenu: () => void;
}

export const HeaderContext = React.createContext<IHeaderContext | null>(null);

export function useHeader(): IHeaderContext {
    const context = useContext(HeaderContext);

    if (!context) {
        throw new Error("HeaderContext must be used within a HeaderContext.Provider.");
    }

    return context;
}
