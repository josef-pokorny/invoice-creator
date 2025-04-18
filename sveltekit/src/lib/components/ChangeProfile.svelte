<script lang="ts" module>
    import type { IInvoiceValues } from "$lib/pdf/invoice-types";

    export type ISavedProfile = [string, IInvoiceValues];
    export type ISavedProfiles = ISavedProfile[];
</script>

<script lang="ts">
    import { browser } from "$app/environment";
    import { m } from "$lib/paraglide/messages";
    import {
        InvoiceFormKeyPrefix,
        useFormKeyStore,
        useFormStore,
    } from "$lib/stores/form.svelte";
    import { AppStoragePrefix } from "$lib/stores/sharedStore.svelte";
    import _ from "lodash";
    import Input from "./form/Input.svelte";
    import Label from "./form/Label.svelte";
    import Select from "./form/Select.svelte";
    import { FileDown, FileUp, Plus } from "@lucide/svelte";
    import { untrack } from "svelte";

    const Prefix = AppStoragePrefix + InvoiceFormKeyPrefix;

    const invoiceValuesKey = useFormKeyStore().value;

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

    let profileFileInputEl: HTMLInputElement | undefined = $state();
    let profileFileValue: FileList | undefined = $state();

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
        if (profileFileValue && profileFileValue.length > 0) {
            const file = profileFileValue[0];
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

                profileFileValue = undefined;
            } catch (e) {
                console.error("Parsing error on Import:", e);
            }
        }
    }

    $effect(() => {
        handleFileChange();
    });
</script>

<div class="flex flex-col gap-2">
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

    <form
        onsubmit={(e) => {
            e.preventDefault();

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

            invoiceValuesKey.profileName = String(newKey);
            newKey = "";
        }}
    >
        <div class="grid grid-cols-[1fr_auto] items-end gap-0.5">
            <Label label={m["labels.new-profile"]()} for="input-new-profile" />
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

    <div class="flex flex-row gap-2">
        <button
            class="btn preset-filled-secondary-500 flex w-full items-center font-medium"
            onclick={() => {
                profileFileInputEl?.click();
            }}
        >
            <FileDown />
            {m["actions.import"]()}
        </button>
        {#key profileFileValue}
            <input
                bind:files={profileFileValue}
                bind:this={profileFileInputEl}
                type="file"
                hidden
            />
        {/key}
        <input
            bind:files={profileFileValue}
            bind:this={profileFileInputEl}
            type="file"
            hidden
        />
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
                    "profiles" + ".json",
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
    </div>
</div>
