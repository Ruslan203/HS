import React, {useEffect} from "react";
import {useRouter} from "next/router";

export const ErrorPage: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        router.push("/");
    }, []);

    return null;
};
