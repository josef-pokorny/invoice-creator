import { EInvoiceType, type IInvoiceProps } from "$lib/pdf/invoice-types";
import { useLocalStorageContext } from "./sharedStore.svelte";

// Define default values
const defaultForm: IInvoiceProps["invoiceData"] = {
    items: [],
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
};

export function useFormStore(initialValue?: typeof defaultForm) {
    return useLocalStorageContext("invoice-form", defaultForm, initialValue);
}
