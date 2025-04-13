import type { IBilling } from "$lib";

export interface IInvoiceProps {
    invoiceData: {
        companyName?: string;
        items: {
            count: number;
            measurementUnit: string;
            name: string;
            singlePrice: number;
            currency?: string;
            id?: string;
        }[];
        billing: IBilling;
        refId: string;
        totalPrice: number | string;
        currency: string;
        invoiceType: EInvoiceType;
        paidAt: Date | string;
        issuedAt: Date | string;
    };
}

export enum EInvoiceType {
    INVOICE_TAX_DOC = "INVOICE_TAX_DOC",
    INVOICE = "INVOICE",
    PRE_INVOICE = "PRE_INVOICE",
}
