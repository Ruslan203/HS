import React, {useMemo} from "react";
import NextLink from "next/link";
import styled from "styled-components";
import {Container} from "@common/Container";
import {Link} from "@common/Link";
import {Text} from "@common/Text";
import {CatalogListDefaultOption} from "@common/api";
import {useApp} from "@common/app";

export const FooterStyled = styled.footer`
    display: flex;
    min-height: ${({theme}) => theme.footer.minHeight};
    border-top: 1px solid ${({theme}) => theme.palette.dividers};
    padding: 40px 0px;
`;

export const FooterContainer = styled(Container)`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 40px;
    @media (max-width: 800px) {
        flex-direction: column;
    }
`;

export const Nav = styled.nav`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    width: 100%;
    max-width: 700px;
`;

export const NavLink = styled(Link)`
    font: normal 18px ${({theme}) => theme.fonts.roboto};
`;

export const SocialList = styled.div`
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
`;

export const Social = styled(NextLink)<{$icon: string}>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    font-family: ${({theme}) => theme.fonts.faBrands};
    font-size: 18px;
    text-decoration: none;
    color: ${({theme}) => theme.palette.white};
    background: ${({theme}) => theme.palette.gray};
    &:before {
        content: ${({$icon}) => `"${$icon}"`};
    }
`;

export const FooterRight = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 20px;
    @media (max-width: 800px) {
        align-items: flex-start;
    }
`;

export const Copyright = styled(Text)`
    font: normal 14px ${({theme}) => theme.fonts.roboto};
    color: #a7a59e;
`;

export const socialIcons: Record<string, string> = {
    vk: "\f189",
    fb: "\f39e",
    twitter: "\f099",
    inst: "\f16d",
    ok: "\f263",
    yt: "\f167",
    tg: "\f3fe"
};

export const Footer: React.FC = () => {
    const {catalogLists, categories} = useApp();

    const socials = useMemo<CatalogListDefaultOption[]>(
        () => Object.values(catalogLists.networks.options),
        [catalogLists]
    );

    return (
        <FooterStyled>
            <FooterContainer>
                <Nav>
                    {categories.map(({id, name, url}) => {
                        return (
                            <NavLink key={id} href={url}>
                                {name}
                            </NavLink>
                        );
                    })}
                </Nav>
                <FooterRight>
                    <SocialList>
                        {socials.map(({id, add, name, code}) => (
                            <Social
                                key={id}
                                href={add}
                                $icon={socialIcons[code] ?? socialIcons["tg"]}
                                title={name}
                                target="_blank"
                            />
                        ))}
                    </SocialList>
                    <Copyright>© SuitTextile, 2023</Copyright>
                </FooterRight>
            </FooterContainer>
        </FooterStyled>
    );
};
