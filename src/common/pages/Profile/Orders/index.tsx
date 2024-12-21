import React from "react";
import styled from "styled-components";
import {Order} from "@common/Order";
import {Title} from "@common/Title";
import {useProfile} from "../Context";

export const ProfileOrdersStyled = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    margin-bottom: 60px;
`;

export const ProfileOrdersTitle = styled(Title)`
    font-size: 26px;
    line-height: 1;
    margin-top: 20px;
    margin-bottom: 30px;
    @media (max-width: ${({theme}) => theme.mobile.screenMaxWidth}) {
        margin-top: 0px;
    }
`;

export const ProfileOrders: React.FC = () => {
    const {orders} = useProfile();

    return (
        <ProfileOrdersStyled>
            <ProfileOrdersTitle component="h3">Мои заказы</ProfileOrdersTitle>
            <Order.List>
                {orders.orders.map((order) => (
                    <Order.Item key={order.id} order={order} />
                ))}
            </Order.List>
        </ProfileOrdersStyled>
    );
};
