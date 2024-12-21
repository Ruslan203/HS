import React, {useCallback, useMemo, useState} from "react";
import {Formik, FormikHelpers, FormikProps} from "formik";
import {ObjectSchema, object, string} from "yup";
import {Button} from "@common/Button";
import {CircularProgress} from "@common/CircularProgress";
import {Form, FormControls} from "@common/Form";
import {Link} from "@common/Link";
import {Modal, ModalProps} from "@common/Modal";
import {TextField} from "@common/TextField";
import {useToast} from "@common/Toast";
import {useApi} from "@common/api";
import {useAuth} from "@common/auth";

export interface SignInFormValues {
    phone: string;
    password: string;
}

export const SignInModal: React.FC<ModalProps> = (props) => {
    const toast = useToast();
    const api = useApi();
    const {loginUser} = useAuth();

    const validationSchema = useMemo<ObjectSchema<SignInFormValues>>(
        () =>
            object().shape({
                phone: string()
                    .required("Введите номер телефона")
                    .matches(
                        /^\+7 \([0-9]{3}\) [0-9]{3} [0-9]{2} [0-9]{2}$/,
                        "Введите номер телефона"
                    ),
                password: string().required("Введите пароль")
            }),
        []
    );

    const [isSendPasswordLoading, setIsSendPasswordLoading] = useState(false);
    const [isSendPasswordSuccess, setIsSendPasswordSuccess] = useState(false);
    const handleRemind = useCallback(
        async (
            values: SignInFormValues,
            {setFieldError, setFieldTouched}: FormikProps<SignInFormValues>,
            event: React.MouseEvent<HTMLAnchorElement>
        ) => {
            event.preventDefault();

            setFieldTouched("phone");
            if (
                (await validationSchema
                    .validateAt("phone", values, {context: values})
                    .catch((error) => (setFieldError("phone", error.message), false))) === false
            ) {
                return;
            }

            setIsSendPasswordLoading(true);
            const {phone} = values;
            api.auth.sendPassword({phone}).then((result) => {
                switch (result.result) {
                    case "failure":
                        toast.show({
                            message: result.reason,
                            type: "error",
                            position: "bottom-center"
                        });
                        break;
                    case "success":
                        setIsSendPasswordSuccess(true);
                        toast.show({
                            message: "Пароль выслан на номер " + phone,
                            type: "info",
                            position: "bottom-center"
                        });
                        break;
                }
                setIsSendPasswordLoading(false);
            });
        },
        [api, toast, validationSchema]
    );

    const handleSubmit = useCallback(
        (
            {phone, password}: SignInFormValues,
            {setSubmitting, setFieldError}: FormikHelpers<SignInFormValues>
        ) => {
            loginUser({name: phone, password}).then((result) => {
                if (result.result === "error") {
                    setFieldError("password", result.reason);
                } else if (result.result === "success") {
                    props.onClose?.();
                }

                setSubmitting(false);
            });
        },
        [loginUser, props.onClose]
    );

    return (
        <Modal {...props}>
            <Formik<SignInFormValues>
                initialValues={{
                    phone: "",
                    password: ""
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {(formik) => {
                    const {handleSubmit, isSubmitting, values} = formik;

                    return (
                        <Form onSubmit={handleSubmit}>
                            <TextField
                                type="text"
                                name="phone"
                                label="Телефон"
                                placeholder="+7 (___) ___ __ __"
                                mask="+7 (999) 999 99 99"
                                fullWidth
                                formik
                            />
                            <TextField
                                type="password"
                                name="password"
                                label="Пароль"
                                placeholder="*********"
                                autoComplete="on"
                                fullWidth
                                formik
                            />
                            <FormControls>
                                <Button
                                    variant="tertiary"
                                    type="submit"
                                    loading={isSubmitting}
                                    width={172}
                                >
                                    Авторизоваться
                                </Button>
                                {isSendPasswordLoading ? (
                                    <CircularProgress size={18} />
                                ) : !isSendPasswordSuccess ? (
                                    <Link
                                        color="primary"
                                        href="#remind-password"
                                        onClick={handleRemind.bind(null, values, formik)}
                                    >
                                        Напомнить пароль
                                    </Link>
                                ) : null}
                            </FormControls>
                        </Form>
                    );
                }}
            </Formik>
        </Modal>
    );
};
