<script lang="ts" module>
    import type { IInvoiceValues } from "$lib/pdf/invoice-types";

    export type ISavedProfile = [string, IInvoiceValues];
    export type ISavedProfiles = ISavedProfile[];
</script>

<script lang="ts">
    import { browser } from "$app/environment";
    import { m } from "$lib/paraglide/messages";
    import {
        defaultFormKey,
        InvoiceFormKeyPrefix,
        useFormKeyStore,
        useFormStore,
    } from "$lib/stores/form.svelte";
    import { AppStoragePrefix } from "$lib/stores/sharedStore.svelte";
    import _ from "lodash";
    import Input from "./form/Input.svelte";
    import Label from "./form/Label.svelte";
    import Select from "./form/Select.svelte";
    import { FileDown, FileUp, Plus, Settings, Trash } from "@lucide/svelte";
    import moment from "$lib/moment";
    import Dialog from "$lib/components/Dialog.svelte";

    const Prefix = AppStoragePrefix + InvoiceFormKeyPrefix;

    const invoiceValuesKey = useFormKeyStore().value;
    let invoiceValues = $derived(
        useFormStore({
            get key() {
                return invoiceValuesKey.profileName;
            },
        }),
    );

    let invoiceValuesKeys: string[] = $state([]);

    $effect(() => {
        [...invoiceValuesKey.profileName];

        if (browser) {
            setTimeout(() => {
                invoiceValuesKeys = Object.entries(localStorage)
                    .filter(([k]) => k.startsWith(Prefix))
                    .map(([k]) => k.substring(Prefix.length))
                    .sort((a, b) =>
                        a.localeCompare(b, undefined, { sensitivity: "base" }),
                    );
            }, 50);
        } else {
            invoiceValuesKeys = [];
        }
    });

    let newKey = $state("");

    let importProfileFileInputEl: HTMLInputElement | undefined = $state();
    let importProfileFileValue: FileList | undefined = $state();

    let invoiceToStore: { key: string; value: IInvoiceValues } | undefined =
        $state();
    const formStoreToImport = $derived(
        useFormStore({
            get key() {
                return invoiceToStore?.key;
            },
        }),
    );

    $effect(() => {
        if (invoiceToStore?.key && invoiceToStore.value) {
            console.log({ invoiceToStore });
            formStoreToImport.value = _.cloneDeep(invoiceToStore.value);
        }
    });

    async function handleFileChange() {
        if (importProfileFileValue && importProfileFileValue.length > 0) {
            const file = importProfileFileValue[0];
            const text = await file.text();
            try {
                const jsonData: ISavedProfiles = JSON.parse(text);

                jsonData.map(([k, v]) => {
                    requestAnimationFrame(() => {
                        invoiceToStore = {
                            key: k.substring(Prefix.length),
                            value: v,
                        };
                    });
                });

                importProfileFileValue = undefined;
            } catch (e) {
                console.error("Parsing error on Import:", e);
            }
        }
    }

    function deleteProfile() {
        invoiceValues.deleteStore();
        invoiceValuesKey.profileName = defaultFormKey.profileName;
    }

    $effect(() => {
        handleFileChange();
    });
</script>

<Dialog class="w-full max-w-[520px]">
    {#snippet button({ toggleOpen, isOpen })}
        <button
            class="w-full !p-0 hover:brightness-75"
            type="button"
            title={m["labels.settings"]()}
            aria-label={m["labels.settings"]()}
            onclick={toggleOpen}
            role="switch"
            aria-checked={isOpen}
        >
            <Settings class="w-full" />
        </button>
    {/snippet}
    {#snippet content()}
        <h3 class="h4">{m["labels.settings"]()}</h3>
        <section class="flex flex-col gap-2">
            <Select
                bind:value={invoiceValuesKey.profileName}
                label={m["labels.used-profile"]()}
            >
                {#snippet options()}
                    {#each invoiceValuesKeys as profileName}
                        <option value={profileName}>
                            {profileName}
                        </option>
                    {/each}
                {/snippet}
            </Select>
            <div class="flex flex-row">
                <button
                    class="btn preset-filled-error-500 font-medium"
                    onclick={deleteProfile}
                >
                    <Trash />
                    {m["actions.delete-profile"]()}
                </button>
            </div>

            <form
                onsubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    let same = 0;

                    function createKeyName(key: string) {
                        return key + (same ? ` (${same})` : "");
                    }

                    function findSameKey(keyToFind: string) {
                        if (
                            invoiceValuesKeys.find((key) => key === keyToFind)
                        ) {
                            ++same;
                            console.log(createKeyName(newKey));
                            findSameKey(createKeyName(newKey));
                        } else {
                            newKey = createKeyName(newKey);
                        }
                    }
                    findSameKey(newKey);

                    invoiceValuesKey.profileName = String(newKey);
                    newKey = "";
                }}
            >
                <div class="grid grid-cols-[1fr_auto] items-end gap-0.5">
                    <Label
                        label={m["labels.new-profile"]()}
                        for="input-new-profile"
                    />
                    <div></div>

                    <Input bind:value={newKey} id="input-new-profile" />
                    <button
                        type="submit"
                        title={m["actions.save"]()}
                        class="btn-icon preset-filled-success-500 h-auto self-stretch px-2 py-0"
                    >
                        <Plus class="stroke-success-contrast-500" />
                    </button>
                </div>
            </form>

            <div class="mt-4 grid grid-cols-[1fr_1fr] gap-x-2">
                <button
                    class="btn preset-filled-secondary-500 flex w-full items-center font-medium"
                    onclick={() => {
                        importProfileFileInputEl?.click();
                    }}
                >
                    <FileDown />
                    {m["actions.import"]()}
                </button>
                <button
                    class="btn preset-filled-primary-500 flex w-full items-center font-medium"
                    onclick={() => {
                        let dataStr =
                            "data:text/json;charset=utf-8," +
                            encodeURIComponent(
                                JSON.stringify([
                                    ...Object.entries(localStorage)
                                        .filter(([k]) => k.startsWith(Prefix))
                                        .map(([k, v]) => [k, JSON.parse(v)]),
                                ] as ISavedProfiles),
                            );
                        let downloadAnchorNode = document.createElement("a");
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
                >
                    <FileUp />
                    {m["actions.export"]()}
                </button>
                <p class="text-left text-sm text-gray-400"></p>
                <p class="text-right text-sm text-gray-400">
                    {m["text.export-all"]()}
                </p>
            </div>

            {#key importProfileFileValue}
                <input
                    bind:files={importProfileFileValue}
                    bind:this={importProfileFileInputEl}
                    type="file"
                    accept="application/JSON"
                    hidden
                />
            {/key}
        </section>
    {/snippet}
</Dialog>
