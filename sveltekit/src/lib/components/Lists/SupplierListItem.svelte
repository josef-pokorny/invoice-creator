<script lang="ts">
    import Check from "@lucide/svelte/icons/check";
    import CircleOff from "@lucide/svelte/icons/circle-off";
    import Pen from "@lucide/svelte/icons/pen";
    import Trash from "@lucide/svelte/icons/trash";
    import X from "@lucide/svelte/icons/x";
    import { slide } from "svelte/transition";
    import { twMerge } from "tailwind-merge";

    import { m } from "$lib/paraglide/messages";
    import type { ISupplierBilling } from "$lib/pdf/invoice-types";
    import {
        ImportSupplierKeyPrefix,
        useSupplierKeyStore,
    } from "$lib/stores/supplier.svelte";
    import { deleteStore, setKey } from "$lib/stores/utils/utils.svelte";
    import { createId } from "$lib/utils";

    import Accordion, {
        type IAccordionSnippetArguments,
    } from "../Accordion.svelte";
    import Divider from "../Divider.svelte";
    import Button from "../form/Button.svelte";
    import Input from "../form/Input.svelte";
    import SupplierFormPart from "../invoice/SupplierFormPart.svelte";
    import Tooltip from "../Tooltip.svelte";

    interface ISupplierListItemProps {
        key: string;
        supplier: ISupplierBilling;
        getSuppliers: () => void;
    }

    let { key, supplier, getSuppliers }: ISupplierListItemProps = $props();

    const supplierKeyStore = useSupplierKeyStore();

    let deleteConfirmation = $state(false);

    $effect(() => {
        if (deleteConfirmation) {
            let timeoutId = setTimeout(() => {
                deleteConfirmation = false;
            }, 3000);

            return () => {
                clearTimeout(timeoutId);
            };
        }
    });

    function onUpdateSupplierName({
        newName,
        prevName,
    }: {
        newName: string;
        prevName: string;
    }) {
        if (!newName.length) throw "";

        try {
            setKey(
                ImportSupplierKeyPrefix + prevName,
                ImportSupplierKeyPrefix + newName,
            );

            if (supplierKeyStore.value.supplierName === prevName) {
                supplierKeyStore.value.supplierName = newName;
            }

            getSuppliers();
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    function onDeleteSupplier(supplierName: string) {
        if (!deleteConfirmation) {
            deleteConfirmation = true;
        } else {
            deleteStore(ImportSupplierKeyPrefix + supplierName);
            getSuppliers();
        }
    }
</script>

<div class="py-1" transition:slide={{ duration: 200 }}>
    <Input
        containerProps={{
            class: twMerge(
                "rounded-b-none",
                deleteConfirmation ? "bg-error-900" : "",
            ),
        }}
        value={key}
        onchange={(event) => {
            try {
                onUpdateSupplierName({
                    prevName: key,
                    newName: event.currentTarget.value,
                });
            } catch (e) {
                getSuppliers();
            }
        }}
    >
        {#snippet suffix()}
            <Button
                class="ig-btn font-medium {deleteConfirmation
                    ? ''
                    : 'hover:text-error-500'}"
                onclick={() => key && onDeleteSupplier(key)}
                aria-label={m["actions.delete-supplier"]()}
            >
                {#if deleteConfirmation}
                    <Check />
                {:else}
                    <Trash />
                {/if}
            </Button>
        {/snippet}
    </Input>

    <Accordion
        items={[
            {
                title: AccordionTitile,
                content: AccordionContent,
                id: createId("accordion"),
            },
        ]}
    />
</div>

{#snippet AccordionTitile({ item }: IAccordionSnippetArguments)}
    <div
        {...item.heading}
        class={twMerge(
            "bg-surface-900 rounded-b-base text-surface-200 border-surface-800 flex w-full border-1 border-t-0 p-2",
            item.isExpanded ? "!rounded-none" : "",
        )}
    >
        <Tooltip>
            {#snippet trigger({ builder })}
                <Button
                    {...item.trigger}
                    class="text-surface-contrast-950 hover:text-primary-200 pr-4"
                    {...builder}
                >
                    {#if item.isExpanded}
                        <X />
                    {:else}
                        <Pen />
                    {/if}
                </Button>
            {/snippet}
            {#snippet children()}
                {#if item.isExpanded}
                    {m["actions.close"]()}
                {:else}
                    {m["actions.edit-supplier"]()}
                {/if}
            {/snippet}
        </Tooltip>
        {@render SupplierValuePreview(supplier.fullname)}
        {@render SupplierValuePreview(supplier.line1)}
        {@render SupplierValuePreview(supplier.ine)}
    </div>
{/snippet}
{#snippet AccordionContent({ item }: IAccordionSnippetArguments)}
    <div
        {...item.content}
        class="flex flex-col gap-2 border-surface-800 border-1 border-t-0 p-2"
    >
        <SupplierFormPart
            supplierNameKey={key.substring(ImportSupplierKeyPrefix.length)}
        />
    </div>
{/snippet}

{#snippet SupplierValuePreview(value?: string)}
    <p class="line-clamp-1 shrink-1 break-all">
        {#if value}
            {value}
        {:else}
            <CircleOff class="p-1" />
        {/if}
    </p>
    <Divider isInFlex direction="y" class="mx-2 last-of-type:hidden" />
{/snippet}
