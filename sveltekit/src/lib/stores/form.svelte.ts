import _ from "lodash";
import { untrack } from "svelte";
import * as yup from "yup";

import { AppStoragePrefix, InvoiceFormKeyPrefix } from "$lib/constants";
import {
    EInvoiceType,
    type IInvoiceValues,
    type IItem,
} from "$lib/pdf/invoice-types";
import type { YupErrorsList } from "$lib/types/types";
import { extractYupErrors } from "$lib/validations/extract-errors.svelte";
import { invoiceFormSchema } from "$lib/validations/schemas/invoice-form.svelte";

import { useLocaleStore } from "./locale.svelte";
import {
    defaultReceiverKey,
    useReceiverKeyStore,
    useReceiverStore,
} from "./receiver.svelte";
import { useLocalStorageStore, useStore } from "./sharedStore.svelte";
import {
    defaultSupplierKey,
    useSupplierKeyStore,
    useSupplierStore,
} from "./supplier.svelte";

export const ImportInvoiceKeyPrefix = AppStoragePrefix + InvoiceFormKeyPrefix;

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
    const store = useStore("invoice-formerrors-", defaultFormErrors);

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
        "invoice-formitemerrors-" + (key || ""),
        defaultFormItemErrors,
        initialValue,
    );
}

const rootCleanUp = $effect.root(() => {
    const locale = useLocaleStore();

    const formKeyStore = useFormKeyStore();
    const formStore = $derived(
        useFormStore({
            get key() {
                return formKeyStore.value.invoiceName;
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
    const supplierEmptyStore = useSupplierStore({
        key: "",
    });

    const receiverKeyStore = useReceiverKeyStore();
    const receiverStore = $derived(
        useReceiverStore({
            get key() {
                return receiverKeyStore.value.receiverName;
            },
        }),
    );
    const receiverEmptyStore = useReceiverStore({
        key: "",
    });

    $effect.pre(() => {
        [formKeyStore.value.invoiceName];

        untrack(() => {
            // this will make sure that nothing will overwrite
            // when changing invoices

            supplierKeyStore.value = defaultSupplierKey;
            receiverKeyStore.value = defaultReceiverKey;

            supplierEmptyStore.value = formStore.value.supplierBilling;
            receiverEmptyStore.value = formStore.value.receiverBilling;
        });
    });

    $effect(() => {
        ({ ...supplierStore.value });

        formStore.value.supplierBilling = supplierStore.value;
    });

    $effect(() => {
        ({ ...receiverStore.value });

        formStore.value.receiverBilling = receiverStore.value;
    });

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
