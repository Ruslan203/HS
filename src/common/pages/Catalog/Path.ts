import {useMemo} from "react";
import {CatalogQuery} from "./QueryBuilder";

export class CatalogPath {
    public name: string | null = null;
    public subname: string | null = null;

    public toString(): string {
        const {name, subname} = this;

        if (name && subname) {
            return `/catalog/${name}/${subname}/`;
        } else if (name) {
            return `/catalog/${name}/`;
        } else {
            return "/";
        }
    }
}

export const getCatalogPath = (query: CatalogQuery): CatalogPath => {
    const {name, subname} = query;
    const catalogPath = new CatalogPath();

    if (typeof name === "string") {
        catalogPath.name = name;
    }
    if (typeof subname === "string" && subname !== "preload") {
        catalogPath.subname = subname;
    }

    return catalogPath;
};

export const useCatalogPath = (query: CatalogQuery) =>
    useMemo(() => getCatalogPath(query), [query]);
