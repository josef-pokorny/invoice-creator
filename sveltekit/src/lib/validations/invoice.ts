import type { IBilling } from "$lib/pdf/invoice-types";
import { m } from "$lib/paraglide/messages";
import type { YupShape } from "$lib/types/types";
import { yupInvoiceIneValidation } from "./ine";
import * as yup from "yup";

export const yupItsRecommended = yup
    .string()
    .required(m["errors.this-field-is-recommended"]());

export const yupBillingValidation = yup
    .object()
    .shape<YupShape<Partial<IBilling>>>({
        fullname: yupItsRecommended,
        line1: yupItsRecommended,
        city: yupItsRecommended,
        postal: yupItsRecommended,
        ine: yupInvoiceIneValidation,
    }) as any;
