import React, {useContext} from "react";

export interface ITabsContext {
    currentTab: string;
    setCurrentTab: (currentTab: string) => void;
}

export const TabsContext = React.createContext<ITabsContext | null>(null);

export const TabsProvider: React.FC<ITabsContext & React.PropsWithChildren> = ({
    children,
    ...context
}) => <TabsContext.Provider value={context}>{children}</TabsContext.Provider>;

export function useTabs(): ITabsContext {
    const context = useContext(TabsContext);

    if (!context) {
        throw new Error("useTabs must be used within a TabsProvider.");
    }

    return context;
}
