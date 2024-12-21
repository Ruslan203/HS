import React from "react";
import styled, {css} from "styled-components";

export interface TitleStyledProps {
    variant: TitleVariant;
    align: TitleAlign;
}

export const TitleStyled = styled.span<TitleStyledProps>`
    color: #241e0c;
    font-weight: bold;
    font-family: ${({theme}) => theme.fonts.roboto};
    margin: 0px;
    ${({variant}) => {
        switch (variant) {
            case "h2":
                return css`
                    font-size: 32px;
                    line-height: 38px;
                `;
            case "h5":
                return css`
                    font-size: 20px;
                    font-weight: 500;
                    line-height: 1.1;
                `;
        }
    }}
    ${({align}) =>
        css`
            text-align: ${align};
        `}
`;

export type TitleComponent = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type TitleVariant = "h2" | "h5";

export type TitleAlign = "left" | "center" | "right";

export interface TitleProps extends Omit<React.ComponentProps<"h1">, "as" | "ref"> {
    component?: TitleComponent;
    variant?: TitleVariant;
    align?: TitleAlign;
}

export const Title: React.FC<TitleProps> = ({
    component = "h1",
    variant = "h2",
    align = "left",
    ...props
}) => <TitleStyled {...props} as={component} variant={variant} align={align} />;
