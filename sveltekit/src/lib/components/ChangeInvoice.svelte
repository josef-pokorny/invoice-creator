<script lang="ts" module>
    import type { IInvoiceValues } from "$lib/pdf/invoice-types";

    export type ISavedProfile = [string, IInvoiceValues];
    export type ISavedProfiles = ISavedProfile[];
</script>

<script lang="ts">
    import Check from "@lucide/svelte/icons/check";
    import FileDown from "@lucide/svelte/icons/file-down";
    import FileUp from "@lucide/svelte/icons/file-up";
    import Plus from "@lucide/svelte/icons/plus";
    import Settings from "@lucide/svelte/icons/settings";
    import Trash from "@lucide/svelte/icons/trash";
    import { onMount } from "svelte";

    import Dialog from "$lib/components/Dialog.svelte";
    import { AppStoragePrefix, InvoiceFormKeyPrefix } from "$lib/constants";
    import moment from "$lib/moment";
    import { m } from "$lib/paraglide/messages";
    import { useFormKeyStore } from "$lib/stores/form.svelte";
    import { deleteStore, stores } from "$lib/stores/sharedStore.svelte";
    import { saveToLocalStorage } from "$lib/stores/utils";

    import Button from "./form/Button.svelte";
    import Input from "./form/Input.svelte";
    import RadioGroup from "./form/RadioGroup.svelte";

    const ImportKeyPrefix = AppStoragePrefix + InvoiceFormKeyPrefix;

    const invoiceValuesKey = useFormKeyStore();

    let invoiceValuesKeys: string[] = $state([]);

    let newKey = $state("");
    let invoiceForDeletionConfirmation = $state("");

    let importProfileFileInputEl: HTMLInputElement | undefined = $state();
    let importProfileFileValue: FileList | undefined = $state();

    function deleteProfile(profileName: string) {
        if (profileName !== invoiceForDeletionConfirmation) {
            invoiceForDeletionConfirmation = profileName;
        } else {
            if (profileName === invoiceValuesKey.value.profileName) {
                invoiceValuesKey.reset();
            }

            deleteStore(ImportKeyPrefix + profileName);
            getInvoiceValuesKeys();
        }
    }

    function getInvoiceValuesKeys() {
        invoiceValuesKeys = Object.entries(localStorage)
            .filter(([k]) => k.startsWith(ImportKeyPrefix))
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

        invoiceValuesKey.value.profileName = String(newKey);
        requestAnimationFrame(() => {
            getInvoiceValuesKeys();
        });
        newKey = "";
    }

    onMount(() => {
        getInvoiceValuesKeys();
    });

    $effect(() => {
        if (importProfileFileValue && importProfileFileValue.length > 0) {
            importProfileFileValue[0].text().then((text) => {
                try {
                    const jsonData: ISavedProfiles = JSON.parse(text);

                    stores.value = new Map();
                    jsonData.map(([k, v]) => {
                        saveToLocalStorage(k, v);
                    });
                    invoiceValuesKey.reset();

                    importProfileFileValue = undefined;
                } catch (e) {
                    console.error("Parsing error on Import:", e);
                }
            });
        }
    });
</script>

<Dialog class="w-full max-w-[520px]">
    {#snippet button({ toggleOpen, isOpen })}
        <button
            class="w-full !p-0 hover:brightness-75"
            aria-checked={isOpen}
            aria-label={m["labels.settings"]()}
            onclick={toggleOpen}
            role="switch"
            title={m["labels.settings"]()}
            type="button"
        >
            <Settings class="w-full" />
        </button>
    {/snippet}
    {#snippet content()}
        <h3 class="h4">{m["labels.invoices"]()}</h3>
        <section class="flex flex-col gap-2">
            <div class="max-h-[350px] overflow-auto px-1.5 py-5">
                <form class="mb-5" onsubmit={onCreateInvocie}>
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
                    bind:group={invoiceValuesKey.value.profileName}
                    radios={invoiceValuesKeys.map((v) => ({
                        label: v,
                        value: v,
                    }))}
                >
                    {#snippet snippetRadio({ label, value })}
                        <Input value={label}>
                            {#snippet suffix()}
                                <Button
                                    class="ig-btn hover:text-error-500 font-medium"
                                    onclick={() =>
                                        value && deleteProfile(value)}
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

            <hr class="hr mb-5" />

            <div class="mt-4 grid grid-cols-[1fr_1fr] gap-x-2">
                <button
                    class="btn preset-filled-secondary-500 flex w-full items-center font-medium"
                    onclick={() => {
                        importProfileFileInputEl?.click();
                    }}
                    type="button"
                >
                    <FileDown />
                    {m["actions.import"]()}
                </button>
                {#key importProfileFileValue}
                    <input
                        bind:this={importProfileFileInputEl}
                        accept="application/json"
                        hidden
                        type="file"
                        bind:files={importProfileFileValue}
                    />
                {/key}

                <button
                    class="btn preset-filled-primary-500 flex w-full items-center font-medium"
                    onclick={() => {
                        const dataStr =
                            "data:text/json;charset=utf-8," +
                            encodeURIComponent(
                                JSON.stringify([
                                    ...Object.entries(localStorage)
                                        .filter(([k]) =>
                                            k.startsWith(ImportKeyPrefix),
                                        )
                                        .map(([k, v]) => [k, JSON.parse(v)]),
                                ] as ISavedProfiles),
                            );
                        const downloadAnchorNode = document.createElement("a");
                        downloadAnchorNode.setAttribute("href", dataStr);
                        downloadAnchorNode.setAttribute(
                            "download",
                            "profiles " +
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
                </button>
                <p class="text-left text-sm text-gray-400"></p>
                <p class="text-right text-sm text-gray-400">
                    {m["text.export-all"]()}
                </p>
            </div>
        </section>
    {/snippet}
</Dialog>
