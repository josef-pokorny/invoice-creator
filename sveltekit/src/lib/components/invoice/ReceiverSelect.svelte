<script lang="ts">
    import _ from "lodash";

    import { m } from "$lib/paraglide/messages";
    import { useReceiverKeyStore } from "$lib/stores/receiver.svelte";
    import { getReceiverKeysFromStorage } from "$lib/stores/utils/receiver.svelte";

    import Combobox from "../form/Combobox.svelte";
    import type { IOption } from "../form/OptionsList.svelte";

    const receiverKeyStore = useReceiverKeyStore();

    let receiverKeysOptions: IOption<string>[] = $state([]);
    let open = $state(false);

    function getReceiverKeys() {
        receiverKeysOptions = getReceiverKeysFromStorage()
            .filter((s) => !_.isEmpty(s))
            .map((s) => ({
                value: s,
                label: s,
            }));
    }

    $effect(() => {
        [open];

        getReceiverKeys();
    });
</script>

<Combobox
    nullable
    bind:open
    bind:value={receiverKeyStore.value.receiverName}
    nullValue=""
    options={receiverKeysOptions}
    label={m["labels.supplier-preset"]()}
    inputClass="ring-primary-700"
    labelClass="text-primary-50"
/>
