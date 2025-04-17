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

