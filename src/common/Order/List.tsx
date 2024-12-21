import React from "react";
import styled from "styled-components";
import {Text} from "@common/Text";

export const OrderListStyled = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    gap: 20px;
`;

export const OrderListEmpty = styled(Text)`
    display: block;
    width: 100%;
    font-size: 16px;
`;

export const OrderList: React.FC<React.PropsWithChildren> = ({children}) => {
    const childrenLength: number = React.Children.toArray(children).length;

    if (childrenLength === 0) {
        return <OrderListEmpty>Список заказов пуст.</OrderListEmpty>;
    }

    return <OrderListStyled>{children}</OrderListStyled>;
};
