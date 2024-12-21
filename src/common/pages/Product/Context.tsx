import React, {useContext} from "react";
import {
    CatalogListBrandOption,
    CatalogListDefaultOption,
    CatalogListFoldersOption,
    ComplianceItem,
    GetCatalogListsResult,
    GetFilterParamsSelectedResult,
    SaleCareItem,
    SaleDescriptionItem,
    SaleDiscount,
    SaleFilterParam,
    SaleFilterParamsAvailable,
    SaleFilterParamsSelected,
    SaleImage,
    SaleItem,
    SaleOption,
    SaleOptionIds,
    SaleSet,
    SaleSpecification
} from "@common/api";

export interface IProductContext {
    saleItem: SaleItem;
    name: string;
    brand: CatalogListBrandOption | null;
    stars: number;
    sold: number;
    desc: SaleDescriptionItem[];
    images: SaleImage[];
    image: SaleImage | null;
    setImage: React.Dispatch<React.SetStateAction<SaleImage | null>>;
    filterParams: SaleFilterParam[];
    filterParamsSelected: SaleFilterParamsSelected;
    filterParamsSelectedResult: GetFilterParamsSelectedResult;
    setFilterParamsSelectedResult: React.Dispatch<
        React.SetStateAction<GetFilterParamsSelectedResult>
    >;
    filterParamsAvailable: SaleFilterParamsAvailable;
    optionSelected: SaleOption | null;
    price: number;
    quantity: number;
    discount: SaleDiscount | null;
    specs: SaleSpecification[];
    care: SaleCareItem[];
    compliance: ComplianceItem[];
    category: CatalogListFoldersOption | null;
    seria: CatalogListDefaultOption | null;
    catalogLists: GetCatalogListsResult;
    saleOption: SaleOption | null;
    optionsIds: SaleOptionIds[];
    completeness: SaleSet[];
}

export const ProductContext = React.createContext<IProductContext | null>(null);

export const ProductProvider: React.FC<IProductContext & React.PropsWithChildren> = ({
    children,
    ...context
}) => <ProductContext.Provider value={context}>{children}</ProductContext.Provider>;

export function useProduct(): IProductContext {
    const context = useContext(ProductContext);

    if (!context) {
        throw new Error("useProduct must be used within a ProductProvider.");
    }

    return context;
}
