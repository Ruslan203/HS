import React, {useEffect} from "react";
import {useRouter} from "next/router";
import {createGlobalStyle} from "styled-components";
import NProgress from "nprogress";

export interface AppProgressStylesProps {
    color?: string;
}

export const AppProgressStyles = createGlobalStyle<AppProgressStylesProps>`
    #nprogress .bar {
        background: ${({theme, color}) => color ?? theme.appProgress.color} !important;
        z-index: ${({theme}) => theme.zIndex.appProgress} !important;
    }

    #nprogress .peg {
        box-shadow: 0 0 10px ${({theme, color}) => color ?? theme.appProgress.color}, 0 0 5px ${({
    theme,
    color
}) => color ?? theme.appProgress.color} !important;
    }
`;

export const AppProgress: React.FC = React.memo(() => {
    const router = useRouter();

    useEffect(() => {
        NProgress.configure({showSpinner: false});

        const handleRouteStart = () => NProgress.start();
        const handleRouteDone = () => NProgress.done();

        router.events.on("routeChangeStart", handleRouteStart);
        router.events.on("routeChangeComplete", handleRouteDone);
        router.events.on("routeChangeError", handleRouteDone);

        return () => {
            router.events.off("routeChangeStart", handleRouteStart);
            router.events.off("routeChangeComplete", handleRouteDone);
            router.events.off("routeChangeError", handleRouteDone);
        };
    }, []);

    return null;
});

AppProgress.displayName = "AppProgress";
