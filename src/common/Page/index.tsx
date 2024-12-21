import React from "react";
import Head from "next/head";
import {Main} from "@common/Main";

export interface PageProps {
    title?: string;
    head?: React.ReactNode;
    disableMain?: boolean;
    children?: React.ReactNode;
}

export const Page: React.FC<PageProps> = ({
    title: subtitle,
    head,
    disableMain = false,
    children
}) => {
    let title = "Suite Textile";
    if (subtitle) {
        title = subtitle + " / " + title;
    }

    return (
        <>
            <Head>
                <title>{title}</title>
                {head}
            </Head>
            {disableMain ? children : <Main>{children}</Main>}
        </>
    );
};
