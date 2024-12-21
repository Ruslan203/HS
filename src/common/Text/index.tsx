import styled, {css} from "styled-components";

export const Text = styled.span<{bold?: boolean}>`
    font: normal 14px ${({theme}) => theme.fonts.roboto};
    line-height: 20px;
    color: ${({theme}) => theme.palette.black};
    ${({bold}) =>
        bold &&
        css`
            font-weight: 500;
        `}
`;
