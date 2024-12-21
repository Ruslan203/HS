import React, {useCallback, useContext, useState} from "react";
import {useRouter} from "next/router";
import {useToast} from "@common/Toast";
import {
    LoginOptions,
    LoginResult,
    UserInfo,
    UserInfoQuery,
    useApi,
    useUserInfoQuery
} from "@common/api";
import {useApp} from "@common/app";

export interface IAuthContext {
    userInfoQuery: UserInfoQuery;
    userInfo: UserInfo | false;
    loginUser: (options: LoginOptions) => Promise<LoginResult>;
    isLogoutLoading: boolean;
    logoutUser: () => Promise<void>;
}

export const AuthContext = React.createContext<IAuthContext | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({children}) => {
    const router = useRouter();
    const {
        pageProps: {userInfo: initialUserInfo}
    } = useApp();
    const api = useApi();
    const toast = useToast();
    const userInfoQuery = useUserInfoQuery({initialUserInfo});
    const userInfo: UserInfo | false = userInfoQuery.data?.info ?? false;

    const loginUser = useCallback(
        async (options: LoginOptions) => {
            const result: LoginResult = await api.auth.login(options);

            if (result.result === "success") {
                await userInfoQuery.refetch();
                toast.show({
                    message: "Вы успешно авторизовались",
                    position: "bottom-center",
                    type: "success"
                });
            }

            return result;
        },
        [api, userInfoQuery]
    );

    const [isLogoutLoading, setIsLogoutLoading] = useState(false);
    const logoutUser = useCallback(async () => {
        setIsLogoutLoading(true);
        await api.auth.logoff();
        router.reload();
        setIsLogoutLoading(false);
    }, [api]);

    return (
        <AuthContext.Provider
            value={{userInfoQuery, userInfo, loginUser, isLogoutLoading, logoutUser}}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): IAuthContext => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within a AuthProvider.");
    }

    return context;
};
