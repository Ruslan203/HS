import {useQuery} from "@tanstack/react-query";
import React, {useCallback, useMemo} from "react";
import {useRouter} from "next/router";
import styled from "styled-components";
import {Form, Formik, FormikHelpers} from "formik";
import {ObjectSchema, object, string} from "yup";
import {useBasket} from "@common/Basket";
import {Button} from "@common/Button";
import {FieldOption} from "@common/Field";
import {FieldInfo, FieldInfoBold, FieldInfoList} from "@common/Field/Info";
import {useModalState} from "@common/Modal";
import {SelectField, SelectFieldOption} from "@common/SelectField";
import {Text} from "@common/Text";
import {TextAreaField} from "@common/TextAreaField";
import {TextField} from "@common/TextField";
import {TextSelectField, TextSelectFieldLoadOptions} from "@common/TextSelectField";
import {Title} from "@common/Title";
import {useToast} from "@common/Toast";
import {
    CatalogListDefaultOption,
    CatalogListDeliveryTypesOption,
    SdekPoint,
    useApi
} from "@common/api";
import {useApp} from "@common/app";
import {useAuth} from "@common/auth";
import {SdekPointMapModal} from "./modals/SdekPointMap";

export const OrderMakeFormStyled = styled(Form)`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    width: 100%;
    padding: 25px 30px 30px;
`;

export const DeliveryFree = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

export const DeliveryFreeName = styled(Text)`
    display: inline-flex;
    background: ${({theme}) => theme.palette.darkGray};
    color: ${({theme}) => theme.palette.white};
    padding: 5px 8px;
    border-radius: 8px;
    font: normal 11px ${({theme}) => theme.fonts.roboto};
`;

export const DeliveryFreePrice = styled(Text)`
    display: inline-flex;
    font: normal 11px ${({theme}) => theme.fonts.roboto};
    color: ${({theme}) => theme.palette.darkGray};
    text-decoration-line: line-through;
`;

