<script lang="ts">
    import _ from "lodash";

    import { m } from "$lib/paraglide/messages";
    import { useSupplierKeyStore } from "$lib/stores/supplier.svelte";
    import { getSupplierKeysFromStorage } from "$lib/stores/utils/supplier.svelte";

    import Combobox from "../form/Combobox.svelte";
    import type { IOption } from "../form/OptionsList.svelte";

    const supplierKeyStore = useSupplierKeyStore();

    let supplierKeysOptions: IOption<string>[] = $state([]);
    let open = $state(false);

    function getSupplierKeys() {
        supplierKeysOptions = getSupplierKeysFromStorage()
            .filter((s) => !_.isEmpty(s))
            .map((s) => ({
                value: s,
                label: s,
            }));
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
    options={supplierKeysOptions}
    label={m["labels.supplier-preset"]()}
    inputClass="ring-primary-700"
    labelClass="text-primary-50"
/>
