import _ from "lodash";
import type {
    IInvoiceData,
    IInvoiceProps,
    IInvoiceValues,
} from "./invoice-types";
import { PDFInvoice } from "./Invoice";
import { pdf } from "@react-pdf/renderer";

export function createInvoiceData(invoiceValues: IInvoiceValues): IInvoiceData {
    const items = invoiceValues.items.map((item) => {
        const total = _.round(Number(item.count) * Number(item.singlePrice), 0);
        const vat = _.round((total / 100) * (item.vatPercentage || 0), 0);

        return {
            ...item,
            total,
            vat,
            totalWithVat: total + vat,
        };
    });

    const totalPrice = items.reduce((prev, current) => {
        return (
            prev + current.total + (invoiceValues.countVat ? current.vat : 0)
        );
    }, 0);

    const roundedTotalPrice = invoiceValues.roundTotal
        ? toCents(_.round(fromCents(totalPrice), 0)) || 100
        : totalPrice;
    const roundedTotalPriceBy = roundedTotalPrice - totalPrice;

    const totalPriceWithoutVat = items.reduce((prev, current) => {
        return prev + current.total;
    }, 0);

    const totalVat = items.reduce((prev, current) => {
        return prev + current.vat;
    }, 0);

    return {
        ...invoiceValues,
        items,
        totalPrice,
        roundedTotalPrice,
        roundedTotalPriceBy,
        totalPriceWithoutVat,
        totalVat,
    };
}

export async function renderInvoiceBlob({
    invoiceProps,
}: {
    invoiceProps: IInvoiceProps;
}) {
    const blob = await pdf(PDFInvoice(invoiceProps)).toBlob();

    return blob;
}

export async function renderInvoiceBlobUrl({
    invoiceProps,
    download,
    prefixFileName = "",
}: {
    invoiceProps: IInvoiceProps;
    download?: boolean;
    prefixFileName?: string;
}) {
    const blob = await renderInvoiceBlob({ invoiceProps });
    const url = window.URL.createObjectURL(blob);

    if (download) {
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.href = url;
        a.download = `${prefixFileName}${invoiceProps.invoiceData.refId}.pdf`;
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
        }, 0);
    }

    return url;
}

export function toCents(num: number): number {
    return _.round(num * 100, 0);
}

export function fromCents(num: number): number {
    return _.round(num / 100, 2);
}
