import _ from "lodash";
import { untrack } from "svelte";
import * as yup from "yup";

import { InvoiceFormKeyPrefix } from "$lib/constants";
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
import { useSupplierKeyStore, useSupplierStore } from "./supplier.svelte";

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
        isSelfEmployed: true,
    },
    receiverBilling: {
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
    customTextUnderSupplier: "",
    customFooterText: "",
    countVat: false,
    roundTotal: false,
    reverseCharge: false,
};

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

export const defaultFormKey = { invoiceName: "default" };

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

const rootCleanUp = $effect.root(() => {
    const formKey = useFormKeyStore();
    const formStore = $derived(
        useFormStore({
            get key() {
                return formKey.value.invoiceName;
            },
        }),
    );
    const formErrorsStore = useFormErrorsStore();

    const supplierKeyStore = useSupplierKeyStore();
    const supplierStore = $derived(
        useSupplierStore({
            get key() {
                return supplierKeyStore.value.supplierName;
            },
        }),
    );

    $effect(() => {
        ({ ...supplierStore.value, ...formStore.value.supplierBilling });

        if (!_.isEmpty(supplierStore.key)) {
            formStore.value.supplierBilling = supplierStore.value;
        } else {
            supplierStore.value = formStore.value.supplierBilling;
        }
    });

    const locale = useLocaleStore();

    $effect(() => {
        locale.locale;

        invoiceFormSchema()
            .validate(formStore.value, { abortEarly: false })
            .then(() => {
                formErrorsStore.reset();
            })
            .catch((e: yup.ValidationError) => {
                formErrorsStore.reset();

                untrack(() => {
                    extractYupErrors(e, formErrorsStore.value);
                });
            });
    });

    return () => {
        rootCleanUp();
    };
});
