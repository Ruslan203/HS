import React, {useCallback, useMemo, useState} from "react";
import Image from "next/image";
import NextLink from "next/link";
import styled from "styled-components";
import {css} from "styled-components";
import {motion} from "framer-motion";
import moment from "moment";
import {Button} from "@common/Button";
import {Text} from "@common/Text";
import {useToast} from "@common/Toast";
import {CatalogListDefaultOption, OrderInfo as OrderInfoApi, useApi} from "@common/api";
import {useOrderPaymentMutation} from "@common/api";
import {useApp} from "@common/app";
import {ArrowDown2Icon} from "@common/icons/ArrowDown2";

export const OrderItemStyled = styled.div<{$active: boolean}>`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    max-width: 825px;
    background: #f4f4f3;
    border-radius: 8px;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
    transition: background 0.5s;
    &:hover {
        background: white;
    }
    ${({$active}) =>
        $active &&
        css`
            background: white;
        `}
`;

export const OrderHead = styled.div`
    display: flex;
    align-items: center;
    gap: 30px;
    width: 100%;
    cursor: pointer;
    padding: 30px;
    @media (max-width: ${({theme}) => theme.mobile.screenMaxWidth}) {
        align-items: flex-end;
        padding: 20px;
    }
`;

export const OrderHeadLeft = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 40px;
    @media (max-width: ${({theme}) => theme.mobile.screenMaxWidth}) {
        align-items: flex-start;
        flex-direction: column;
        gap: 8px;
    }
`;

export const OrderHeadLeftLeft = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    padding-right: 20px;
`;

export const OrderHeadLeftRight = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    @media (max-width: ${({theme}) => theme.mobile.screenMaxWidth}) {
        align-items: flex-start;
        flex-direction: column-reverse;
        gap: 10px;
    }
`;

export const OrderHeadRight = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 70%;
    @media (max-width: ${({theme}) => theme.mobile.screenMaxWidth}) {
        align-items: flex-end;
        flex-direction: column;
        width: auto;
        flex-shrink: 0;
        gap: 10px;
    }
`;

export const OrderBody = styled(motion.div)<{$active: boolean}>`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    padding: 30px;
    padding-top: 0px;
    overflow: hidden;
    ${({$active}) =>
        !$active &&
        css`
            padding-bottom: 0px !important;
        `}
    @media (max-width: ${({theme}) => theme.mobile.screenMaxWidth}) {
        padding: 20px;
        padding-top: 0px;
    }
`;

export const OrderBodyTopDivider = styled.div`
    display: flex;
    width: 100%;
    height: 1px;
    background: ${({theme}) => theme.palette.dividers};
`;

export const OrderNumber = styled(Text)`
    display: inline-flex;
    align-items: center;
    font: 500 16px ${({theme}) => theme.fonts.roboto};
`;

export const OrderArrow = styled(motion(ArrowDown2Icon))`
    margin-left: 5px;
`;

export type OrderStatusColor = "gray" | "red" | "orange" | "green";

export const OrderStatus = styled(Text)<{color?: OrderStatusColor}>`
    display: inline-flex;
    flex-shrink: 0;
    padding: 4px 9px;
    color: white;
    font: normal 11px ${({theme}) => theme.fonts.roboto};
    line-height: 1.5;
    border-radius: 8px;
    background: ${({color}) => {
        switch (color) {
            case "red":
                return "#DE2104";
            case "orange":
                return "#F08929";
            case "green":
                return "#12C040";
            default:
                return "#A7A59E";
        }
    }};
`;

export const OrderDate = styled(Text)`
    font: normal 16px ${({theme}) => theme.fonts.roboto};
`;

export const OrderCount = styled(Text)`
    font: normal 16px ${({theme}) => theme.fonts.roboto};
`;

export const OrderPrice = styled(Text)`
    font: 500 16px ${({theme}) => theme.fonts.roboto};
`;

export const OrderProductList = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
`;

export const OrderProductItem = styled.div`
    display: flex;
    align-items: center;
    gap: 30px;
    width: 100%;
    padding: 20px 0px;
    border-bottom: 1px solid ${({theme}) => theme.palette.dividers};
    @media (max-width: 500px) {
        flex-direction: column;
        gap: 20px;
    }
`;

export const OrderProductLeft = styled.div`
    display: flex;
    flex-shrink: 0;
    width: 100%;
    max-width: 58%;
    @media (max-width: 640px) {
        flex-shrink: 1;
        max-width: 100%;
    }
`;

export const OrderProductRight = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    @media (max-width: 640px) {
        flex-direction: column;
        align-items: flex-end;
        flex-shrink: 0;
        gap: 8px;
        width: auto;
    }
    @media (max-width: 500px) {
        flex-direction: row;
        width: 100%;
    }
`;

