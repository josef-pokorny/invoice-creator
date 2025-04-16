import {
    EInvoiceType,
    type IInvoiceValues,
    type IItem,
} from "$lib/pdf/invoice-types";
import type { YupErrorsList } from "$lib/types/types";
import { useLocalStorageContext, useStoreContext } from "./sharedStore.svelte";

// Define default values
const defaultForm: IInvoiceValues = {
    items: [],
    supplierBilling: {
        fullname: "",
        line1: "",
        postal: "",
        city: "",
        country: "",
        ine: "",
        vat: "",
    },
    billing: {
        fullname: "",
        line1: "",
        postal: "",
        city: "",
        country: "",
        ine: "",
        vat: "",
    },
    refId: "",
    totalPrice: "",
    currency: "",
    invoiceType: EInvoiceType.INVOICE_TAX_DOC,
    paidAt: "",
    companyName: "",
    issuedAt: "",
    paymentDueDate: "",
    pickedUpAt: "",
    paymentType: "",
    paymentInfo: "",
    isSupplierSelfEmployed: true,
    customTextUnderSupplier: "",
    customFooterText: "",
    countVat: false,
    roundTotal: false,
};

export function useFormStore({
    initialValue,
    key,
}: {
    initialValue?: typeof defaultForm;
    key?: string;
} = {}) {
    return useLocalStorageContext(
        "invoice-form" + (key || ""),
        defaultForm,
        initialValue,
    );
}

const defaultFormErrors: YupErrorsList<IInvoiceValues> = {};

export function useFormErrorsStore({
    initialValue,
    key,
}: {
    initialValue?: typeof defaultFormErrors;
    key?: string;
} = {}) {
    return useStoreContext(
        "invoice-form-errors-" + (key || ""),
        defaultFormErrors,
        initialValue,
    );
}

const defaultFormItemErrors: YupErrorsList<IItem> = {};

export function useFormItemErrors({
    initialValue,
    key,
}: {
    initialValue?: typeof defaultFormItemErrors;
    key?: string;
} = {}) {
    return useStoreContext(
        "invoice-form-item-errors-" + (key || ""),
        defaultFormItemErrors,
        initialValue,
    );
}
