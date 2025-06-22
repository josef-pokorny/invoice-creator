import type { IInvoiceValues } from "$lib/pdf/invoice-types";

export interface IExport {
    invoices: [string, IInvoiceValues][];
}
