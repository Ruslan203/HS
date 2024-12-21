import React, {useCallback, useContext} from "react";
import {usePathname} from "next/navigation";
import {useToast} from "@common/Toast";
import {
    AddBasketBulkFailureResult,
    AddBasketBulkMutation,
    BasketContentsQuery,
    BasketCountQuery,
    DeleteBasketItemMutation,
    DeleteBasketItemOptions,
    SaleOption,
    useAddBasketBulkMutation,
    useBasketContentsQuery,
    useBasketCountQuery,
    useDeleteBasketItemMutation
} from "@common/api";

export interface IBasketContext {
    basketCountQuery: BasketCountQuery;
    basketContentsQuery: BasketContentsQuery;
    addBasketBulkMutation: AddBasketBulkMutation;
    deleteBasketItemMutation: DeleteBasketItemMutation;
    addSaleItemToBasket: (optionSelected: SaleOption) => Promise<void>;
    deleteBasketItem: (options: DeleteBasketItemOptions) => void;
}

export const BasketContext = React.createContext<IBasketContext | null>(null);

export const BasketProvider: React.FC<React.PropsWithChildren> = ({children}) => {
    const pathname = usePathname();
    const toast = useToast();

    const basketCountQuery = useBasketCountQuery();
    const basketContentsQuery = useBasketContentsQuery({
        enabled: pathname === "/basket/"
    });
    const addBasketBulkMutation = useAddBasketBulkMutation({basketCountQuery, basketContentsQuery});
    const deleteBasketItemMutation = useDeleteBasketItemMutation({
        basketCountQuery,
        basketContentsQuery
    });

    const addSaleItemToBasket = useCallback(
        async (optionSelected: SaleOption) => {
            const colors: number[] = optionSelected.color?.map(Number) ?? [];
            const sizes: number[] = [optionSelected.id];

            const result: AddBasketBulkFailureResult = await addBasketBulkMutation.mutateAsync({
                colors,
                sizes
            });

            if (result.result === "failure") {
                toast.show({
                    type: "error",
                    message: result.reason,
                    position: "bottom-center"
                });
            } else if (result.result === "success") {
                toast.show({
                    type: "success",
                    message: "Товар добавлен в корзину",
                    position: "bottom-center"
                });
            }
        },
        [toast]
    );

    const deleteBasketItem = useCallback(async (options: DeleteBasketItemOptions) => {
        await deleteBasketItemMutation.mutate(options);

        toast.show({
            type: "success",
            message: "Товар удален из корзины",
            position: "bottom-center"
        });
    }, []);

    return (
        <BasketContext.Provider
            value={{
                basketCountQuery,
                basketContentsQuery,
                addBasketBulkMutation,
                deleteBasketItemMutation,
                addSaleItemToBasket,
                deleteBasketItem
            }}
        >
            {children}
        </BasketContext.Provider>
    );
};

export function useBasket(): IBasketContext {
    const context = useContext(BasketContext);

    if (!context) {
        throw new Error("useBasket must be used within a BasketProvider.");
    }

    return context;
}
