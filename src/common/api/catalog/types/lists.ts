export interface CatalogListOption<Code extends string | void = string> {
    id: number;
    name: string;
    code: Code;
    url?: string;
}

export interface CatalogListDefaultOption extends CatalogListOption<string> {
    picture: string;
    quantity: string;
    photo370: string;
    parentid: string;
    komplekt: string;
    weight: string;
    pagetitle: string;
    add: string;
    addname: string;
    text: string;
    anons: string;
    city: string;
    brand: string;
    size: string;
    color: string;
    seria: string;
}

export interface CatalogListBrandOption extends CatalogListOption<"brand"> {
    url: string;
    quantity: string;
    logo: string;
    weight: string;
    stars: string;
    sold: string;
    text: string;
    line: string;
}

export interface CatalogListColorOption extends CatalogListOption<"color"> {
    weight: string;
    quantity: string;
    komplekt: string;
    hex: string;
    hex_alt: string | boolean;
}

export type CatalogListFoldersOption = CatalogListCategoriesOption;

export interface CatalogListFolders {
    name: string;
    options: CatalogListFoldersOption[];
}

export interface CatalogListCategoriesOption extends CatalogListOption<void> {
    _type: number;
    url: string;
    parent_id: number;
    pagetitle: string;
}

export interface CatalogListCategories {
    name: string;
    options: CatalogListCategoriesOption[];
}

export interface CatalogListDeliveryTypesOption extends CatalogListOption<"delivery_types"> {
    conditions: string;
    price: string;
    price_from: string;
}

export type CatalogAnyList = Omit<GetCatalogListsResult[keyof GetCatalogListsResult], "result">;

export interface CatalogList<Option extends CatalogListOption<string> = CatalogListDefaultOption> {
    id: number;
    code: string;
    name: string;
    path: string;
    hide: string;
    options: Record<string, Option>;
}

export type GetCatalogListsResult = Record<string, CatalogList> & {
    result: string;
    brand: CatalogList<CatalogListBrandOption>;
    color: CatalogList<CatalogListColorOption>;
    delivery_types: CatalogList<CatalogListDeliveryTypesOption>;
    categories: CatalogListCategories;
    folders: CatalogListFolders;
};
