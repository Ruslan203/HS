import React, {useEffect, useMemo, useState} from "react";
import {usePathname} from "next/navigation";
import styled from "styled-components";
import urlJoin from "url-join";
import {BackLink} from "@common/BackLink";
import {Container} from "@common/Container";
import {Page} from "@common/Page";
import {Section} from "@common/Section";
import {
    CatalogListBrandOption,
    CatalogListDefaultOption,
    CatalogListFoldersOption,
    ComplianceItem,
    GetFilterParamsSelectedResult,
    SaleCareItem,
    SaleDescriptionItem,
    SaleDiscount,
    SaleIds,
    SaleImage,
    SaleItem,
    SaleMetadata,
    SaleOption,
    SaleOptionIds,
    SaleSet,
    SaleSpecification,
    useApi
} from "@common/api";
import {AppPageProps, useApp} from "@common/app";
import {siteUrl} from "@common/config";
import {ProductProvider} from "./Context";
import {Main} from "./Main";
import {ProductTabs} from "./Tabs";

export const ProductSection = styled(Section)`
    padding: 30px 0px;
    padding-bottom: 60px;
    > ${Container} {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        @media (max-width: 1100px) {
            max-width: 800px;
        }
    }
`;

export interface ProductPageProps {
    saleItem: SaleItem;
    category: CatalogListFoldersOption | null;
    seria: CatalogListDefaultOption | null;
    saleOption: SaleOption | null;
}

