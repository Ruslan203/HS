import React, {useCallback, useMemo} from "react";
import {useRouter} from "next/router";
import {Formik, FormikHelpers} from "formik";
import {ObjectSchema, object, string} from "yup";
import {Button} from "@common/Button";
import {Form, FormControls} from "@common/Form";
import {Modal, ModalProps} from "@common/Modal";
import {TextField} from "@common/TextField";
import {useToast} from "@common/Toast";
import {OrderInfo, useOrderRefundMutation} from "@common/api";

export interface OrderRefundFormValues {
    amount: string;
}

export interface OrderRefundModalProps extends ModalProps {
    order: OrderInfo;
}

export const OrderRefundModal: React.FC<OrderRefundModalProps> = ({order, ...props}) => {
    const router = useRouter();
    const toast = useToast();

    const validationSchema = useMemo<ObjectSchema<OrderRefundFormValues>>(
        () =>
            object().shape({
                amount: string().required("Введите сумму")
            }),
        []
    );

    const orderRefundMutation = useOrderRefundMutation();
    const handleSubmit = useCallback(
        (values: OrderRefundFormValues, {setSubmitting}: FormikHelpers<OrderRefundFormValues>) => {
            const {id: orderId} = order;
            const {amount} = values;

            orderRefundMutation.mutateAsync({orderId, amount}).then((result) => {
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
                            message: "Возврат выполнен",
                            position: "bottom-center"
                        });
                        props.onClose?.();
                        router.push(router.asPath);
                        break;
                }

                setSubmitting(false);
            });
        },
        [order.id, orderRefundMutation, toast, router, props.onClose]
    );

    return (
        <Modal {...props}>
            <Formik<OrderRefundFormValues>
                initialValues={{
                    amount: order.sum
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({handleSubmit, isSubmitting}) => (
                    <Form onSubmit={handleSubmit}>
                        <TextField
                            type="number"
                            name="amount"
                            label="Сумма"
                            placeholder="Сумма в рублях"
                            fullWidth
                            formik
                        />
                        <FormControls>
                            <Button
                                type="submit"
                                variant="tertiary"
                                loading={isSubmitting}
                                fullWidth
                            >
                                Сделать возврат
                            </Button>
                        </FormControls>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};
