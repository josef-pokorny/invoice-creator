<script lang="ts">
    import _ from "lodash";

    import { m } from "$lib/paraglide/messages";
    import { useSupplierKeyStore } from "$lib/stores/supplier.svelte";
    import { getSupplierKeysFromStorage } from "$lib/utils/suppliers";

    import Combobox from "../form/Combobox.svelte";

    const supplierKeyStore = useSupplierKeyStore();

    let supplierKeys: string[] = $state([]);
    let open = $state(false);

    function getSupplierKeys() {
        supplierKeys = getSupplierKeysFromStorage();
    }

    $effect(() => {
        [open];

        getSupplierKeys();
    });
</script>

<Combobox
    nullable
    bind:open
    bind:value={supplierKeyStore.value.supplierName}
    nullValue=""
    options={supplierKeys
        .filter((s) => !_.isEmpty(s))
        .map((s) => ({
            value: s,
            label: s,
        }))}
    label={m["labels.supplier-preset"]()}
/>
