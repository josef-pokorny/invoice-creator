export interface IInvoiceValues {
    companyName?: string;
    items: IItem[];
    supplierBilling: IBilling;
    billing: IBilling;
    refId: string;
    totalPrice: number | string;
    currency: string;
    invoiceType: EInvoiceType;
    paidAt?: string;
    issuedAt?: string;
    pickedUpAt?: string;
    paymentDueDate?: string;
    paymentType?: string;
    paymentInfo?: string;
    isSupplierSelfEmployed?: boolean;
    customTextUnderSupplier?: string;
    customFooterText?: string;
    countVat?: boolean;
    roundTotal?: boolean;
}

export interface IBilling {
    fullname: string;
    line1: string;
    postal: string;
    city: string;
    country: string;
    ine?: string;
    vat?: string;
}

export interface IInvoiceData extends IInvoiceValues {
    totalPrice: number;
    roundedTotalPrice: number;
    roundedTotalPriceBy: number;
    totalPriceWithoutVat: number;
    totalVat: number;
    items: IInvoiceDataItem[];
}

export interface IInvoiceProps {
    invoiceData: IInvoiceData;
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

export interface IInvoiceDataItem extends IItem {
    total: number;
    vat: number;
    totalWithVat: number;
}

export const DefaultItem: IItem = {
    count: 0,
    measurementUnit: "",
    name: "",
    singlePrice: 0,
    currency: "",
    id: "",
    vatPercentage: 21,
};

export enum EInvoiceType {
    INVOICE_TAX_DOC = "INVOICE_TAX_DOC",
    INVOICE = "INVOICE",
    PRE_INVOICE = "PRE_INVOICE",
}
