import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useRouter} from "next/router";
import styled from "styled-components";
import {useBasket} from "@common/Basket";
import {Button} from "@common/Button";
import {Page} from "@common/Page";
import {Section} from "@common/Section";
import {Text} from "@common/Text";
import {Title} from "@common/Title";
import {useToast} from "@common/Toast";
import {
    CatalogListDefaultOption,
    GetOrderSuccessResult,
    useApi,
    useCancelOrderMutation,
    useCloseOrderReceiptMutation,
    useExpectOrderPaymentMutation
} from "@common/api";
import {useApp} from "@common/app";
import {useAuth} from "@common/auth";
import {OrderRefundModal} from "./RefundModal";

export const OrderSuccessSection = styled(Section)`
    padding-top: 40px;
    padding-bottom: 40px;
`;

export const OrderSuccessTitle = styled(Title)`
    font-size: 32px;
`;

export const OrderSuccessInfo = styled.div`
    display: flex;
`;

export const OrderSuccessInfoList = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 30px;
`;

export const OrderSuccessInfoItem = styled(Text)`
    display: flex;
    font-size: 16px;
    line-height: 1.5;
`;

export const OrderSuccessAdminActions = styled.div`
    display: flex;
    gap: 14px;
    margin-top: 40px;
`;

export interface OrderSuccessPageProps {
    orderSuccess: GetOrderSuccessResult;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({orderSuccess}) => {
    const router = useRouter();
    const {catalogLists} = useApp();
    const api = useApi();
    const {userInfo} = useAuth();
    const {basketContentsQuery} = useBasket();
    const toast = useToast();

    const {order} = orderSuccess;
    if (order === false) {
        return null;
    }

    const fio = useMemo<string | null>(() => api.user.utils.getFio(order.user), [api, order.user]);
    const deliveryType = useMemo<string | null>(() => {
        if (order.delivery.type) {
            return order.delivery.type;
        } else {
            return null;
        }
    }, [order.delivery.type]);
    const address = useMemo<string | null>(() => {
        if (order.delivery.address) {
            return order.delivery.address;
        } else {
            return null;
        }
    }, [order.delivery.address]);
    const phone = useMemo<string | null>(() => {
        if (order.user.phone) {
            return order.user.phone;
        } else {
            return null;
        }
    }, [order.user.phone]);
    const email = useMemo<string | null>(() => {
        if (order.user.email) {
            return order.user.email;
        } else {
            return null;
        }
    }, [order.user.email]);
    const totalPrice = useMemo<string>(
        () => api.catalog.utils.formatPrice(order.items.sum),
        [api, order.items.sum]
    );
    const status = useMemo<CatalogListDefaultOption | null>(
        () =>
            api.user.utils.getOrderStatus({
                order,
                catalogLists
            }),
        [api, order, catalogLists]
    );

    const closeOrderReceiptMutation = useCloseOrderReceiptMutation();
    const handleCloseReceipt = useCallback(() => {
        const orderId: number = order.id;

        closeOrderReceiptMutation.mutateAsync({orderId}).then((result) => {
            switch (result.result) {
                case "error":
                    toast.show({
                        message: result.reason,
                        position: "bottom-center",
                        type: "error"
                    });
                    break;
                case "success":
                    toast.show({
                        message: "Чек пробит",
                        position: "bottom-center",
                        type: "success"
                    });
                    router.replace(router.asPath);
                    break;
            }
        });
    }, [order.id, closeOrderReceiptMutation, toast, router]);

    const expectOrderPaymentMutation = useExpectOrderPaymentMutation();
    const handleExpectPayment = useCallback(() => {
        const orderId: number = order.id;

        expectOrderPaymentMutation.mutateAsync({orderId}).then((result) => {
            switch (result.result) {
                case "error":
                    toast.show({
                        message: result.reason,
                        position: "bottom-center",
                        type: "error"
                    });
                    break;
                case "success":
                    toast.show({
                        message: "От клиента теперь ожидается оплата",
                        position: "bottom-center",
                        type: "success"
                    });
                    router.replace(router.asPath);
                    break;
            }
        });
    }, [order.id, expectOrderPaymentMutation, toast, router]);

    const [refundModalOpened, setRefundModalOpened] = useState(false);

    const cancelOrderMutation = useCancelOrderMutation();
    const handleCancel = useCallback(() => {
        const orderId: number = order.id;

        cancelOrderMutation.mutateAsync({orderId}).then((result) => {
            switch (result.result) {
                case "error":
                    toast.show({
                        message: result.reason,
                        position: "bottom-center",
                        type: "error"
                    });
                    break;
                case "success":
                    toast.show({
                        message: "Заказ отменен",
                        position: "bottom-center",
                        type: "success"
                    });
                    router.replace(router.asPath);
                    break;
            }
        });
    }, [order.id, cancelOrderMutation, toast, router]);

    const adminActions = useMemo(() => {
        if (userInfo === false || !userInfo.isAdmin || status === null) {
            return null;
        }

        const actions: React.ReactNode[] = [];

        switch (order.paymentStatus) {
            case null:
            case "new":
                if (status.code === "pay") {
                    actions.push(
                        <Button key="close-receipt-action" variant="outlined" disabled>
                            Ожидается оплата
                        </Button>
                    );
                } else {
                    actions.push(
                        <Button
                            key="close-receipt-action"
                            width={173}
                            loading={expectOrderPaymentMutation.isLoading}
                            onClick={handleExpectPayment}
                        >
                            Ожидать оплату
                        </Button>
                    );
                }
                break;
            case "pre_paid":
                actions.push(
                    <Button
                        key="close-receipt-action"
                        width={143}
                        loading={closeOrderReceiptMutation.isLoading}
                        onClick={handleCloseReceipt}
                    >
                        Пробить чек
                    </Button>
                );
                break;
            case "paid":
                actions.push(
                    <Button key="close-receipt-action" variant="outlined" disabled>
                        Чек пробит
                    </Button>
                );
                break;
        }
        if (
            order.paymentStatus === null ||
            order.paymentStatus === "new" ||
            order.paymentStatus === "pre_paid" ||
            order.paymentStatus === "paid"
        ) {
            actions.push(
                <Button key="refund-action" onClick={setRefundModalOpened.bind(null, true)}>
                    Сделать возврат
                </Button>
            );
            actions.push(
                <OrderRefundModal
                    key="refund-modal"
                    open={refundModalOpened}
                    order={order}
                    onClose={setRefundModalOpened.bind(null, false)}
                />
            );
        }
        if (order.status_id !== "26612") {
            actions.push(
                <Button
                    key="cancel-action"
                    width={170}
                    variant="secondary"
                    loading={cancelOrderMutation.isLoading}
                    onClick={handleCancel}
                >
                    Отменить заказ
                </Button>
            );
        } else {
            actions.push(
                <Button key="cancel-action" variant="outlined" disabled>
                    Заказ отменен
                </Button>
            );
        }

        if (actions.length === 0) {
            return null;
        } else {
            return <OrderSuccessAdminActions>{actions}</OrderSuccessAdminActions>;
        }
    }, [
        userInfo,
        order,
        closeOrderReceiptMutation.isLoading,
        expectOrderPaymentMutation.isLoading,
        cancelOrderMutation.isLoading,
        status,
        handleCloseReceipt,
        handleExpectPayment
    ]);

    useEffect(() => {
        basketContentsQuery.refetch();
    }, []);

    return (
        <Page title="Успешный заказ">
            <OrderSuccessSection fullHeight>
                <OrderSuccessTitle>
                    {order.isPaid
                        ? `Ваш заказ №${order.id} успешно оплачен`
                        : `Ваш заказ №${order.id} успешно оформлен`}
                </OrderSuccessTitle>
                <OrderSuccessInfo>
                    <OrderSuccessInfoList>
                        {fio ? <OrderSuccessInfoItem>ФИО: {fio}</OrderSuccessInfoItem> : null}
                        {deliveryType !== null ? (
                            <OrderSuccessInfoItem>
                                Способ доставки: {deliveryType}
                            </OrderSuccessInfoItem>
                        ) : null}
                        {address !== null ? (
                            <OrderSuccessInfoItem>Адрес доставки: {address}</OrderSuccessInfoItem>
                        ) : null}
                        {phone !== null ? (
                            <OrderSuccessInfoItem>Телефон: {phone}</OrderSuccessInfoItem>
                        ) : null}
                        {email !== null ? (
                            <OrderSuccessInfoItem>E-mail: {email}</OrderSuccessInfoItem>
                        ) : null}
                        <OrderSuccessInfoItem>Сумма: {totalPrice}</OrderSuccessInfoItem>
                    </OrderSuccessInfoList>
                </OrderSuccessInfo>
                {adminActions}
            </OrderSuccessSection>
        </Page>
    );
};
