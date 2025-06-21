import * as yup from "yup";

import { m } from "$lib/paraglide/messages";
import type { IInvoiceValues } from "$lib/pdf/invoice-types";
import type { NestedKeyOf, YupShape } from "$lib/types/types";

import { yupBillingValidation } from "../invoice";

export function invoiceFormSchema() {
    return yup.object().shape<YupShape<Partial<IInvoiceValues>>>({
        issuedAt: yup
            .string()
            .required(m["errors.this-field-is-recommended"]()),
        paymentDueDate: yup
            .string()
            .when(
                ["paymentInfo", "paymentType"] as NestedKeyOf<IInvoiceValues>[],
                (values, schema) => {
                    const [paymentInfo, paymentType]: [
                        IInvoiceValues["paymentInfo"],
                        IInvoiceValues["paymentType"],
                    ] = values as any;

                    if (paymentInfo?.length || paymentType?.length) {
                        return yup
                            .string()
                            .required(m["errors.this-field-is-recommended"]());
                    } else {
                        return schema;
                    }
                },
            ),
        receiverBilling: yupBillingValidation(),
        supplierBilling: yupBillingValidation(),
    });
}
