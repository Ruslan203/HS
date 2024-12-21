import React from "react";
import styled from "styled-components";

export const TabListStyled = styled.div`
    display: flex;
    width: 100%;
    gap: 12px;
    margin-bottom: 20px;
    overflow: auto;
    padding-bottom: 10px;
`;

export const TabList: React.FC<Omit<React.ComponentProps<"div">, "ref">> = ({
    children,
    ...props
}) => {
    if (React.Children.toArray(children).length <= 1) {
        return null;
    }

    return <TabListStyled {...props}>{children}</TabListStyled>;
};
