import React, {useMemo} from "react";
import {usePathname} from "next/navigation";
import styled from "styled-components";
import urlJoin from "url-join";
import {Container} from "@common/Container";
import {Page} from "@common/Page";
import {Section} from "@common/Section";
import {
    BrandLine,
    CatalogListBrandOption,
    CatalogListDefaultOption,
    GetBrandCategoriesResult,
    useApi
} from "@common/api";
import {siteUrl} from "@common/config";
import {useCatalog} from "../Catalog";
import {BrandProvider} from "./Context";
import {BrandInfo} from "./Info";
import {Main} from "./Main";
import {MobileCategories} from "./MobileCategories";

export const BrandSection = styled(Section)`
    padding: 30px 0px;
    > ${Container} {
        display: flex;
        align-items: flex-start;
        gap: 30px;
        @media (max-width: 1100px) {
            flex-direction: column;
            align-items: center;
        }
    }
`;

export interface BrandPageProps {
    brand: CatalogListBrandOption;
    brandCategories: GetBrandCategoriesResult;
}

export const BrandPage: React.FC<BrandPageProps> = ({brand, brandCategories}) => {
    const pathname = usePathname();

    const {saleItemsQuery, catalogLists} = useCatalog();
    const api = useApi();
    const brandName: string = brand.name.replace(/\\/g, "");
    const stars: number | null = brand.stars ? +brand.stars : null;
    const sold: number | null = brand.sold ? +brand.sold : null;
    const series = useMemo<CatalogListDefaultOption[]>(
        () => api.catalog.utils.getSeriesByBrand({catalogLists, brand}),
        [api, catalogLists, brand]
    );
    const lines = useMemo<BrandLine[]>(
        () => api.catalog.utils.getBrandLines({brand, catalogLists}),
        [api, brand, catalogLists]
    );
    const pageTitle: string = "Бренд " + brandName;
    const pageDesc: string = brand.text.split("\n")[0];

    return (
        <BrandProvider
            brand={brand}
            brandName={brandName}
            stars={stars}
            sold={sold}
            series={series}
            lines={lines}
            brandCategories={brandCategories}
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
                <BrandSection>
                    <MobileCategories />
                    <BrandInfo />
                    <Main />
                </BrandSection>
            </Page>
        </BrandProvider>
    );
};

export * from "./Context";
