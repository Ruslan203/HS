import React, {useCallback, useContext, useMemo, useState} from "react";
import {AnimatePresence} from "framer-motion";
import {SaleOption} from "@common/api";
import {NotifyMeModal} from "./Modal";

export interface INotifyMeContext {
    openNotifyMeModal: (optionSelected: SaleOption | null) => void;
    closeNotifyMeModal: () => void;
}

export const NotifyMeContext = React.createContext<INotifyMeContext | null>(null);

export const useNotifyMe = (): INotifyMeContext => {
    const context = useContext(NotifyMeContext);

    if (!context) {
        throw new Error("useNotifyMe must be used within a NotifyMe.");
    }

    return context;
};

export type NotifyMeChildren = React.ReactNode | ((context: INotifyMeContext) => React.ReactNode);

export interface NotifyMeProps {
    children: NotifyMeChildren;
}

export const NotifyMe: React.FC<NotifyMeProps> = ({children}) => {
    const [notifyMeModalOpened, setNotifyMeModalOpened] = useState(false);
    const [optionSelected, setOptionSelected] = useState<SaleOption | null>(null);

    const openNotifyMeModal = useCallback((optionSelected: SaleOption | null) => {
        setNotifyMeModalOpened(true);
        setOptionSelected(optionSelected);
    }, []);
    const closeNotifyMeModal = useCallback(() => {
        setNotifyMeModalOpened(false);
        setOptionSelected(null);
    }, []);

    const context = useMemo<INotifyMeContext>(
        () => ({openNotifyMeModal, closeNotifyMeModal}),
        [openNotifyMeModal, closeNotifyMeModal]
    );

    return (
        <NotifyMeContext.Provider value={context}>
            {typeof children === "function" ? children(context) : children}
            <AnimatePresence>
                {optionSelected ? (
                    <NotifyMeModal
                        open={notifyMeModalOpened}
                        optionSelected={optionSelected}
                        animatePresence={false}
                        onClose={closeNotifyMeModal}
                    />
                ) : null}
            </AnimatePresence>
        </NotifyMeContext.Provider>
    );
};
