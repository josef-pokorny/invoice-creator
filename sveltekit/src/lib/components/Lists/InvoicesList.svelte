<script lang="ts">
    import Check from "@lucide/svelte/icons/check";
    import FileDown from "@lucide/svelte/icons/file-down";
    import FileUp from "@lucide/svelte/icons/file-up";
    import Plus from "@lucide/svelte/icons/plus";
    import Search from "@lucide/svelte/icons/search";
    import Trash from "@lucide/svelte/icons/trash";
    import { twMerge } from "tailwind-merge";

    import { AppStoragePrefix, InvoiceFormKeyPrefix } from "$lib/constants";
    import moment from "$lib/moment";
    import { m } from "$lib/paraglide/messages";
    import { useFormKeyStore } from "$lib/stores/form.svelte";
    import {
        deleteStore,
        saveToLocalStorage,
        setKey,
        stores,
    } from "$lib/stores/utils/utils.svelte";
    import { normalizeStringForSearch } from "$lib/utils";

    import Button from "../form/Button.svelte";
    import Input from "../form/Input.svelte";
    import RadioGroup from "../form/RadioGroup.svelte";
    import type { ISavedInvoices } from "../InvoiceSelect.svelte";

    const ImportKeyPrefix = AppStoragePrefix + InvoiceFormKeyPrefix;

    const invoiceValuesKey = useFormKeyStore();

    let newKey = $state("");
    let invoiceForDeletionConfirmation = $state("");
    let importInvoiceFileInputEl: HTMLInputElement | undefined = $state();
    let importInvoicesFileValue: FileList | undefined = $state();
    let invoiceValuesKeys: string[] = $state([]);
    let search = $state("");

    let isOpen = $state(false);

    function onDeleteInvoice(invoiceName: string) {
        if (invoiceName !== invoiceForDeletionConfirmation) {
            invoiceForDeletionConfirmation = invoiceName;
        } else {
            if (invoiceName === invoiceValuesKey.value.invoiceName) {
                invoiceValuesKey.reset();
            }

            deleteStore(ImportKeyPrefix + invoiceName);
            getInvoiceValuesKeys();

            if (invoiceName === invoiceValuesKey.value.invoiceName) {
                invoiceValuesKey.reset();
            }
        }
    }

    function getInvoiceValuesKeys() {
        const normalizedSearch = normalizeStringForSearch(search);

        invoiceValuesKeys = Object.entries(localStorage)
            .filter(
                ([k]) =>
                    k.startsWith(ImportKeyPrefix) &&
                    (normalizedSearch.length
                        ? normalizeStringForSearch(
                              k.substring(ImportKeyPrefix.length),
                          ).includes(normalizedSearch)
                        : true),
            )
            .map(([k]) => k.substring(ImportKeyPrefix.length))
            .sort((a, b) =>
                a.localeCompare(b, undefined, { sensitivity: "base" }),
            );
    }

    function onCreateInvocie(e: SubmitEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (!newKey.length) return;

        let same = 0;

        function createKeyName(key: string) {
            return key + (same ? ` (${same})` : "");
        }

        function findSameKey(keyToFind: string) {
            if (invoiceValuesKeys.find((key) => key === keyToFind)) {
                ++same;
                console.log(createKeyName(newKey));
                findSameKey(createKeyName(newKey));
            } else {
                newKey = createKeyName(newKey);
            }
        }
        findSameKey(newKey);

        invoiceValuesKey.value.invoiceName = String(newKey);
        requestAnimationFrame(() => {
            getInvoiceValuesKeys();
        });
        newKey = "";
    }

    function onUpdateInvoiceName({
        newName,
        prevName,
    }: {
        newName: string;
        prevName: string;
    }) {
        if (!newName.length) throw "";

        try {
            setKey(ImportKeyPrefix + prevName, ImportKeyPrefix + newName);
            getInvoiceValuesKeys();
            invoiceValuesKey.value.invoiceName = newName;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    $effect(() => {
        [isOpen, search, importInvoicesFileValue];

        getInvoiceValuesKeys();
        invoiceForDeletionConfirmation = "";
    });

    $effect(() => {
        if (importInvoicesFileValue && importInvoicesFileValue.length > 0) {
            importInvoicesFileValue[0].text().then((text) => {
                try {
                    const { invoices }: ISavedInvoices = JSON.parse(text);

                    stores.value.clear();

                    invoices.map(([k, v]) => {
                        saveToLocalStorage(k, v);
                    });

                    invoiceValuesKey.reset();

                    importInvoicesFileValue = undefined;
                } catch (e) {
                    console.error("Parsing error on Import:", e);
                }
            });
        }
    });
</script>

<div>
    <h3 class="h4">{m["labels.invoices"]()}</h3>
    <section class="mt-2 flex flex-col">
        <div class="px-3">
            <Input
                bind:value={search}
                placeholder={m["labels.search"]()}
                fieldsetProps={{ class: "shadow-bottom" }}
            >
                {#snippet prefix()}
                    <div class="ig-cell preset-tonal">
                        <Search />
                    </div>
                {/snippet}
            </Input>
        </div>
        <div class="mt-2 overflow-auto px-3 py-5">
            <form class="mb-2 ml-8" onsubmit={onCreateInvocie}>
                <Input
                    placeholder={m["labels.new-invoice"]()}
                    bind:value={newKey}
                >
                    {#snippet suffix()}
                        <Button
                            class="ig-btn preset-filled-success-500 font-medium"
                            type="submit"
                        >
                            <Plus class="stroke-success-contrast-500" />
                        </Button>
                    {/snippet}
                </Input>
            </form>
            <RadioGroup
                groupLabel={m["labels.used-invoice"]()}
                bind:group={invoiceValuesKey.value.invoiceName}
                radios={invoiceValuesKeys.map((v) => ({
                    label: v,
                    value: v,
                }))}
            >
                {#snippet snippetRadio({ label, value })}
                    {@const isSelected =
                        value === invoiceValuesKey.value.invoiceName}

                    <Input
                        containerProps={{
                            class: twMerge(
                                isSelected
                                    ? "bg-primary-900 ring-surface-500"
                                    : "",
                                value === invoiceForDeletionConfirmation
                                    ? "bg-error-900 ring-surface-500"
                                    : "",
                            ),
                        }}
                        value={label}
                        onchange={(event) => {
                            if (label) {
                                try {
                                    onUpdateInvoiceName({
                                        prevName: label,
                                        newName: event.currentTarget.value,
                                    });
                                } catch (e) {
                                    getInvoiceValuesKeys();
                                }
                            }
                        }}
                    >
                        {#snippet suffix()}
                            <Button
                                class={twMerge(
                                    "ig-btn font-medium",
                                    invoiceForDeletionConfirmation === value
                                        ? ""
                                        : "hover:text-error-500",
                                    isSelected ? "border-surface-500" : "",
                                )}
                                onclick={() => value && onDeleteInvoice(value)}
                                aria-label={m["actions.delete-invoice"]()}
                            >
                                {#if invoiceForDeletionConfirmation === value}
                                    <Check />
                                {:else}
                                    <Trash />
                                {/if}
                            </Button>
                        {/snippet}
                    </Input>
                {/snippet}
            </RadioGroup>
        </div>

        <hr class="hr my-7" />

        <div class="grid grid-cols-[1fr_1fr] gap-x-2">
            <Button
                class="btn preset-filled-secondary-500 flex w-full items-center font-medium"
                onclick={() => {
                    importInvoiceFileInputEl?.click();
                }}
                type="button"
            >
                <FileDown />
                {m["actions.import"]()}
            </Button>
            {#key importInvoicesFileValue}
                <input
                    bind:this={importInvoiceFileInputEl}
                    accept="application/json"
                    hidden
                    type="file"
                    bind:files={importInvoicesFileValue}
                />
            {/key}

            <Button
                class="btn preset-filled-primary-500 flex w-full items-center font-medium"
                onclick={() => {
                    const dataStr =
                        "data:text/json;charset=utf-8," +
                        encodeURIComponent(
                            JSON.stringify({
                                invoices: Object.entries(localStorage)
                                    .filter(([k]) =>
                                        k.startsWith(ImportKeyPrefix),
                                    )
                                    .map(([k, v]) => [k, JSON.parse(v)]),
                            } as ISavedInvoices),
                        );
                    const downloadAnchorNode = document.createElement("a");
                    downloadAnchorNode.setAttribute("href", dataStr);
                    downloadAnchorNode.setAttribute(
                        "download",
                        "invoices " +
                            moment().format().replace(":", "") +
                            ".json",
                    );
                    document.body.appendChild(downloadAnchorNode);
                    downloadAnchorNode.click();
                    setTimeout(() => {
                        downloadAnchorNode.remove();
                    }, 0);
                }}
                type="button"
            >
                <FileUp />
                {m["actions.export"]()}
            </Button>
            <p class="text-left text-sm text-gray-400"></p>
            <p class="text-right text-sm text-gray-400">
                {m["text.export-all"]()}
            </p>
        </div>
    </section>
</div>
