import type { IBilling } from "$lib";

export interface IInvoiceProps {
    invoiceData: {
        companyName?: string;
        items: IItem[];
        supplierBilling: IBilling;
        billing: IBilling;
        refId: string;
        totalPrice: number | string;
        currency: string;
        invoiceType: EInvoiceType;
        paidAt?: Date | string;
        issuedAt?: Date | string;
        pickedUpAt?: Date | string;
        paymentDueDate?: Date | string;
        paymentType?: string;
        paymentInfo?: string;
        isSupplierSelfEmployed?: boolean;
        customTextUnderSupplier?: string;
        customFooterText?: string;
        countVat?: boolean;
        roundTotal?: boolean;
    };
}

export interface IItem {
    count: number;
    measurementUnit: string;
    name: string;
    singlePrice: number;
    currency?: string;
    id?: string;
    vatPercentage?: number;
}

export const DefaultItem: IItem = {
    count: 0,
    measurementUnit: "",
    name: "",
    singlePrice: 0,
    currency: "",
    id: "",
    vatPercentage: 0,
};

export enum EInvoiceType {
    INVOICE_TAX_DOC = "INVOICE_TAX_DOC",
    INVOICE = "INVOICE",
    PRE_INVOICE = "PRE_INVOICE",
}
