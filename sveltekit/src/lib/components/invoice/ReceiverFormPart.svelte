<script lang="ts" module>
    export interface ISupplierFormPartProps {
        receiverNameKey?: string;
    }
</script>

<script lang="ts">
    import _ from "lodash";

    import { m } from "$lib/paraglide/messages";
    import {
        useReceiverKeyStore,
        useReceiverStore,
    } from "$lib/stores/receiver.svelte";
    import { IBillingType } from "$lib/types/form";

    import Message from "../Message.svelte";
    import BillingForm from "./BillingForm.svelte";

    let { receiverNameKey }: ISupplierFormPartProps = $props();

    const receiverKeyStore = receiverNameKey ?? useReceiverKeyStore();
    const receiverStore = $derived(
        useReceiverStore({
            get key() {
                return _.isString(receiverKeyStore)
                    ? receiverKeyStore
                    : receiverKeyStore.value.receiverName;
            },
        }),
    );
</script>

<h3 class="h5 font-bold uppercase">
    {m["form.supplier"]()}
    {#if receiverNameKey}
        - {receiverNameKey}
    {/if}
</h3>
<Message id="supplier-ine-fill" clossable>
    {m["text.you-can-fill-by-ine"]()}
</Message>

{#if !receiverNameKey}
    <!-- TODO: ReceiverSelect -->

    <!-- <div class="mb-5">
        HERE
    </div> -->
{/if}

<BillingForm store={receiverStore} type={IBillingType.RECEIVER} />
