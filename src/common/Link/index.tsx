import NextLink, {LinkProps as NextLinkProps} from "next/link";
import styled from "styled-components";

export type LinkColor = "default" | "primary";

export interface LinkProps extends NextLinkProps, React.PropsWithChildren {
    color?: LinkColor;
}

export const Link = styled(NextLink)<LinkProps>`
    font: normal 16px ${({theme}) => theme.fonts.roboto};
    color: ${({theme, color}) => {
        switch (color) {
            case "primary":
                return theme.palette.primary;
            default:
                return theme.palette.black;
        }
    }};
    text-decoration: none;
`;
