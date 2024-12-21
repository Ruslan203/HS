import React, {useContext} from "react";
import {ToastContainer, ToastPosition, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export type ToastType = "default" | "success" | "error" | "info";

export interface ToastShowOptions {
    message: string;
    type?: ToastType;
    position?: ToastPosition;
}

export class Toast {
    public show({message, type, position}: ToastShowOptions): void {
        toast(message, {type, position});
    }
}

export function ToastProvider({children}: React.PropsWithChildren): React.ReactElement {
    return (
        <>
            {children}
            <ToastContainer />
        </>
    );
}

export const ToastContext = React.createContext(new Toast());

export const useToast = () => useContext(ToastContext);
