import {DehydratedState, QueryClient, dehydrate} from "@tanstack/react-query";
import {GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult} from "next";
import {GetCatalogListsResult, GetUserInfoResult, SuiteTextileApi, createApi} from "@common/api";

export interface AppPageCacheProps {
    catalogLists: GetCatalogListsResult;
}

export interface AppPageProps {
    cache: AppPageCacheProps | "cache";
    userInfo?: GetUserInfoResult;
    dehydratedState?: DehydratedState;
    canonicalUrl?: string | null;
}

export interface GetAppPagePropsContext extends GetServerSidePropsContext {
    api: SuiteTextileApi;
    isPushRequest: boolean;
    appPageProps: AppPageProps;
    catalogLists: GetCatalogListsResult;
    getUserInfo: () => Promise<GetUserInfoResult>;
    queryClient: QueryClient;
}

// eslint-disable-next-line
export type GetAppPageProps<Props extends Record<string, any> = Record<string, any>> =
    GetServerSideProps<AppPageProps & Omit<Props, keyof AppPageProps>>;

// eslint-disable-next-line
export type GetAppPagePropsFn<Props extends Record<string, any> = Record<string, any>> = (
    context: GetAppPagePropsContext
) => Promise<GetServerSidePropsResult<Props>>;

export const appCachePropsSymbol = Symbol("appCacheProps");

export interface GetAppPageCachePropsOptions {
    api: SuiteTextileApi;
}

export async function getAppPageCacheProps({
    api
}: GetAppPageCachePropsOptions): Promise<AppPageCacheProps> {
    const catalogLists: GetCatalogListsResult = await api.catalog.getLists();
    const cacheProps: AppPageCacheProps = {
        catalogLists
    };

    return cacheProps;
}

export function getAppPageProps<Props extends Record<string, any>>( // eslint-disable-line
    getAppPagePropsFn?: GetAppPagePropsFn<Props>
): GetAppPageProps<Omit<Props, keyof AppPageProps>> {
    return async (context) => {
        const {req, resolvedUrl} = context;
        const {headers} = req;
        const api: SuiteTextileApi = createApi({
            headers
        });
        const queryClient = new QueryClient();
        const isPushRequest: boolean = decodeURI(resolvedUrl) !== decodeURI(String(req.url));

        const globalObj = global as any; // eslint-disable-line
        let cacheProps: AppPageCacheProps;
        let appPageCacheProps: AppPageCacheProps | "cache";
        let userInfo: GetUserInfoResult | null;
        if (isPushRequest) {
            cacheProps = globalObj[appCachePropsSymbol];
            appPageCacheProps = "cache";
            userInfo = null;
        } else {
            appPageCacheProps = await getAppPageCacheProps({api});
            globalObj[appCachePropsSymbol] = appPageCacheProps;
            cacheProps = globalObj[appCachePropsSymbol];
            userInfo = await api.user.getInfo();
            queryClient.setQueryData(["user/info"], userInfo);
            queryClient.setQueryData(["basket/getBasketCount"], await api.basket.getCount());
        }
        if (typeof cacheProps === "undefined") {
            appPageCacheProps = await getAppPageCacheProps({api});
            globalObj[appCachePropsSymbol] = appPageCacheProps;
            cacheProps = globalObj[appCachePropsSymbol];
        }

        const {catalogLists} = cacheProps;
        const appPageProps: AppPageProps = {
            cache: appPageCacheProps
        };
        if (userInfo !== null) {
            appPageProps.userInfo = userInfo;
        }

        const getUserInfo = async (): Promise<GetUserInfoResult> => {
            userInfo ??= await api.user.getInfo();

            return userInfo;
        };

        // eslint-disable-next-line
        const {props, ...getServerSidePropsResult}: Record<string, any> =
            (await getAppPagePropsFn?.({
                api,
                isPushRequest,
                appPageProps,
                catalogLists,
                getUserInfo,
                queryClient,
                ...context
            })) ?? {};
        const dehydratedState: DehydratedState = dehydrate(queryClient);
        appPageProps.dehydratedState = dehydratedState;

        return {
            ...getServerSidePropsResult,
            props: {
                ...appPageProps,
                ...props
            }
        };
    };
}

export * from "./Context";
