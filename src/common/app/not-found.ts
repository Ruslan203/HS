import {GetStaticProps} from "next";

export interface AppNotFoundPageProps {
    notFound: boolean;
}

export type GetAppNotFoundPageProps = GetStaticProps<AppNotFoundPageProps>;

export function getAppNotFoundPageProps(): GetAppNotFoundPageProps {
    return async () => ({
        props: {
            notFound: true
        }
    });
}
