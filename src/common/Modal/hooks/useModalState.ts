import {useCallback, useState} from "react";

export type ModalState = boolean;

export type OpenModalFunction = () => unknown;

export type CloseModalFunction = () => unknown;

export type SetModalState = (state: ModalState) => void;

export type UseModalStateResult = [
    ModalState,
    OpenModalFunction,
    CloseModalFunction,
    SetModalState
];

export function useModalState(defaultState = false): UseModalStateResult {
    const [state, setState] = useState(defaultState);

    const openModal = useCallback(() => {
        setState(true);
    }, []);
    const closeModal = useCallback(() => {
        setState(false);
    }, []);

    return [state, openModal, closeModal, setState];
}
