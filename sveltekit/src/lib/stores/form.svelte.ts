import { untrack } from "svelte";
import * as yup from "yup";

import {
    EInvoiceType,
    type IInvoiceValues,
    type IItem,
} from "$lib/pdf/invoice-types";
import type { YupErrorsList } from "$lib/types/types";
import { extractYupErrors } from "$lib/validations/extract-errors.svelte";
import { invoiceFormSchema } from "$lib/validations/schemas/invoice-form.svelte";

import { useLocaleStore } from "./locale.svelte";
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
    reverseCharge: false,
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
    const store = useLocalStorageStore({
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
    const store = useLocalStorageStore({
        key: "invoice-formkey",
        defaultValue: defaultFormKey,
        initialValue: initialValue,
    });

    return store;
}

const defaultFormErrors: YupErrorsList<IInvoiceValues> = {};

export function useFormErrorsStore() {
    const store = useStore("invoice-form-errors-", defaultFormErrors);

    const locale = useLocaleStore();

    const invoiceValuesKey = useFormKeyStore();
    const invoiceValues = $derived(
        useFormStore({
            get key() {
                return invoiceValuesKey.value.profileName;
            },
        }),
    );

    $effect(() => {
        locale.locale;

        invoiceFormSchema()
            .validate(invoiceValues.value, { abortEarly: false })
            .then(() => {
                store.reset();
            })
            .catch((e: yup.ValidationError) => {
                store.reset();

                untrack(() => {
                    extractYupErrors(e, store.value);
                });
            });
    });

    return store;
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
