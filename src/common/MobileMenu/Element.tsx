import styled from "styled-components";

export const MobileMenuElement = styled.span`
    @media not (max-width: ${({theme}) => theme.mobile.screenMaxWidth}) {
        display: none !important;
    }
`;

export const MobileMenuDesktopElement = styled.span`
    @media (max-width: ${({theme}) => theme.mobile.screenMaxWidth}) {
        display: none !important;
    }
`;
