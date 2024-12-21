import React, {useContext} from "react";
import {GetUserOrdersResult} from "@common/api";

export interface IProfileContext {
    orders: GetUserOrdersResult;
}

export const ProfileContext = React.createContext<IProfileContext | null>(null);

export type ProfileProviderProps = IProfileContext & React.PropsWithChildren;

export const ProfileProvider: React.FC<ProfileProviderProps> = ({children, ...context}) => {
    return <ProfileContext.Provider value={context}>{children}</ProfileContext.Provider>;
};

export const useProfile = (): IProfileContext => {
    const context = useContext(ProfileContext);

    if (!context) {
        throw new Error("useProfile must be used within a ProfileProvider.");
    }

    return context;
};
