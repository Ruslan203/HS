import React from "react";
import {createGlobalStyle} from "styled-components";
import "normalize.css";
import "nprogress/nprogress.css";
import {AppProgressStyles} from "@common/app/Progress";

export const AppMainStyles = createGlobalStyle`
    * {
        box-sizing: border-box;
    }

    *::selection {
        background: #3f344f;
        color: white;
    }

    html {
        min-width: 360px;
    }
`;

export const AppStyles: React.FC = () => (
    <>
        <AppMainStyles />
        <AppProgressStyles />
    </>
);
