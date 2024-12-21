import React, {useContext} from "react";

export class Body {
    public lockScroll(): void {
        document.body.style.overflow = "hidden";
    }

    public unlockScroll(): void {
        document.body.style.removeProperty("overflow");
    }
}

export const BodyContext = React.createContext<Body>(new Body());

export const useBody = () => useContext(BodyContext);
