<script lang="ts" module>
    export interface ISupplierFormPartProps {
        supplierNameKey?: string;
    }
</script>

<script lang="ts">
    import _ from "lodash";

    import { m } from "$lib/paraglide/messages";
    import {
        useSupplierKeyStore,
        useSupplierStore,
    } from "$lib/stores/supplier.svelte";
    import { IBillingType } from "$lib/types/form";

    import Switch from "../form/Switch.svelte";
    import Message from "../Message.svelte";
    import BillingForm from "./BillingForm.svelte";
    import SupplierSelect from "./SupplierSelect.svelte";

    let { supplierNameKey }: ISupplierFormPartProps = $props();

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
    <div class="mb-5">
        <SupplierSelect />
    </div>
{/if}

<BillingForm store={supplierStore} type={IBillingType.SUPPLIER} />

<Switch
    label={m["form.is-selfemployed"]()}
    bind:checked={supplierStore.value.isSelfEmployed}
/>
