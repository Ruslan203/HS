import React, {useEffect, useRef, useState} from "react";
import ReactDOM from "react-dom";

export const Portal: React.FC<React.PropsWithChildren> = ({children}) => {
    const containerRef = useRef<Element | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        containerRef.current = document.querySelector("#portal");
        setMounted(true);
    }, []);

    if (!mounted || !containerRef.current) {
        return null;
    }

    return ReactDOM.createPortal(children, containerRef.current);
};
