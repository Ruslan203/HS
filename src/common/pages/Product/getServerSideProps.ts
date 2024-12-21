import urlJoin from "url-join";
import {
    CatalogListDefaultOption,
    CatalogListFoldersOption,
    SaleAllOptions,
    SaleIds,
    SaleOption
} from "@common/api";
import {GetAppPageProps, getAppPageProps} from "@common/app";
import {ProductPageProps} from "@common/pages/Product";

export type GetProductServerSideProps = GetAppPageProps<ProductPageProps>;

export const getProductServerSideProps: GetProductServerSideProps =
    getAppPageProps<ProductPageProps>(async ({api, query, catalogLists}) => {
        const {name, subname, product, id} = query;
        const path: string = urlJoin(
            "/catalog",
            String(name),
            String(subname),
            String(product),
            "/"
        );
        const {item: saleItem} = await api.catalog.getSaleItem({path});
        let saleOption: SaleOption | null;
        if (saleItem && typeof saleItem.options !== "boolean") {
            saleOption = saleItem.options.find((option) => option.id === Number(id)) ?? null;
        } else {
            saleOption = null;
        }

        if (!saleItem) {
            return {
                notFound: true
            };
        }

        const categoryUrl: string = urlJoin("/catalog", String(name), String(subname), "/");
        const category: CatalogListFoldersOption | null = api.catalog.utils.getCategoryByUrl({
            url: categoryUrl,
            catalogLists
        });
        const allOptions: SaleAllOptions = api.catalog.utils.getAllOptions({catalogLists});
        const ids: SaleIds = api.catalog.utils.getSaleIds({item: saleItem, allOptions});
        const seria: CatalogListDefaultOption | null = api.catalog.utils.getSaleSeria({
            ids,
            catalogLists
        });

        return {
            props: {
                saleItem,
                category,
                seria,
                saleOption
            }
        };
    });
