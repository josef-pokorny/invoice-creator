<script lang="ts">
    import { createQuery } from "@tanstack/svelte-query";
    import { twMerge } from "tailwind-merge";

    import { m } from "$lib/paraglide/messages";
    import type { IBilling } from "$lib/pdf/invoice-types";
    import queryKeys from "$lib/query/queryKeys";
    import { findAresByINE } from "$lib/requests/ares/ares-ine";
    import type { IGovEkonomickeSubjektyReturn } from "$lib/requests/ares/ares-types";
    import { useFormErrorsStore } from "$lib/stores/form.svelte";
    import { addFormError } from "$lib/stores/utils/form-errors.svelte";
    import { isINEValid } from "$lib/validations/ine";

    import Button from "./form/Button.svelte";

    const invoiceValuesErrors = useFormErrorsStore();

    let {
        aresINEData = $bindable(),
        billing = $bindable(),
        type,
        ine,
    }: {
        aresINEData?: IGovEkonomickeSubjektyReturn;
        ine?: string;
        billing?: IBilling;
        type?: "supplier" | "receiver";
    } = $props();

    const query = createQuery(() => ({
        queryKey: queryKeys.ares.ine(ine!),
        queryFn: () => findAresByINE({ ine: ine! }),
        enabled: Boolean(ine) && isINEValid(ine),
        staleTime: 14 * 24 * 60 * 60 * 1000,
        retry: false,
        retryOnMount: false,
        refetchOnMount: false,
    }));

    async function aresAutocomplete() {
        const data = query.data || (await query.refetch()).data;

        if (data) {
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
            } = data;

            billing = {
                ...billing,
                fullname: obchodniJmeno,
                line1: `${nazevUlice} ${cisloDomovni}/${cisloOrientacni}`,
                postal: String(psc),
                city: nazevObce,
                country: nazevStatu,
                ine,
                vat: icoId,
            };
        }
    }

    $effect(() => {
        if (query.isError) {
            if (type === "supplier") {
                addFormError("supplierBilling.ine", m["errors.invalid-ine"]());
            } else if (type === "receiver") {
                addFormError("receiverBilling.ine", m["errors.invalid-ine"]());
            }
        }
    });
</script>

{#if !invoiceValuesErrors.value["supplierBilling.ine"]}
    <Button
        isLoading={query.isLoading}
        class={twMerge("btn preset-filled-primary-500 font-medium")}
        onclick={aresAutocomplete}
        type="button"
    >
        {m["actions.fill-in-by-ine"]()}
    </Button>
{/if}
