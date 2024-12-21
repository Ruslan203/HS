import {GetUserInfoResult, GetUserOrdersResult} from "@common/api";
import {GetAppPageProps, getAppPageProps} from "@common/app";
import {ProfilePageProps} from ".";

export type GetProfileServerSideProps = GetAppPageProps<ProfilePageProps>;

export const getProfileServerSideProps: GetProfileServerSideProps = getAppPageProps(
    async ({api, getUserInfo}) => {
        const userInfo: GetUserInfoResult = await getUserInfo();
        if (userInfo.info === false) {
            return {
                notFound: true
            };
        }

        const orders: GetUserOrdersResult = await api.user.getOrders();
        return {
            props: {
                orders
            }
        };
    }
);
