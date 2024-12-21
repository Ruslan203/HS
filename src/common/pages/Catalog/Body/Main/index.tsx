import React from "react";
import styled from "styled-components";
import {Body} from "./Body";
import {Head} from "./Head";

export const CatalogMainStyled = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

export const CatalogMain: React.FC = () => (
    <CatalogMainStyled>
        <Head />
        <Body />
    </CatalogMainStyled>
);
