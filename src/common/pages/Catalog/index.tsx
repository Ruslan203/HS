import React, {useCallback, useEffect, useMemo, useState} from "react";
import {usePathname} from "next/navigation";
import {useRouter} from "next/router";
import {Page} from "@common/Page";
import {
    CatalogListBrandOption,
    CatalogListDefaultOption,
    CatalogListFoldersOption,
    GetBrandCategoriesResult,
    GetSaleItemsOptions,
    SaleFilter,
    SaleImage,
    SaleItemsFilters,
    SaleOption,
    useApi,
    useSaleItemsQuery
} from "@common/api";
import {GetSaleItemsResult} from "@common/api";
import {AppPageProps, useApp} from "@common/app";
import {LinePage} from "@common/pages/Line";
import {BrandPage} from "../Brand";
import {SeriaPage} from "../Seria";
import {CatalogBody} from "./Body";
import {CatalogProvider} from "./Context";
import {CatalogHead} from "./Head";
import {CatalogPath, getCatalogPath} from "./Path";
import {useCatalogQueryBuilder} from "./QueryBuilder";
import {CatalogSection} from "./Section";

export interface CatalogPageProps {
    brandCategories?: GetBrandCategoriesResult | null;
    saleItems?: GetSaleItemsResult;
}

export const CatalogPage: React.FC<AppPageProps & CatalogPageProps> = ({
    brandCategories = null,
    saleItems: initialSaleItems
}) => {
    const {catalogLists} = useApp();
    const router = useRouter();
    const pathname = usePathname();
    const {name, subname} = router.query;
    const api = useApi();
    const category = useMemo<CatalogListFoldersOption | null>(() => {
        const catalogPath: CatalogPath = getCatalogPath(router.query);
        let category: CatalogListFoldersOption | null = null;

        category = api.catalog.utils.getCategoryByUrl({
            url: catalogPath.toString(),
            catalogLists
        });
        if (router.query.category) {
            category ??= api.catalog.utils.getCategoryById({
                id: +router.query.category,
                catalogLists
            });
        }

        return category;
    }, [catalogLists, router.query]);
    const parentCategory = useMemo<CatalogListFoldersOption | null>(() => {
        if (category !== null) {
            return api.catalog.utils.getParentCategory({
                catalogLists,
                category
            });
        } else {
            return null;
        }
    }, [category]);
    const catalogCategories = useMemo<CatalogListFoldersOption[]>(() => {
        if (category === null) {
            return catalogLists.categories.options.filter((option) => option._type === 1842);
        } else {
            return catalogLists.categories.options.filter(
                (option) => option.parent_id === category?.id
            );
        }
    }, [catalogLists, category]);
    const [brand, seria, line] = useMemo<
        [
            CatalogListBrandOption | null,
            CatalogListDefaultOption | null,
            CatalogListDefaultOption | null
        ]
    >(() => {
        let brand: CatalogListBrandOption | null = null;
        let seria: CatalogListDefaultOption | null = null;
        let line: CatalogListDefaultOption | null = null;

        if (typeof name === "string" && typeof subname === "string") {
            brand = api.catalog.utils.getBrandByCode({code: name, catalogLists});
            seria = api.catalog.utils.getSeriaByUrl({url: pathname, catalogLists});
            if (seria === null) {
                line = api.catalog.utils.getLineByUrl({url: pathname, catalogLists});
            }
        } else if (typeof name === "string") {
            brand = api.catalog.utils.getBrandByCode({code: name, catalogLists});
        }

        return [brand, seria, line];
    }, [name, subname, catalogLists]);
    const {catalogQueryBuilder, sort, setSort, filtersSelected, setFiltersSelected, resetFilters} =
        useCatalogQueryBuilder({router, catalogLists});
    const saleItemsQueryOptions = useMemo<GetSaleItemsOptions>(
        () => catalogQueryBuilder.toGetSaleItemsOptions({category, filtersSelected}),
        [catalogQueryBuilder, category]
    );
    const saleItemsQuery = useSaleItemsQuery({
        initialSaleItems,
        brand: brand?.id,
        seria: seria?.id,
        line: line?.id,
        disableFilters: false,
        ...saleItemsQueryOptions
    });

    const [filtersMenuOpened, setFiltersMenuOpened] = useState(false);
    const openFiltersMenu = useCallback(() => {
        setFiltersMenuOpened(true);
    }, []);
    const closeFiltersMenu = useCallback(() => {
        setFiltersMenuOpened(false);
    }, []);

    const saleFilters = useMemo<SaleFilter[]>(() => {
        const saleItemsFilters: SaleItemsFilters | null =
            saleItemsQuery.data?.pages[0]?.filters ?? null;

        if (category !== null && saleItemsFilters !== null) {
            return api.catalog.utils.getSaleFilters({catalogLists, saleItemsFilters});
        } else {
            return [];
        }
    }, [api, catalogLists, saleItemsQuery]);

    const catalogName = useMemo<string>(
        () =>
            api.catalog.utils.getCatalogName({
                category,
                filtersSelected
            }),
        [api, category, filtersSelected]
    );

    const [isFirstSuccess, setIsFirstSuccess] = useState(false);
    useEffect(() => {
        if (saleItemsQuery.isSuccess && !saleItemsQuery.isFetching) {
            setIsFirstSuccess(true);
        }
    }, [saleItemsQuery.isSuccess, saleItemsQuery.isFetching]);
    const isFirstLoading: boolean =
        !initialSaleItems && saleItemsQuery.isFetching && saleItemsQuery.isInitialLoading;
    const isLoading: boolean = isFirstSuccess && saleItemsQuery.isFetching;

    const pageName = name ? name : catalogName;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.slice(0, -1);
    const productList = saleItemsQuery?.data?.pages[0].items;

    const textTransform = (options: SaleOption[] | boolean, images: SaleImage[]): string => {
        return api.catalog.utils.getSaleFullName({
            catalogLists,
            optionSelected: (options as SaleOption[])[0],
            image: images[0]
        });
    };

    function addProductJsonLd() {
        const jsonLdData = {
            "@context": "https://schema.org/",
            "@type": "ItemList",
            name: pageName,
            itemListElement: productList?.map(({url, options, images}, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                    "@type": "Product",
                    name: textTransform(options, images),
                    url: `${baseUrl}${url}${(options as SaleOption[])[0]?.id || ""}`,
                    image: [`${process.env.NEXT_PUBLIC_API_URL}${images[0]?.photo370 || ""}`],
                    offers: {
                        "@type": "Offer",
                        price: (options as SaleOption[])[0]?.price as string
                    }
                }
            }))
        };

        return {
            __html: JSON.stringify(jsonLdData, null, 2)
        };
    }

    const metaUrl = router.query.name ? `catalog/${router.query.name}` : "";

    let pageNode: React.ReactNode;
    if (brand !== null && seria !== null) {
        pageNode = <SeriaPage seria={seria} brand={brand} />;
    } else if (brand !== null && line !== null) {
        pageNode = <LinePage brand={brand} line={line} />;
    } else if (brand !== null && brandCategories !== null) {
        pageNode = <BrandPage brand={brand} brandCategories={brandCategories} />;
    } else {
        pageNode = (
            <Page
                title={catalogName}
                head={
                    <>
                        <script
                            type="application/ld+json"
                            dangerouslySetInnerHTML={addProductJsonLd()}
                            key="product-jsonld"
                        />
                        <meta property="og:type" content="website" />
                        <meta
                            property="og:url"
                            content={`${process.env.NEXT_PUBLIC_SITE_URL}${metaUrl}`}
                        />
                        <meta property="og:title" content={catalogName} />
                        <meta property="og:image" content="" />
                        <meta property="og:locale" content="ru_RU" />

                        <link rel="canonical" href={`${baseUrl}${router.asPath}`} />
                    </>
                }
            >
                <CatalogSection>
                    <CatalogHead />
                    <CatalogBody />
                </CatalogSection>
            </Page>
        );
    }

    return (
        <CatalogProvider
            catalogName={catalogName}
            catalogLists={catalogLists}
            saleItemsQuery={saleItemsQuery}
            category={category}
            saleFilters={saleFilters}
            sort={sort}
            setSort={setSort}
            filtersSelected={filtersSelected}
            setFiltersSelected={setFiltersSelected}
            resetFilters={resetFilters}
            filtersMenuOpened={filtersMenuOpened}
            openFiltersMenu={openFiltersMenu}
            closeFiltersMenu={closeFiltersMenu}
            catalogCategories={catalogCategories}
            parentCategory={parentCategory}
            isFirstSuccess={isFirstSuccess}
            isFirstLoading={isFirstLoading}
            isLoading={isLoading}
        >
            {pageNode}
        </CatalogProvider>
    );
};

export * from "./Context";
export * from "./getServerSideProps";
