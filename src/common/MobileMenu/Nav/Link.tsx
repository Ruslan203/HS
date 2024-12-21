import React, {useCallback} from "react";
import styled, {css} from "styled-components";
import {Link, LinkProps} from "@common/Link";
import {useMobileMenu} from "../Context";
import {MobileMenuElement} from "../Element";

export interface MobileMenuNavLinkStyledProps {
    $active: boolean;
}

export const MobileMenuNavLinkStyled = styled(MobileMenuElement)<MobileMenuNavLinkStyledProps>`
    display: inline-flex;
    font: normal 20px ${({theme}) => theme.fonts.roboto};
    padding: 20px 0px;
    width: 100%;
    ${({theme, $active}) => {
        if ($active) {
            return css`
                border-bottom: 3px solid ${theme.palette.black};
            `;
        } else {
            return css`
                border-bottom: 1px solid ${theme.palette.dividers};
            `;
        }
    }}
`;

export type MobileMenuNavLinkProps = LinkProps & {active?: boolean};

export const MobileMenuNavLink: React.FC<MobileMenuNavLinkProps> = ({active = false, ...props}) => {
    const {closeMenu} = useMobileMenu();
    const handleClick = useCallback(
        (event: React.MouseEvent<HTMLAnchorElement>) => {
            closeMenu();
            props.onClick?.(event);
        },
        [closeMenu, props.onClick]
    );

    return <MobileMenuNavLinkStyled {...props} as={Link} $active={active} onClick={handleClick} />;
};