export const SdekPointAfter = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
`;

export interface OrderMakeFormValues {
    city: FieldOption | null;
    deliveryType: string;
    postalCode: string;
    address: string;
    sdekPoint: FieldOption | null;
    surname: string;
    name: string;
    patronymic: string;
    email: string;
    phone: string;
    paymentMethod: string;
    comment: string;
}

export interface DeliveryType extends CatalogListDeliveryTypesOption {
    conditionsResult: boolean;
}

export const OrderMakeForm: React.FC = () => {
    const router = useRouter();
    const api = useApi();
    const {userInfo} = useAuth();
    const {catalogLists} = useApp();
    const toast = useToast();
    const {basketCountQuery} = useBasket();

    const paymentMethods = useMemo<CatalogListDefaultOption[]>(
        () => Object.values(catalogLists.payment.options),
        [catalogLists]
    );

    const initialValues = useMemo<OrderMakeFormValues>(() => {
        const initialValues: OrderMakeFormValues = {
            city: null,
            deliveryType: "",
            postalCode: "",
            address: "",
            sdekPoint: null,
            surname: "",
            name: "",
            patronymic: "",
            email: "",
            phone: "",
            paymentMethod: String(paymentMethods[0].id),
            comment: ""
        };

        if (userInfo !== false) {
            initialValues.address = userInfo.address;
            initialValues.surname = userInfo.lastname;
            initialValues.name = userInfo.firstname;
            initialValues.patronymic = userInfo.middlename;
            initialValues.phone = api.user.utils.getPhone({info: userInfo});
            initialValues.email = userInfo.email;
        }

        return initialValues;
    }, [api, userInfo]);

    const validationSchema = useMemo<
        ObjectSchema<Record<keyof OrderMakeFormValues, any>> // eslint-disable-line
    >(
        () =>
            object().shape({
                city: object().required("Укажите город"),
                deliveryType: string().required("Выберите способ доставки"),
                postalCode: string().when("deliveryType", ([deliveryType], schema) => {
                    if (deliveryType !== "27634") {
                        return schema;
                    } else {
                        return schema.required("Введите почтовый индекс");
                    }
                }),
                address: string().when("deliveryType", ([deliveryType], schema) => {
                    if (
                        deliveryType !== "27632" &&
                        deliveryType !== "27633" &&
                        deliveryType !== "27634"
                    ) {
                        return schema;
                    } else {
                        return schema.required("Введите адрес");
                    }
                }),
                sdekPoint: object().when("deliveryType", ([deliveryType], schema) => {
                    if (deliveryType === "27631") {
                        return schema.required("Выберите пункт доставки");
                    } else {
                        return schema.nullable();
                    }
                }),
                name: string().when("deliveryType", ([deliveryType], schema) => {
                    if (deliveryType === "") {
                        return schema;
                    } else {
                        return schema.required("Введите имя");
                    }
                }),
                surname: string().when("deliveryType", ([deliveryType], schema) => {
                    if (
                        deliveryType !== "27631" &&
                        deliveryType !== "27632" &&
                        deliveryType !== "27634"
                    ) {
                        return schema;
                    } else {
                        return schema.required("Введите фамилию");
                    }
                }),
                patronymic: string().when("deliveryType", ([deliveryType], schema) => {
                    if (deliveryType !== "27634") {
                        return schema;
                    } else {
                        return schema.required("Введите отчество");
                    }
                }),
                email: string().required("Введите e-mail").email("Недействительный e-mail"),
                phone: string()
                    .required("Введите номер телефона")
                    .matches(
                        /^\+7 \([0-9]{3}\) [0-9]{3}-[0-9]{2}-[0-9]{2}$/,
                        "Введите номер телефона"
                    ),
                paymentMethod: string().required("Выберите метод оплаты"),
                comment: string()
            }),
        []
    );

    const handleSubmit = useCallback(
        (
            values: OrderMakeFormValues,
            {setSubmitting, setFieldError}: FormikHelpers<OrderMakeFormValues>
        ) => {
            const {
                city,
                deliveryType,
                sdekPoint,
                address,
                postalCode,
                surname,
                name,
                patronymic,
                phone,
                email,
                paymentMethod,
                comment
            } = values;
            if (city === null || typeof city.id === "undefined") {
                return setSubmitting(false);
            }

            api.basket
                .placeOrder({
                    cityId: +city.id,
                    deliveryType: +deliveryType,
                    sdekPoint: sdekPoint?.value.toString(),
                    address,
                    postCode: postalCode,
                    lastName: surname,
                    firstName: name,
                    middleName: patronymic,
                    phone,
                    email,
                    payment: +paymentMethod,
                    text: comment
                })
                .then((result) => {
                    if (result.result === "failure") {
                        switch (result.reason) {
                            case "basket_empty":
                                toast.show({
                                    message: "Корзина пуста",
                                    type: "error",
                                    position: "bottom-center"
                                });
                                break;
                            case "phone":
                                setFieldError("phone", "Некорректный номер телефона");
                                break;
                        }
                    } else if (result.result === "success") {
                        const {id, payment = null} = result;

                        if (payment === null) {
                            const params = new URLSearchParams();
                            params.set("id", id);
                            router.push("/basket/success?" + params);
                            toast.show({
                                message: "Ваш заказ успешно оформлен",
                                type: "success",
                                position: "bottom-center"
                            });
                            toast.show({
                                message: "На ваш e-mail отправлена подробная информация о заказе",
                                type: "info",
                                position: "bottom-center"
                            });
                            basketCountQuery.refetch();
                        } else {
                            location.href = payment.url;
                        }
                    }

                    setSubmitting(false);
                });
        },
        [api, basketCountQuery]
    );

    return (
        <Formik<OrderMakeFormValues>
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({isSubmitting, values, setFieldValue}) => {
                const {city, deliveryType} = values;
                const api = useApi();

                const loadCitiesOptions = useCallback<TextSelectFieldLoadOptions>(
                    async (query) => {
                        if (query === "") {
                            return [];
                        }

                        await new Promise((resolve) => setTimeout(resolve, 1000));

                        return (await api.sdek.getCities({str: query})).items.map(({id, name}) => ({
                            id,
                            value: id,
                            label: name
                        }));
                    },
                    [api]
                );

                const deliveryTypes = useMemo<DeliveryType[]>(
                    () =>
                        Object.values(catalogLists["delivery_types"].options).map((option) => {
                            let conditionsResult = true;

                            for (const condition of option.conditions.split(";")) {
                                const conditionRegexp = /^([a-z0-9_]+)(=|!=)([a-z0-9_]+)$/g;
                                const variableName: string = condition.replace(
                                    conditionRegexp,
                                    "$1"
                                );
                                const sign: string = condition.replace(conditionRegexp, "$2");
                                const value: string = condition.replace(conditionRegexp, "$3");

                                let variableValue: any = undefined; // eslint-disable-line
                                switch (variableName) {
                                    case "city_id":
                                        variableValue = city?.id ?? 0;
                                        break;
                                }
                                if (typeof variableValue === "undefined") {
                                    continue;
                                }

                                let result: boolean;
                                switch (sign) {
                                    case "=":
                                        result = variableValue == value;
                                        break;
                                    case "!=":
                                        result = variableValue != value;
                                        break;
                                    default:
                                        result = true;
                                        break;
                                }

                                conditionsResult &&= result;
                            }

                            return {conditionsResult, ...option};
                        }),
                    [catalogLists, city]
                );

                const sdekPointsQuery = useQuery(
                    ["sdek/points", city],
                    () => api.sdek.getPoints({cityId: Number(city?.id ?? 0)}),
                    {enabled: city !== null && deliveryType === "27631"}
                );
                const deliveryPriceQuery = useQuery(
                    ["basket/getDeliveryPrice", city, deliveryType],
                    () =>
                        api.basket.getDeliveryPrice({
                            cityId: Number(city?.id ?? 0),
                            deliveryType
                        }),
                    {enabled: city !== null && deliveryType !== ""}
                );

                const sdekPointCode: string | null = values.sdekPoint?.value.toString() ?? null;
                const sdekPoint = useMemo<SdekPoint | null>(() => {
                    if (sdekPointsQuery.isSuccess && typeof sdekPointsQuery.data === "object") {
                        return (
                            sdekPointsQuery.data.points.find(({code}) => code === sdekPointCode) ??
                            null
                        );
                    } else {
                        return null;
                    }
                }, [sdekPointsQuery, sdekPointCode]);
                const loadSdekPointsOptions = useCallback<TextSelectFieldLoadOptions>(
                    async (query) => {
                        if (sdekPointsQuery.isSuccess) {
                            return sdekPointsQuery.data.points
                                .filter((point) =>
                                    point.name.toLowerCase().includes(query.toLowerCase())
                                )
                                .map((point) => ({
                                    id: point.code,
                                    value: point.code,
                                    label: point.name
                                }));
                        } else {
                            return [];
                        }
                    },
                    [sdekPointsQuery.data]
                );

                const [sdekPointMapModalOpened, openSdekPointMapModal, closeSdekPointMapModal] =
                    useModalState();
                const handleSdekPointMapSelect = useCallback((event: React.MouseEvent) => {
                    event.preventDefault();
                    openSdekPointMapModal();
                }, []);
                const handleSdekPointMapChoose = useCallback(
                    (pointCode: string) => {
                        let point: SdekPoint | null;
                        if (sdekPointsQuery.isSuccess) {
                            point =
                                sdekPointsQuery.data.points.find(({code}) => code === pointCode) ??
                                null;
                        } else {
                            point = null;
                        }
                        if (point !== null) {
                            const pointFieldValue: FieldOption = {
                                id: point.code,
                                value: point.code,
                                label: point.name
                            };

                            setFieldValue("sdekPoint", pointFieldValue);
                        }

                        closeSdekPointMapModal();
                    },
                    [sdekPointsQuery, setFieldValue]
                );

                return (
                    <>
                        <OrderMakeFormStyled>
                            <Title component="h3" variant="h5">
                                Оформление заказа
                            </Title>
                            <TextSelectField
                                label="Город"
                                name="city"
                                fullWidth
                                loadOptions={loadCitiesOptions}
                                formik
                            />
                            <SelectField
                                label="Способ доставки"
                                name="deliveryType"
                                fullWidth
                                hidden={city === null}
                                formik
                            >
                                <SelectFieldOption value="" disabled>
                                    Выберите способ доставки
                                </SelectFieldOption>
                                {deliveryTypes.map((type) => {
                                    if (type.conditionsResult) {
                                        return (
                                            <SelectFieldOption key={type.id} value={type.id}>
                                                {type.name}
                                            </SelectFieldOption>
                                        );
                                    } else {
                                        return null;
                                    }
                                })}
                            </SelectField>
                            <TextField
                                type="text"
                                name="postalCode"
                                label="Почтовый индекс"
                                placeholder="Например: 141503"
                                fullWidth
                                hidden={deliveryType !== "27634"}
                                formik
                            />
                            <TextField
                                type="text"
                                name="address"
                                label="Улица, дом"
                                placeholder="Например: ул. Лесная, 1А"
                                fullWidth
                                hidden={
                                    deliveryType !== "27632" &&
                                    deliveryType !== "27633" &&
                                    deliveryType !== "27634"
                                }
                                formik
                                after={
                                    deliveryPriceQuery.isSuccess &&
                                    deliveryPriceQuery.data.result === "success" ? (
                                        <DeliveryFree>
                                            <DeliveryFreeName>Бесплатно</DeliveryFreeName>
                                            <DeliveryFreePrice>
                                                {api.catalog.utils.formatPrice(
                                                    deliveryPriceQuery.data.price
                                                )}
                                            </DeliveryFreePrice>
                                        </DeliveryFree>
                                    ) : null
                                }
                            />
                            <TextSelectField
                                label="Пункт самовывоза СДЭК"
                                name="sdekPoint"
                                fullWidth
                                loadOptions={loadSdekPointsOptions}
                                hidden={deliveryType !== "27631" || !sdekPointsQuery.isSuccess}
                                formik
                                before={
                                    sdekPoint ? (
                                        <FieldInfoList>
                                            <FieldInfo>
                                                Адрес:{" "}
                                                <FieldInfoBold>
                                                    {sdekPoint.address_full}
                                                </FieldInfoBold>
                                            </FieldInfo>
                                            <FieldInfo>
                                                Время работы:{" "}
                                                <FieldInfoBold>{sdekPoint.worktime}</FieldInfoBold>
                                            </FieldInfo>
                                        </FieldInfoList>
                                    ) : null
                                }
                                after={
                                    <SdekPointAfter>
                                        <Button variant="text-2" onClick={handleSdekPointMapSelect}>
                                            Выбрать на карте
                                        </Button>
                                        {deliveryPriceQuery.isSuccess &&
                                        deliveryPriceQuery.data.result === "success" ? (
                                            <DeliveryFree>
                                                <DeliveryFreeName>Бесплатно</DeliveryFreeName>
                                                <DeliveryFreePrice>
                                                    {api.catalog.utils.formatPrice(
                                                        deliveryPriceQuery.data.price
                                                    )}
                                                </DeliveryFreePrice>
                                            </DeliveryFree>
                                        ) : null}
                                    </SdekPointAfter>
                                }
                            />
                            <TextField
                                type="text"
                                name="surname"
                                label="Фамилия"
                                fullWidth
                                hidden={
                                    deliveryType !== "27631" &&
                                    deliveryType !== "27632" &&
                                    deliveryType !== "27634"
                                }
                                formik
                            />
                            <TextField
                                type="text"
                                name="name"
                                label="Имя"
                                fullWidth
                                hidden={deliveryType === ""}
                                formik
                            />
                            <TextField
                                type="text"
                                name="patronymic"
                                label="Отчество"
                                fullWidth
                                hidden={deliveryType !== "27634"}
                                formik
                            />
                            <TextField
                                type="text"
                                name="phone"
                                label="Телефон"
                                placeholder="+7 (___) ___-__-__"
                                mask="+7 (999) 999-99-99"
                                fullWidth
                                hidden={city === null}
                                formik
                            />
                            <TextField
                                type="text"
                                name="email"
                                label="E-mail"
                                placeholder="example@domain.com"
                                fullWidth
                                hidden={city === null}
                                formik
                            />
                            <SelectField label="Метод оплаты" name="paymentMethod" fullWidth formik>
                                {paymentMethods.map((method) => (
                                    <SelectFieldOption key={method.id} value={method.id}>
                                        {method.name}
                                    </SelectFieldOption>
                                ))}
                            </SelectField>
                            <TextAreaField label="Комментарий" name="comment" fullWidth formik />
                            <Button
                                type="submit"
                                variant="secondary"
                                fullWidth
                                loading={isSubmitting}
                            >
                                Оформить заказ
                            </Button>
                            <Text>
                                Ваш заказ будет передан официальному представителю производителя.
                            </Text>
                        </OrderMakeFormStyled>
                        <SdekPointMapModal
                            open={sdekPointMapModalOpened}
                            city={city?.label}
                            onClose={closeSdekPointMapModal}
                            onChoose={handleSdekPointMapChoose}
                        />
                    </>
                );
            }}
        </Formik>
    );
};
