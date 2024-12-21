import {DehydratedState, Hydrate, QueryClient, QueryClientProvider} from "@tanstack/react-query";
import React, {useContext, useMemo, useState} from "react";
import {SuiteTextileApi, createApi} from ".";

export const ApiContext = React.createContext<SuiteTextileApi | null>(null);

export interface ApiProviderProps extends React.PropsWithChildren {
    dehydratedState?: DehydratedState;
}

export const ApiProvider: React.FC<ApiProviderProps> = ({dehydratedState, children}) => {
    const api = useMemo(() => createApi(), []);
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        refetchOnWindowFocus: false
                    }
                }
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <Hydrate state={dehydratedState}>
                <ApiContext.Provider value={api}>{children}</ApiContext.Provider>
            </Hydrate>
        </QueryClientProvider>
    );
};

export function useApi(): SuiteTextileApi {
    const context = useContext(ApiContext);

    if (!context) {
        throw new Error("useApi must be used within a ApiProvider.");
    }

    return context;
}
