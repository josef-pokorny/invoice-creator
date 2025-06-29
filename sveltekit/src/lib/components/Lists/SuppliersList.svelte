<script lang="ts">
    import Plus from "@lucide/svelte/icons/plus";
    import Search from "@lucide/svelte/icons/search";

    import { m } from "$lib/paraglide/messages";
    import type { ISupplierBilling } from "$lib/pdf/invoice-types";
    import {
        ImportSupplierKeyPrefix,
        useSupplierKeyStore,
        useSupplierStore,
    } from "$lib/stores/supplier.svelte";
    import { normalizeStringForSearch } from "$lib/utils";
    import {
        createSupplierInLocalStorage,
        getSuppliersFromStorage,
    } from "$lib/utils/suppliers";

    import Button from "../form/Button.svelte";
    import Input from "../form/Input.svelte";
    import SupplierListItem from "./SupplierListItem.svelte";

    const supplierKeyStore = useSupplierKeyStore();
    const supplierStore = $derived(
        useSupplierStore({
            get key() {
                return supplierKeyStore.value.supplierName;
            },
        }),
    );

    let newKey = $state("");
    let suppliers: [string, ISupplierBilling][] = $state([]);
    let search = $state("");

    let isOpen = $state(false);

    function getSuppliers() {
        suppliers = getSuppliersFromStorage(normalizeStringForSearch(search));
    }

    function onCreateSupplier(e?: SubmitEvent) {
        console.log({ newKey });

        e?.preventDefault();
        e?.stopPropagation();

        console.log({ newKey });

        if (!newKey.length) return;

        let same = 0;

        function createKeyName(key: string) {
            return key + (same ? ` (${same})` : "");
        }

        function findSameKey(keyToFind: string) {
            if (
                suppliers.find(
                    ([k]) => k === ImportSupplierKeyPrefix + keyToFind,
                )
            ) {
                ++same;
                console.log(createKeyName(newKey));
                findSameKey(createKeyName(newKey));
            } else {
                newKey = createKeyName(newKey);
            }
        }
        findSameKey(newKey);

        console.log({ newKey });

        createSupplierInLocalStorage(newKey);

        requestAnimationFrame(() => {
            getSuppliers();
        });
        newKey = "";
    }

    $effect(() => {
        [isOpen, search, { ...supplierStore.value }];

        getSuppliers();
    });
</script>

<div>
    <h3 class="h4">{m["labels.suppliers"]()}</h3>
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
            <form class="mb-2" onsubmit={onCreateSupplier}>
                <Input
                    placeholder={m["labels.new-supplier"]()}
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

            <div class="flex flex-col">
                {#each suppliers as [key, supplier] (key)}
                    <SupplierListItem {key} {supplier} {getSuppliers} />
                {/each}
            </div>
        </div>
    </section>
</div>
