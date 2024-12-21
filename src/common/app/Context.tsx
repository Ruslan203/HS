import React, {useContext, useMemo} from "react";
import {CatalogListFoldersOption, GetCatalogListsResult, SaleAllOptions, useApi} from "@common/api";
import {AppPageCacheProps, AppPageProps} from ".";

export interface IAppContext {
    pageProps: AppPageProps;
    catalogLists: GetCatalogListsResult;
    allOptions: SaleAllOptions;
    categories: CatalogListFoldersOption[];
}

export const AppContext = React.createContext<IAppContext | null>(null);

export interface AppProviderProps extends React.PropsWithChildren {
    pageProps: AppPageProps;
}

export const appCachePropsSymbol = Symbol("appCacheProps");

export const AppProvider: React.FC<AppProviderProps> = ({pageProps, children}) => {
    const {cache: initialCacheProps} = pageProps;
    const cacheProps = useMemo<AppPageCacheProps>(() => {
        if (typeof window === "undefined") {
            return initialCacheProps;
        } else {
            const globalObj = window as any; // eslint-disable-line

            if (initialCacheProps === "cache") {
                return globalObj[appCachePropsSymbol];
            } else {
                globalObj[appCachePropsSymbol] = initialCacheProps;

                return initialCacheProps;
            }
        }
    }, [initialCacheProps]);
    const {catalogLists} = cacheProps;

    const api = useApi();
    const allOptions = useMemo<SaleAllOptions>(
        () => api.catalog.utils.getAllOptions({catalogLists}),
        [api, catalogLists]
    );
    const categories = useMemo<CatalogListFoldersOption[]>(
        () => api.catalog.utils.getCategories({catalogLists}),
        [api]
    );

    return (
        <AppContext.Provider value={{pageProps, catalogLists, allOptions, categories}}>
            {children}
        </AppContext.Provider>
    );
};

export interface AppConsumerProps {
    children: (context: IAppContext) => React.ReactNode;
}

export const AppConsumer: React.FC<AppConsumerProps> = ({children}) => {
    return (
        <AppContext.Consumer>
            {(context) => {
                if (!context) {
                    throw new Error("AppConsumer must be used within a AppProvider.");
                }

                return children(context);
            }}
        </AppContext.Consumer>
    );
};

export function useApp(): IAppContext {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error("useApp must be used within a AppProvider.");
    }

    return context;
}
