import React from "react";
import {AppProps as NextAppProps} from "next/app";
import Head from "next/head";
import {BasketProvider} from "@common/Basket";
import {ToastProvider} from "@common/Toast";
import {YandexVerification} from "@common/YandexVerification";
import {ApiProvider} from "@common/api";
import {AppPageProps, AppProvider} from "@common/app";
import {AppProgress} from "@common/app/Progress";
import {AppRootLayout} from "@common/app/RootLayout";
import {AppStyles} from "@common/app/Styles";
import {AppErrorPageProps} from "@common/app/error";
import {AppNotFoundPageProps} from "@common/app/not-found";
import {AuthProvider} from "@common/auth";
import {Theme} from "@common/theme";

export type AppProps = NextAppProps<
    AppPageProps & Partial<AppNotFoundPageProps> & Partial<AppErrorPageProps>
>;

export const App: React.FC<AppProps> = ({Component, pageProps}) => {
    if (pageProps.notFound || pageProps.error || pageProps.statusCode === 500) {
        return (
            <Theme.Provider appProgress={{color: Theme.theme.palette.primaryLight}}>
                <Component {...pageProps} />
            </Theme.Provider>
        );
    }
    const {dehydratedState, canonicalUrl = null} = pageProps;

    return (
        <ApiProvider dehydratedState={dehydratedState}>
            <AppProvider pageProps={pageProps}>
                <Head>
                    <title>Suite Textile</title>
                    <meta name="theme-color" content="#3F344F" />
                    <meta name="viewport" content="width=device-width" />
                    <YandexVerification />
                    <link rel="shortcut icon" href="/favicon.ico" />
                    {canonicalUrl !== null ? <link rel="canonical" href={canonicalUrl} /> : null}
                </Head>
                <Theme.Provider>
                    <ToastProvider>
                        <AuthProvider>
                            <BasketProvider>
                                <AppRootLayout>
                                    <Component {...pageProps} />
                                </AppRootLayout>
                            </BasketProvider>
                        </AuthProvider>
                    </ToastProvider>
                    <AppStyles />
                </Theme.Provider>
                <AppProgress />
            </AppProvider>
        </ApiProvider>
    );
};

export default App;
