import moment from "$lib/moment";
import countries from "./i18n";
import { orderBy } from "lodash-es";
import { getLocale, type Locale } from "./paraglide/runtime";
import { m } from "./paraglide/messages";

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
