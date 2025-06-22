import AxiosClient from "$lib/requests/client";

import type { IGovEkonomickeSubjektyReturn } from "./ares-types";

export async function findAresByINE({ ine }: { ine: string }) {
    const { data } = await AxiosClient<IGovEkonomickeSubjektyReturn>({
        url: `https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${ine}`,
        method: "get",
    });

    return data;
}
