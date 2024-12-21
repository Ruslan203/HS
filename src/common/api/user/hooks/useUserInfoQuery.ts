import {UseQueryResult, useQuery} from "@tanstack/react-query";
import {useApi} from "@common/api";
import {GetUserInfoResult} from "../types";

export type UserInfoQuery = UseQueryResult<GetUserInfoResult>;

export interface UseUserInfoQueryOptions {
    initialUserInfo?: GetUserInfoResult;
}

export const useUserInfoQuery = ({initialUserInfo}: UseUserInfoQueryOptions) => {
    const api = useApi();

    return useQuery(["user/info"], () => api.user.getInfo(), {
        placeholderData: initialUserInfo
    });
};