export const OrderProductLink = styled(NextLink)`
    display: flex;
    align-items: center;
    text-decoration: none;
`;

export const OrderProductImage = styled.div`
    display: inline-flex;
    width: 80px;
    height: 80px;
`;

export const OrderProductImageNotFound = styled(OrderProductImage)`
    cursor: not-allowed;
    flex-shrink: 0;
`;

export const OrderProductName = styled(Text)`
    font-size: 16px;
    padding: 0px 22px;
`;

export const OrderProductCount = styled(Text)`
    font-size: 16px;
`;

export const OrderProductPrice = styled(Text)`
    font-size: 16px;
`;

export const OrderInfo = styled.div`
    display: flex;
    width: 100%;
    margin-top: 30px;
    @media (max-width: ${({theme}) => theme.mobile.screenMaxWidth}) {
        margin-top: 20px;
    }
`;

export const OrderInfoList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
    width: 100%;
    @media (max-width: ${({theme}) => theme.mobile.screenMaxWidth}) {
        gap: 16px;
    }
`;

export const OrderInfoItem = styled.div`
    display: flex;
    width: 100%;
    @media (max-width: ${({theme}) => theme.mobile.screenMaxWidth}) {
        flex-direction: column;
        row-gap: 4px;
    }
`;

export const OrderInfoName = styled(Text)`
    display: inline-flex;
    width: 100%;
    max-width: 160px;
    font: 500 16px ${({theme}) => theme.fonts.roboto};
    flex-shrink: 0;
`;

export const OrderInfoContent = styled(Text)`
    display: inline-flex;
    font: normal 16px ${({theme}) => theme.fonts.roboto};
`;

export const OrderActions = styled.div`
    display: flex;
    width: 100%;
    margin-top: 30px;
    gap: 20px;
