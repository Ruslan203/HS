import React, {useMemo} from "react";
import {usePathname} from "next/navigation";
import styled from "styled-components";
import urlJoin from "url-join";
import {Container} from "@common/Container";
import {Page} from "@common/Page";
import {Section} from "@common/Section";
import {CatalogListBrandOption, CatalogListDefaultOption, useApi} from "@common/api";
import {siteUrl} from "@common/config";
import {useCatalog} from "../Catalog";
import {LineProvider} from "./Context";
import {LineInfo} from "./Info";
import {LineMain} from "./Main";

export const LineSection = styled(Section)`
    padding: 30px 0px;
    > ${Container} {
        display: flex;
        align-items: flex-start;
        gap: 30px;
        @media (max-width: 1100px) {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
    }
`;

export interface LinePageProps {
    line: CatalogListDefaultOption;
    brand: CatalogListBrandOption;
}

export const LinePage: React.FC<LinePageProps> = ({line, brand}) => {
    const pathname = usePathname();

    const api = useApi();
    const {saleItemsQuery, catalogLists} = useCatalog();
    const brandName: string = brand.name.replace(/\\/g, "");
    const stars: number | null = brand.stars ? +brand.stars : null;
    const sold: number | null = brand.sold ? +brand.sold : null;
    const pageTitle: string = "Линия " + [brandName, line.name].join(" ");
    const pageDesc: string = brand.text.split("\n")[0];
    const serias = useMemo<CatalogListDefaultOption[]>(
        () => api.catalog.utils.getLineSeries({line, catalogLists}),
        [api, line, catalogLists]
    );

    return (
        <LineProvider
            line={line}
            brand={brand}
            brandName={brandName}
            serias={serias}
            stars={stars}
            sold={sold}
            saleItemsQuery={saleItemsQuery}
            catalogLists={catalogLists}
        >
            <Page
                title={pageTitle}
                head={
                    <>
                        <meta name="description" content={pageDesc} />
                        <meta property="og:title" content={pageTitle} />
                        <meta property="og:description" content={pageDesc} />
                        {brand.logo ? (
                            <>
                                <meta property="og:image" content={api.url(brand.logo)} />
                                <meta property="og:image:type" content="image/jpeg" />
                                <meta property="og:image:alt" content={pageTitle} />
                                <meta property="og:image:width" content="128" />
                                <meta property="og:image:height" content="128" />
                            </>
                        ) : null}
                        <meta property="og:url" content={urlJoin(siteUrl, pathname)} />
                        <meta property="og:locale" content="ru_RU" />
                    </>
                }
            >
                <LineSection>
                    <LineInfo />
                    <LineMain />
                </LineSection>
            </Page>
        </LineProvider>
    );
};
