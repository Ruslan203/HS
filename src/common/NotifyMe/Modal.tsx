import React, {useCallback, useMemo} from "react";
import {Formik, FormikHelpers} from "formik";
import {ObjectSchema, object, string} from "yup";
import {Button} from "@common/Button";
import {Form, FormControls} from "@common/Form";
import {Modal, ModalProps} from "@common/Modal";
import {TextField} from "@common/TextField";
import {useToast} from "@common/Toast";
import {SaleOption, useApi} from "@common/api";

export interface NotifyMeFormValues {
    email: string;
    phone: string;
}

export interface NotifyMeModalProps extends ModalProps {
    optionSelected: SaleOption;
}

export const NotifyMeModal: React.FC<NotifyMeModalProps> = ({optionSelected, ...props}) => {
    const api = useApi();
    const toast = useToast();

    const validationSchema = useMemo<ObjectSchema<NotifyMeFormValues>>(
        () =>
            object().shape({
                email: string().required("Введите e-mail").email("Недействительный e-mail"),
                phone: string()
                    .required("Введите номер телефона")
                    .matches(
                        /^\+7 \([0-9]{3}\) [0-9]{3} [0-9]{2} [0-9]{2}$/,
                        "Введите номер телефона"
                    )
            }),
        []
    );

    const handleSubmit = useCallback(
        async (
            {email, phone}: NotifyMeFormValues,
            {setSubmitting}: FormikHelpers<NotifyMeFormValues>
        ) => {
            const {id} = optionSelected;
            await api.notifyMe.addNotify({email, phone, id});
            toast.show({
                type: "info",
                message: "Мы уведомим вас, как только товар появится в наличии",
                position: "bottom-center"
            });
            setSubmitting(false);
            props.onClose?.();
        },
        [optionSelected]
    );

    return (
        <Modal {...props}>
            <Formik<NotifyMeFormValues>
                initialValues={{
                    email: "",
                    phone: ""
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({handleSubmit, isSubmitting}) => (
                    <Form onSubmit={handleSubmit}>
                        <TextField
                            type="text"
                            name="email"
                            label="E-mail"
                            placeholder="example@domain.com"
                            fullWidth
                            formik
                        />
                        <TextField
                            type="text"
                            name="phone"
                            label="Телефон"
                            placeholder="+7 (___) ___ __ __"
                            mask="+7 (999) 999 99 99"
                            fullWidth
                            formik
                        />
                        <FormControls>
                            <Button
                                variant="tertiary"
                                type="submit"
                                loading={isSubmitting}
                                width={133}
                            >
                                Уведомить
                            </Button>
                        </FormControls>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};
