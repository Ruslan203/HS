import parsePhoneNumber, {PhoneNumber} from "libphonenumber-js";
import {CatalogListDefaultOption} from "../catalog/types";
import {
    GetFioOptions,
    GetOrderStatusOptions,
    GetPhoneOptions,
    GetUserFullNameOptions
} from "./types";

export class UserApiUtils {
    public getFio({lastname, firstname, middlename}: GetFioOptions): string | null {
        const parts: string[] = [];

        if (lastname) {
            parts.push(lastname);
        }
        if (firstname) {
            parts.push(firstname);
        }
        if (middlename) {
            parts.push(middlename);
        }

        return parts.length !== 0 ? parts.join(" ") : null;
    }

    public getFullName({info}: GetUserFullNameOptions): string {
        const fio: string | null = this.getFio(info);

        if (fio !== null) {
            return fio;
        } else if (info.email) {
            return info.email;
        } else {
            return "@" + info.name;
        }
    }

    public getPhone({info}: GetPhoneOptions): string {
        if (info.name) {
            const phoneNumber: PhoneNumber | null =
                parsePhoneNumber("+" + info.name, {
                    defaultCountry: "RU"
                }) ?? null;

            if (phoneNumber !== null) {
                return phoneNumber.format("NATIONAL").replace(/8(.*)/g, "+7$1");
            } else {
                return "";
            }
        } else {
            return "";
        }
    }

    public getOrderStatus({
        order,
        catalogLists
    }: GetOrderStatusOptions): CatalogListDefaultOption | null {
        return catalogLists.order.options[order.status_id] ?? null;
    }
}
