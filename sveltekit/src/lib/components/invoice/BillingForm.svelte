<script lang="ts" module>
    import type { TStoreState } from "$lib/stores/utils/utils.svelte";

    export interface IBillingFormProps {
        store: TStoreState<IBilling>;
        type: IBillingType;
    }
</script>

<script lang="ts">
    import { m } from "$lib/paraglide/messages";
    import type { IBilling } from "$lib/pdf/invoice-types";
    import { useFormErrorsStore } from "$lib/stores/form.svelte";
    import { IBillingType } from "$lib/types/form";

    import ButtonRequestAres from "../ButtonRequestAres.svelte";
    import Input from "../form/Input.svelte";

    let { store, type }: IBillingFormProps = $props();

    const invoiceValuesErrors = useFormErrorsStore();
</script>

<Input
    error={type === IBillingType.SUPPLIER
        ? invoiceValuesErrors.value["supplierBilling.fullname"]
        : invoiceValuesErrors.value["receiverBilling.fullname"]}
    label={m["form.fullname"]()}
    bind:value={store.value.fullname}
/>
<Input
    error={type === IBillingType.SUPPLIER
        ? invoiceValuesErrors.value["supplierBilling.line1"]
        : invoiceValuesErrors.value["receiverBilling.line1"]}
    label={m["form.address"]()}
    bind:value={store.value.line1}
/>
<Input
    error={type === IBillingType.SUPPLIER
        ? invoiceValuesErrors.value["supplierBilling.postal"]
        : invoiceValuesErrors.value["receiverBilling.postal"]}
    label={m["form.postal"]()}
    bind:value={store.value.postal}
/>
<Input
    error={type === IBillingType.SUPPLIER
        ? invoiceValuesErrors.value["supplierBilling.city"]
        : invoiceValuesErrors.value["receiverBilling.city"]}
    label={m["form.city"]()}
    bind:value={store.value.city}
/>
<Input label={m["form.country"]()} bind:value={store.value.country} />
<Input
    error={type === IBillingType.SUPPLIER
        ? invoiceValuesErrors.value["supplierBilling.ine"]
        : invoiceValuesErrors.value["receiverBilling.ine"]}
    label={m["form.ine"]()}
    bind:value={store.value.ine}
/>
<ButtonRequestAres ine={store.value.ine} bind:billing={store.value} {type} />
<Input label={m["form.vat"]()} bind:value={store.value.vat} />
