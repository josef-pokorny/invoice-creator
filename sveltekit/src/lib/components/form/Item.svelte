<script lang="ts">
    import { m } from "$lib/paraglide/messages";
    import type { IInvoiceProps } from "$lib/pdf/invoice-types";
    import { useFormStore } from "$lib/stores/form";
    import { CircleDollarSign, Trash } from "@lucide/svelte";
    import Input from "./Input.svelte";
    import _ from "lodash";

    let { ...props }: { item: IInvoiceProps["invoiceData"]["items"][0] } =
        $props();

    const invoiceData = useFormStore().value;

    let item = $derived(props.item);

    $effect(() => {
        requestAnimationFrame(() => {
            invoiceData.items.map((i) => {
                if (i.id === item.id) {
                    return { ...i, ...item };
                } else {
                    return i;
                }
            });
        });
    });
</script>

<div class="border-surface-500 flex flex-col gap-2 rounded-[10px] border-1 p-3">
    <div class="flex justify-end">
        <button
            aria-label={m["actions.remove-item"]()}
            title={m["actions.remove-item"]()}
            type="button"
            onclick={() => {
                invoiceData.items = invoiceData.items.filter(
                    (i) => i.id !== item.id,
                );
            }}
        >
            <Trash class="stroke-error-500" />
        </button>
    </div>
    <Input bind:value={item.name} label={m["form.name"]()} />
    <Input
        bind:value={item.count}
        label={m["form.count"]()}
        type="number"
        min={0}
    />
    <div class="grid grid-cols-2 items-end gap-1">
        <Input
            bind:value={item.singlePrice}
            label={m["form.single-price"]()}
            type="number"
            step="0.01"
        />
        <Input
            bind:value={item.measurementUnit}
            label={m["form.measurement-unit"]()}
        />
    </div>
</div>
