<script lang="ts">
    import { isAxiosError } from "axios";

    import { addToast } from "$lib/components/Toaster.svelte";
    import { m } from "$lib/paraglide/messages";
    import type { IBilling } from "$lib/pdf/invoice-types";
    import { findAresByINE } from "$lib/requests/ares/ares-ine";
    import type { IGovEkonomickeSubjektyReturn } from "$lib/requests/ares/ares-types";
    import { isINEValid } from "$lib/validations/ine";

    let {
        aresINEData = $bindable(),
        billing = $bindable(),
        ine,
    }: {
        aresINEData?: IGovEkonomickeSubjektyReturn;
        ine?: string;
        billing?: IBilling;
    } = $props();

    async function aresRequest() {
        if (ine && isINEValid(ine)) {
            try {
                const data = await findAresByINE({ ine });

                aresINEData = data;

                const {
                    obchodniJmeno,
                    sidlo: {
                        nazevUlice,
                        cisloDomovni,
                        cisloOrientacni,
                        psc,
                        nazevObce,
                        nazevStatu,
                    },
                    icoId,
                } = aresINEData;

                billing = {
                    fullname: obchodniJmeno,
                    line1: `${nazevUlice} ${cisloDomovni}/${cisloOrientacni}`,
                    postal: String(psc),
                    city: nazevObce,
                    country: nazevStatu,
                    ine,
                    vat: icoId,
                };
            } catch (e: AxiosError | unknown) {
                if (isAxiosError(e)) {
                    if (e.response?.data.kod) {
                        addToast({
                            data: {
                                title: m["errors.invalid-ine"](),
                                variant: "error",
                            },
                        });
                    }
                }
            }
        }
    }
</script>

<button
    class="btn preset-filled-primary-500 font-medium"
    onclick={aresRequest}
    type="button"
>
    {m["actions.fill-in-by-ine"]()}
</button>
