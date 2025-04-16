import type { AxiosError, AxiosResponse } from "axios";
import type { IGovEkonomickeSubjektyReturn, IGovError } from "./ares-types";
import axios from "axios";

export async function findAresByINE({ ine }: { ine: string }) {
    try {
        const { data } = await axios<IGovEkonomickeSubjektyReturn>({
            url: `https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${ine}`,
            method: "get",
        });

        return data;
    } catch (err) {
        let e = err as AxiosError<IGovError>;

        if (
            e.response?.data.subKod === "VYSTUP_SUBJEKT_NENALEZEN" ||
            e.response?.data.kod === "CHYBA_VSTUPU"
        ) {
            console.error("Ares error: ", e);
        }

        throw e;
    }
}
