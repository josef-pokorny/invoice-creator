import * as yup from "yup";

import { m } from "$lib/paraglide/messages";
import { countDecimals } from "$lib/utils";

export function isINEValid(ine?: string): boolean {
    return ine?.length === 8 && Boolean(Number(ine));
}

export const yupInvoiceIneValidation = yup.string().test({
    test: isINEValid,
    message: m["errors.invalid-ine"](),
});

export const yupHasNumberMaxTwoDecimalValidation = yup.mixed().nullable().test({
    message: m["errors.price-must-have-only-two-decimals"](),
    test: hasNumberMaxTwoDecimalValidation,
});

export function hasNumberMaxTwoDecimalValidation(value: any) {
    const number = Number(value);

    if (number || number === 0) {
        return countDecimals(number) <= 2;
    }

    return false;
}
