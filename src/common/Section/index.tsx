import React from "react";
import styled, {css} from "styled-components";
import {Container} from "@common/Container";

export const SectionStyled = styled.section<{$fullHeight: boolean}>`
    ${({$fullHeight}) =>
        $fullHeight &&
        css`
            min-height: calc(
                100vh - ${({theme}) => theme.header.height} - ${({theme}) => theme.footer.minHeight}
            );
        `}
`;

export type SectionProps = React.ComponentProps<typeof SectionStyled> & {
    disableContainer?: boolean;
    fullHeight?: boolean;
};

export const Section: React.FC<SectionProps> = ({
    disableContainer = false,
    fullHeight = false,
    children,
    ...props
}) => (
    <SectionStyled {...props} $fullHeight={fullHeight}>
        {disableContainer ? children : <Container>{children}</Container>}
    </SectionStyled>
);
