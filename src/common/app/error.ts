import {GetStaticProps} from "next";

export interface AppErrorPageProps {
    error: boolean;
    statusCode?: 500;
}

export type GetAppErrorPageProps = GetStaticProps<AppErrorPageProps>;

export function getAppErrorPageProps(): GetAppErrorPageProps {
    return async () => ({
        props: {
            error: true
        }
    });
}
