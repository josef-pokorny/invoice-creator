<script lang="ts" module>
    export interface ISupplierFormPartProps {
        supplierNameKey?: string;
    }
</script>

<script lang="ts">
    import _ from "lodash";

    import { m } from "$lib/paraglide/messages";
    import { useFormErrorsStore } from "$lib/stores/form.svelte";
    import {
        useSupplierKeyStore,
        useSupplierStore,
    } from "$lib/stores/supplier.svelte";

    import ButtonRequestAres from "../ButtonRequestAres.svelte";
    import Input from "../form/Input.svelte";
    import Switch from "../form/Switch.svelte";
    import Message from "../Message.svelte";
    import SupplierSelect from "./SupplierSelect.svelte";

    let { supplierNameKey }: ISupplierFormPartProps = $props();

    const invoiceValuesErrors = useFormErrorsStore();

    const supplierKeyStore = supplierNameKey ?? useSupplierKeyStore();
    const supplierStore = $derived(
        useSupplierStore({
            get key() {
                return _.isString(supplierKeyStore)
                    ? supplierKeyStore
                    : supplierKeyStore.value.supplierName;
            },
        }),
    );
</script>

<h3 class="h5 font-bold uppercase">
    {m["form.supplier"]()}
    {#if supplierNameKey}
        - {supplierNameKey}
    {/if}
</h3>
<Message id="supplier-ine-fill" clossable>
    {m["text.you-can-fill-by-ine"]()}
</Message>

{#if !supplierNameKey}
    <SupplierSelect />
{/if}

<Input
    error={invoiceValuesErrors.value["supplierBilling.fullname"]}
    label={m["form.fullname"]()}
    bind:value={supplierStore.value.fullname}
/>
<Input
    error={invoiceValuesErrors.value["supplierBilling.line1"]}
    label={m["form.address"]()}
    bind:value={supplierStore.value.line1}
/>
<Input
    error={invoiceValuesErrors.value["supplierBilling.postal"]}
    label={m["form.postal"]()}
    bind:value={supplierStore.value.postal}
/>
<Input
    error={invoiceValuesErrors.value["supplierBilling.city"]}
    label={m["form.city"]()}
    bind:value={supplierStore.value.city}
/>
<Input label={m["form.country"]()} bind:value={supplierStore.value.country} />
<Input
    error={invoiceValuesErrors.value["supplierBilling.ine"]}
    label={m["form.ine"]()}
    bind:value={supplierStore.value.ine}
/>
<ButtonRequestAres
    ine={supplierStore.value.ine}
    bind:billing={supplierStore.value}
    type="supplier"
/>

<Input label={m["form.vat"]()} bind:value={supplierStore.value.vat} />

<Switch
    label={m["form.is-selfemployed"]()}
    bind:checked={supplierStore.value.isSelfEmployed}
/>
