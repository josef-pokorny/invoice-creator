import * as yup from "yup";

import { m } from "$lib/paraglide/messages";
import type { IBilling } from "$lib/pdf/invoice-types";
import type { YupShape } from "$lib/types/types";

import { yupInvoiceIneValidation } from "./ine";

export function yupItsRecommended() {
    return yup.string().required(m["errors.this-field-is-recommended"]());
}

export function yupBillingValidation() {
    return yup.object().shape<YupShape<Partial<IBilling>>>({
        fullname: yupItsRecommended(),
        line1: yupItsRecommended(),
        city: yupItsRecommended(),
        postal: yupItsRecommended(),
        ine: yupInvoiceIneValidation,
    }) as any;
}
