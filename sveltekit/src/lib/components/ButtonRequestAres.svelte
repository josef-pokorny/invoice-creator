<script lang="ts">
    import type { IBilling } from "$lib";
    import { m } from "$lib/paraglide/messages";
    import { findAresByINE } from "$lib/requests/ares/ares-ine";
    import type { IGovEkonomickeSubjektyReturn } from "$lib/requests/ares/ares-types";
    import { useToasterStore } from "$lib/stores/toaster";
    import { isINEValid } from "$lib/validations/ine";

    const toaster = useToasterStore().value;

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
            } catch (e) {
                toaster.error({
                    description: m["errors.something-went-wrong-500"](),
                });
            }
        }
    }
</script>

<button
    class="btn preset-filled-primary-500 font-medium"
    type="button"
    onclick={aresRequest}
>
    {m["actions.fill-in-by-ine"]()}
</button>
