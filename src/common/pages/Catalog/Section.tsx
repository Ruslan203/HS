import React from "react";
import styled from "styled-components";
import {Container} from "@common/Container";
import {Section, SectionProps} from "@common/Section";

export const CatalogContainer = styled(Container)`
    display: flex;
    flex-direction: column;
    column-gap: 30px;
    row-gap: 45px;
    @media (max-width: ${({theme}) => theme.mobile.screenMaxWidth}) {
        row-gap: 25px;
    }
`;

export const CatalogSectionStyled = styled(Section)`
    padding: 30px 0px;
`;

export const CatalogSection: React.FC<Omit<SectionProps, "as" | "ref">> = ({
    children,
    ...props
}) => (
    <CatalogSectionStyled {...props} disableContainer>
        <CatalogContainer>{children}</CatalogContainer>
    </CatalogSectionStyled>
);
