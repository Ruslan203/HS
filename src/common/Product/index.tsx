import {ProductContainer} from "./Container";
import {ProductItem} from "./Item";
import {
    ProductFilter,
    ProductFilterButton,
    ProductFilterColorButton,
    ProductFilterParam,
    ProductItemView
} from "./ItemView";
import {ProductList} from "./List";
import {ProductListLoading} from "./ListLoading";
import {ProductQueryView} from "./QueryView";
import {ProductShowMoreButton} from "./ShowMoreButton";

export namespace Product {
    export const Item = ProductItem;

    export const ItemView = ProductItemView;

    export const List = ProductList;

    export const ListLoading = ProductListLoading;

    export const Filter = ProductFilter;

    export const FilterParam = ProductFilterParam;

    export const FilterButton = ProductFilterButton;

    export const FilterColorButton = ProductFilterColorButton;

    export const ShowMoreButton = ProductShowMoreButton;

    export const Container = ProductContainer;

    export const QueryView = ProductQueryView;
}

export * from "./List";
