import React from "react";
import styled, {css} from "styled-components";
import {CircularProgress} from "@common/CircularProgress";

export interface ButtonStyledProps {
    variant: ButtonVariant;
    $width?: number;
    fullWidth: boolean;
    $loading: boolean;
}

export const ButtonStyled = styled.button<ButtonStyledProps>`
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border: none;
    padding: 14px 24px;
    border-radius: 8px;
    cursor: ${({disabled, $loading}) => {
        if ($loading) {
            return "progress";
        } else if (disabled) {
            return "not-allowed";
        } else {
            return "pointer";
        }
    }};
    font: 500 16px ${({theme}) => theme.fonts.roboto};
    ${({theme, variant}) => {
        switch (variant) {
            case "primary":
                return css`
                    background: ${theme.palette.black};
                    color: ${theme.palette.white};
                `;
            case "secondary":
                return css`
                    background: ${theme.palette.red};
                    color: ${theme.palette.white};
                `;
            case "tertiary":
                return css`
                    background: ${theme.palette.primary};
                    color: ${theme.palette.white};
                `;
            case "quaternary":
                return css`
                    background: ${theme.palette.dividers};
                    color: ${theme.palette.black};
                `;
            case "outlined":
                return css`
                    background: none;
                    color: ${theme.palette.black};
                    box-shadow: inset 0px 0px 0px 2px rgba(36, 30, 12, 0.2);
                `;
            case "text":
                return css`
                    background: none;
                    color: ${theme.palette.black};
                `;
            case "text-2":
                return css`
                    padding: 0px;
                    background: none;
                    font-weight: normal;
                    &:hover {
                        color: ${({theme}) => theme.palette.red};
                    }
                `;
        }
    }}
    ${({$width, fullWidth}) =>
        (fullWidth || $width) &&
        css`
            width: ${$width ? $width + "px" : "100%"};
        `}
`;

export const ButtonEndIcon = styled.span`
    display: inline-flex;
`;

export const ButtonCircularProgress = styled(CircularProgress)``;

export type ButtonVariant =
    | "primary"
    | "secondary"
    | "tertiary"
    | "quaternary"
    | "outlined"
    | "text"
    | "text-2";

export type ButtonType = "button" | "submit";

export interface ButtonProps extends Omit<React.ComponentProps<"button">, "ref"> {
    variant?: ButtonVariant;
    width?: number;
    fullWidth?: boolean;
    endIcon?: React.ReactNode;
    loading?: boolean;
    type?: ButtonType;
}

export const Button: React.FC<ButtonProps> = ({
    variant = "primary",
    width,
    fullWidth = false,
    endIcon,
    loading = false,
    disabled = false,
    type = "button",
    children,
    ...props
}) => (
    <ButtonStyled
        {...props}
        variant={variant}
        $width={width}
        fullWidth={fullWidth}
        disabled={disabled || loading}
        type={type}
        $loading={loading}
    >
        {loading ? (
            <ButtonCircularProgress size={19} style={{color: "white"}} />
        ) : (
            <>
                {children}
                {endIcon ? <ButtonEndIcon>{endIcon}</ButtonEndIcon> : null}
            </>
        )}
    </ButtonStyled>
);
