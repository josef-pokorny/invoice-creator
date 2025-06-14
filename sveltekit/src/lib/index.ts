import { orderBy } from "lodash-es";

import moment from "$lib/moment";

import countries from "./i18n";
import { m } from "./paraglide/messages";
import { getLocale, type Locale } from "./paraglide/runtime";

export function countriesList(locale?: Locale) {
    return [
        ["-", m["labels.choose_country"]],
        ...orderBy(
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
