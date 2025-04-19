import {
    EInvoiceType,
    type IInvoiceValues,
    type IItem,
} from "$lib/pdf/invoice-types";
import type { YupErrorsList } from "$lib/types/types";
import { useLocalStorageStore, useStore } from "./sharedStore.svelte";

// Define default values
export const defaultForm: IInvoiceValues = {
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
export const defaultFormKey = { profileName: "default" };

export const InvoiceFormKeyPrefix = "invoice-form-";

export function useFormStore({
    initialValue,
    key = "",
}: {
    initialValue?: typeof defaultForm;
    key?: string;
} = {}) {
    $inspect("useFormStore: ", { key });

    let store = useLocalStorageStore({
        key: InvoiceFormKeyPrefix + key,
        defaultValue: defaultForm,
        initialValue,
    });

    return store;
}

export function useFormKeyStore({
    initialValue,
}: {
    initialValue?: typeof defaultFormKey;
} = {}) {
    let store = useLocalStorageStore({
        key: "invoice-formkey",
        defaultValue: defaultFormKey,
        initialValue: initialValue,
    });

    return store;
}

const defaultFormErrors: YupErrorsList<IInvoiceValues> = {};

export function useFormErrorsStore({
    initialValue,
    key,
}: {
    initialValue?: typeof defaultFormErrors;
    key?: string;
} = {}) {
    return useStore(
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
    return useStore(
        "invoice-form-item-errors-" + (key || ""),
        defaultFormItemErrors,
        initialValue,
    );
}