export const ProductPage: React.FC<AppPageProps & ProductPageProps> = ({
    saleItem,
    category,
    seria,
    saleOption
}) => {
    const pathname = usePathname();
    const {catalogLists, allOptions} = useApp();
    const api = useApi();

    const ids = useMemo<SaleIds>(
        () => api.catalog.utils.getSaleIds({item: saleItem, allOptions}),
        [api, saleItem]
    );
    const filterParams = useMemo(
        () => api.catalog.utils.getFilterParams({allOptions, item: saleItem}),
        [api, allOptions, saleItem]
    );
    const optionsIds = useMemo<SaleOptionIds[]>(
        () => api.catalog.utils.getOptionsIds({allOptions, item: saleItem}),
        [api, allOptions, saleItem]
    );
    const [filterParamsSelectedResult, setFilterParamsSelectedResult] =
        useState<GetFilterParamsSelectedResult>(() =>
            api.catalog.utils.getFilterParamsSelected({filterParams, saleOption, optionsIds})
        );
    const {filterParamsSelected, filterParamsAvailable} = filterParamsSelectedResult;
    const optionSelected = useMemo<SaleOption | null>(
        () => api.catalog.utils.getOptionSelected({item: saleItem, filterParamsSelected}),
        [api, saleItem, filterParamsSelected]
    );

    useEffect(() => {
        setFilterParamsSelectedResult(
            api.catalog.utils.getFilterParamsSelected({
                filterParams,
                saleOption,
                optionsIds
            })
        );
    }, [filterParams, saleOption, optionsIds]);

    const pageUrl = useMemo<string>(
        () => api.catalog.utils.getSalePageUrl({item: saleItem, optionSelected}),
        [saleItem, optionSelected]
    );
    const canonicalUrl = useMemo<string>(() => urlJoin(siteUrl, pageUrl, "/"), [pageUrl]);
    useEffect(() => {
        window.history.replaceState(null, "", pageUrl);
    }, [optionSelected, pageUrl]);

    const images = useMemo<SaleImage[]>(() => {
        if (optionSelected) {
            return api.catalog.utils.getImagesByFilterParamsSelected({
                item: saleItem,
                filterParamsSelected,
                optionSelected
            });
        } else {
            return [];
        }
    }, [api, saleItem, filterParamsSelected, optionSelected]);
    const [image, setImage] = useState<SaleImage | null>(() => images[0] ?? null);
    const brand = useMemo<CatalogListBrandOption | null>(
        () => api.catalog.utils.getSaleBrand({item: saleItem, catalogLists}),
        [api, saleItem, catalogLists]
    );
    const name = useMemo<string>(
        () =>
            api.catalog.utils.getSaleFullName({
                catalogLists,
                optionSelected,
                image
            }),
        [catalogLists, optionSelected, image]
    );
    const stars = +saleItem.stars;
    const sold = +saleItem.sold;
    const desc = useMemo<SaleDescriptionItem[]>(
        () =>
            api.catalog.utils.getSaleDescription({
                item: saleItem,
                optionSelected,
                ids,
                allOptions,
                brand,
                catalogLists
            }),
        [saleItem, optionSelected, ids, allOptions, brand, catalogLists]
    );
    const price = useMemo<number>(() => {
        if (optionSelected) {
            return +optionSelected.price;
        } else {
            return 0;
        }
    }, [optionSelected]);
    const quantity = useMemo<number>(() => {
        if (optionSelected) {
            return +optionSelected.quantity;
        } else {
            return 0;
        }
    }, [optionSelected]);
    const discount = useMemo<SaleDiscount | null>(() => {
        if (optionSelected) {
            return api.catalog.utils.getSaleDiscount({optionSelected});
        } else {
            return null;
        }
    }, [api, optionSelected]);
    const compliance = useMemo<ComplianceItem[]>(
        () => [], // () => api.catalog.utils.getCompliance({catalogLists, item: saleItem}),
        [api, catalogLists, saleItem]
    );
    const specs = useMemo<SaleSpecification[]>(
        () => api.catalog.utils.getSaleSpecifications({ids, allOptions, category}),
        [api, ids, allOptions, category]
    );
    const care = useMemo<SaleCareItem[]>(
        () => api.catalog.utils.getSaleCare({ids, catalogLists}),
        [api, ids, catalogLists]
    );
    const completeness = useMemo<SaleSet[]>(
        () => api.catalog.utils.getSaleCompleteness({item: saleItem, catalogLists}),
        [saleItem, catalogLists]
    );
    const metadata = useMemo<SaleMetadata>(
        () =>
            api.catalog.utils.getSaleMetadata({
                item: saleItem,
                catalogLists,
                optionSelected,
                image,
                ids,
                allOptions,
                brand
            }),
        [saleItem, catalogLists, optionSelected, image, ids, allOptions, brand]
    );

    useEffect(() => {
        setImage(images[0] ?? null);
    }, [images]);

    function addProductJsonLd() {
        return {
            __html: `{
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": "${name}",
      "offers": {
        "@type": "Offer",
        "price":  ${price},
        "priceCurrency":"RUB",
        "priceSpecification": {
            "@type": "PriceSpecification",
            "price": "Pretax price: ${price}",
            "priceCurrency": "Pretax currency: RUB"
          },
        "itemCondition": "new",
        "availability": "instock"
      }
    }
  `
        };
    }

    return (
        <ProductProvider
            saleItem={saleItem}
            images={images}
            image={image}
            setImage={setImage}
            brand={brand}
            name={name}
            stars={stars}
            sold={sold}
            desc={desc}
            filterParams={filterParams}
            filterParamsSelected={filterParamsSelected}
            filterParamsSelectedResult={filterParamsSelectedResult}
            setFilterParamsSelectedResult={setFilterParamsSelectedResult}
            filterParamsAvailable={filterParamsAvailable}
            optionSelected={optionSelected}
            price={price}
            quantity={quantity}
            discount={discount}
            compliance={compliance}
            specs={specs}
            category={category}
            seria={seria}
            care={care}
            catalogLists={catalogLists}
            saleOption={saleOption}
            optionsIds={optionsIds}
            completeness={completeness}
        >
            <Page
                title={metadata.title}
                head={
                    <>
                        <script
                            type="application/ld+json"
                            dangerouslySetInnerHTML={addProductJsonLd()}
                            key="product-jsonld"
                        />
                        <meta name="description" content={metadata.description} />
                        <meta property="og:title" content={name} />
                        <meta property="og:description" content={metadata.description} />
                        {image !== null ? (
                            <>
                                <meta property="og:image" content={api.url(image.picture)} />
                                <meta property="og:image:type" content="image/jpeg" />
                                <meta property="og:image:alt" content={name} />
                                <meta property="og:image:width" content="1200" />
                                <meta property="og:image:height" content="1200" />
                            </>
                        ) : null}
                        <meta property="og:url" content={urlJoin(siteUrl, pathname)} />
                        <meta property="og:locale" content="ru_RU" />
                        <meta property="og:type" content="product" />
                        <link rel="canonical" href={canonicalUrl} />
                    </>
                }
            >
                <ProductSection>
                    {category ? (
                        <BackLink href={category.url}>
                            {category.pagetitle ? category.pagetitle : category.name}
                        </BackLink>
                    ) : null}
                    <Main />
                    <ProductTabs />
                </ProductSection>
            </Page>
        </ProductProvider>
    );
};

export * from "./Context";
export * from "./getServerSideProps";
