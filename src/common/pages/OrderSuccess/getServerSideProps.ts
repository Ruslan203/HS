import {GetOrderSuccessResult} from "@common/api";
import {GetAppPageProps, getAppPageProps} from "@common/app";
import {OrderSuccessPageProps} from ".";

export type GetOrderSuccessServerSideProps = GetAppPageProps<OrderSuccessPageProps>;

export const getOrderSuccessServerSideProps: GetOrderSuccessServerSideProps =
    getAppPageProps<OrderSuccessPageProps>(async ({api, query}) => {
        const id = Number(query.id);
        if (Number.isNaN(id)) {
            return {
                notFound: true
            };
        }

        const orderSuccess: GetOrderSuccessResult = await api.basket.getOrderSuccess({id});
        if (orderSuccess.order === false) {
            return {
                notFound: true
            };
        }

        return {
            props: {
                orderSuccess
            }
        };
    });
