import React, {useContext} from "react";

export interface IMobileMenuContext {
    isForMobile: boolean;
    closeMenu: () => void;
}

export const MobileMenuContext = React.createContext<IMobileMenuContext>({
    isForMobile: false,
    closeMenu() {} // eslint-disable-line
});

export const MobileMenuProvider: React.FC<
    {context: IMobileMenuContext} & React.PropsWithChildren
> = ({context, children}) => (
    <MobileMenuContext.Provider value={context}>{children}</MobileMenuContext.Provider>
);

export const useMobileMenu = () => useContext(MobileMenuContext);