`;

export interface OrderItemProps {
    order: OrderInfoApi;
}

export const OrderItem: React.FC<OrderItemProps> = ({order}) => {
    const {catalogLists} = useApp();
    const api = useApi();
    const toast = useToast();

    const [showedDetails, setShowedDetails] = useState(false);
    const toggleDetails = useCallback(() => {
        setShowedDetails(!showedDetails);
    }, [showedDetails]);

    const status = useMemo<CatalogListDefaultOption | null>(
        () =>
            api.user.utils.getOrderStatus({
                order,
                catalogLists
            }),
        [api, order, catalogLists]
    );
    const statusNode = useMemo<React.ReactNode>(() => {
        if (status === null) {
            return null;
        }

        let statusColor: OrderStatusColor;
        switch (status.code) {
            case "treatment":
            case "pay":
                statusColor = "orange";
                break;
            case "new":
            case "paid-up":
            case "done":
                statusColor = "green";
                break;
            default:
                statusColor = "gray";
                break;
        }

        return <OrderStatus color={statusColor}>{status.name}</OrderStatus>;
    }, [api, catalogLists, order]);
    const dateCreated = useMemo<string>(() => {
        return moment(new Date(order.created * 1000)).format("DD.MM.YYYY");
    }, [order]);
    const countNode = useMemo<React.ReactNode>(() => {
        const {count} = order.items;

        return <OrderCount>Товаров: {count} шт.</OrderCount>;
    }, [order]);
    const priceNode = useMemo<React.ReactNode>(() => {
        const {sum, full_sum} = order.items;

        const price: string = api.catalog.utils.formatPrice(sum);
        const fullPrice: string | null =
            full_sum !== sum ? api.catalog.utils.formatPrice(full_sum) : null;

        return (
            <OrderPrice>
                {fullPrice ? (
                    <>
                        <s>{fullPrice}</s>{" "}
                    </>
                ) : null}
                {price}
            </OrderPrice>
        );
    }, [api, order, status]);
    const fio = useMemo<string | null>(() => api.user.utils.getFio(order.user), [api, order.user]);
    const address = useMemo<string | null>(() => {
        if (order.delivery.address) {
            return order.delivery.address;
        } else {
            return null;
        }
    }, [order.delivery.address]);
    const deliveryType = useMemo<string | null>(() => {
        if (order.delivery.type) {
            return order.delivery.type;
        } else {
            return null;
        }
    }, [order.delivery.type]);
    const text = useMemo<string | null>(() => {
        if (order.text) {
            return order.text;
        } else {
            return null;
        }
    }, [order.text]);
    const infoNode = useMemo<React.ReactNode>(() => {
        const items: React.ReactNode[] = [];

        if (fio !== null) {
            items.push(
                <OrderInfoItem key="fio">
                    <OrderInfoName>Получатель:</OrderInfoName>
                    <OrderInfoContent>{fio}</OrderInfoContent>
                </OrderInfoItem>
            );
        }
        if (deliveryType !== null) {
            items.push(
                <OrderInfoItem key="deliveryType">
                    <OrderInfoName>Способ доставки:</OrderInfoName>
                    <OrderInfoContent>{deliveryType}</OrderInfoContent>
                </OrderInfoItem>
            );
        }
        if (address !== null) {
            items.push(
                <OrderInfoItem key="address">
                    <OrderInfoName>Адрес доставки:</OrderInfoName>
                    <OrderInfoContent>{address}</OrderInfoContent>
                </OrderInfoItem>
            );
        }
        if (text !== null) {
            items.push(
                <OrderInfoItem key="text">
                    <OrderInfoName>Комментарий:</OrderInfoName>
                    <OrderInfoContent>{text}</OrderInfoContent>
                </OrderInfoItem>
            );
        }

        if (items.length === 0) {
            return null;
        }
        return (
            <OrderInfo>
                <OrderInfoList>{items}</OrderInfoList>
            </OrderInfo>
        );
    }, [fio, address, deliveryType, text]);

    const orderPaymentMutation = useOrderPaymentMutation();
    const handlePay = useCallback(() => {
        const orderId: number = order.id;

        orderPaymentMutation.mutateAsync({orderId}).then((result) => {
            switch (result.result) {
                case "error":
                    toast.show({
                        message: result.reason,
                        position: "bottom-center",
                        type: "error"
                    });
                    break;
                case "success":
                    location.href = result.payment.url;
                    break;
            }
        });
    }, [order, orderPaymentMutation, toast]);
    const actionsNode = useMemo<React.ReactNode>(() => {
        const actions: React.ReactNode[] = [];

        if (status !== null && status.code === "pay") {
            actions.push(
                <Button
                    key="pay"
                    variant="secondary"
                    width={120}
                    loading={orderPaymentMutation.isLoading}
                    onClick={handlePay}
                >
                    Оплатить
                </Button>
            );
        }

        if (actions.length === 0) {
            return null;
        }
        return <OrderActions>{actions}</OrderActions>;
    }, [handlePay, status, orderPaymentMutation.isLoading]);

    return (
        <OrderItemStyled $active={showedDetails}>
            <OrderHead onClick={toggleDetails}>
                <OrderHeadLeft>
                    <OrderHeadLeftLeft>
                        <OrderNumber>
                            №{order.id}
                            <OrderArrow
                                width={14}
                                height={9}
                                initial={showedDetails ? "show" : "hide"}
                                animate={showedDetails ? "show" : "hide"}
                                variants={{
                                    show: {
                                        rotate: 180
                                    },
                                    hide: {
                                        rotate: 0
                                    }
                                }}
                            />
                        </OrderNumber>
                    </OrderHeadLeftLeft>
                    <OrderHeadLeftRight>
                        {statusNode}
                        <OrderDate>от {dateCreated}</OrderDate>
                    </OrderHeadLeftRight>
                </OrderHeadLeft>
                <OrderHeadRight>
                    {countNode}
                    {priceNode}
                </OrderHeadRight>
            </OrderHead>
            <OrderBody
                initial={showedDetails ? "show" : "hide"}
                animate={showedDetails ? "show" : "hide"}
                variants={{
                    show: {
                        height: "auto",
                        opacity: 1
                    },
                    hide: {
                        height: "0px",
                        opacity: 0
                    }
                }}
                $active={showedDetails}
            >
                <OrderBodyTopDivider />
                <OrderProductList>
                    {order.items.items.map((item) => (
                        <OrderProductItem key={item.id}>
                            <OrderProductLeft>
                                <OrderProductLink href={item.url}>
                                    {item.image ? (
                                        <OrderProductImage
                                            as={Image}
                                            src={api.url(item.image)}
                                            width={80}
                                            height={80}
                                            alt={item.full_name}
                                            title={item.full_name}
                                        />
                                    ) : (
                                        <OrderProductImageNotFound />
                                    )}
                                    <OrderProductName>{item.full_name}</OrderProductName>
                                </OrderProductLink>
                            </OrderProductLeft>
                            <OrderProductRight>
                                <OrderProductCount>{item.quantity} шт.</OrderProductCount>
                                <OrderProductPrice>
                                    {api.catalog.utils.formatPrice(+item.price)}
                                </OrderProductPrice>
                            </OrderProductRight>
                        </OrderProductItem>
                    ))}
                </OrderProductList>
                {infoNode}
                {actionsNode}
            </OrderBody>
        </OrderItemStyled>
    );
};
