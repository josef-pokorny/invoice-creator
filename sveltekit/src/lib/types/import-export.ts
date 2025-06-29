import type {
    IInvoiceValues,
    IReceiverBilling,
    ISupplierBilling,
} from "$lib/pdf/invoice-types";

export interface IExport {
    invoices: [string, IInvoiceValues][];
    suppliers: [string, ISupplierBilling][];
    receivers: [string, IReceiverBilling][];
}
