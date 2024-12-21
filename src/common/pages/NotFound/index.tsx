import React, {useEffect} from "react";

export const NotFoundPage: React.FC = () => {
    useEffect(() => {
        location.href = "/";
    }, []);

    return null;
};
