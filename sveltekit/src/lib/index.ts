import { PDFInvoice } from "$lib/pdf/Invoice";
import { type IInvoiceProps } from "$lib/pdf/invoice-types";
import moment from "$lib/moment";
import { pdf } from "@react-pdf/renderer";
import countries from "./i18n";
import _ from "lodash";
import { getLocale, type Locale } from "./paraglide/runtime";
import { m } from "./paraglide/messages";

export function countriesList(locale?: Locale) {
    return [
        ["-", m["labels.choose_country"]],
        ..._.orderBy(
            moment.tz
                .countries()
                .map((n) => [
                    n,
                    countries.getName(n, locale || getLocale()) || n,
                ]),
            (n) => n[1].toLowerCase().normalize("NFD"),
        ),
    ];
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

export interface IPayment {
    isPaid: boolean;
    totalPrice: number;
    currency: string;
    paidAt: Date;
    billing: IBilling;
    updatedAt: Date;
    createdAt: Date;
    refId: number;
    transId: string;
    payUrl: string;
    fee: number;
}

export function createRefIdForInvoice(refId: number | string): string {
    return ("0000000000" + refId).slice(-10);
}

export async function renderInvoice({
    invoiceProps,
    download,
}: {
    invoiceProps: IInvoiceProps;
    download?: boolean;
}) {
    const blob = await pdf(PDFInvoice(invoiceProps)).toBlob();
    const url = window.URL.createObjectURL(blob);

    if (download) {
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.href = url;
        a.download = `${invoiceProps.invoiceData.companyName} - ${m["labels.invoice"]()} ${createRefIdForInvoice(invoiceProps.invoiceData.refId)}.pdf`;
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
        }, 0);
    }

    return url;
}

export function toCents(num: number): number {
    return Math.round(num * 100);
}

export function fromCents(num: number): number {
    return num / 100;
}
