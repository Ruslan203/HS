import React from "react";
import styled from "styled-components";
import {CatalogMain} from "./Main";
import {CatalogSidebar} from "./Sidebar";

export const CatalogBodyStyled = styled.div`
    display: flex;
    gap: 30px;
`;

export const CatalogBody: React.FC = () => (
    <CatalogBodyStyled>
        <CatalogSidebar />
        <CatalogMain />
    </CatalogBodyStyled>
);
