import {GetAppPageProps, getAppPageProps} from "@common/app";

export type GetBasketServerSideProps = GetAppPageProps;

export const getBasketServerSideProps: GetBasketServerSideProps = getAppPageProps(
    async ({api, isPushRequest, queryClient}) => {
        if (!isPushRequest) {
            queryClient.setQueryData(["basket/getBasketContents"], await api.basket.getContents());
        }

        return {
            props: {}
        };
    }
);
