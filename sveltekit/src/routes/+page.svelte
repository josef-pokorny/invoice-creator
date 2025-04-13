<script lang="ts">
    import { renderInvoice } from "$lib";
    import Crawl from "$lib/components/crawl.svelte";
    import PdfViewer from "svelte-pdf";
    import Input from "$lib/components/form/Input.svelte";
    import { onMount } from "svelte";
    import { useFormStore } from "$lib/stores/form";
    import { m } from "$lib/paraglide/messages";
    import moment from "$lib/moment";
    import Item from "$lib/components/form/Item.svelte";
    import SvgPlusCircle from "$lib/svgs/svg-plus-circle.svelte";
    import _ from "lodash";

    let url: string | null = $state(null);

    const invoiceData = useFormStore().value;

    function renderPDF() {
        if (url) window.URL.revokeObjectURL(url);

        renderInvoice({
            invoiceProps: {
                invoiceData: {
                    ...invoiceData,
                    items: invoiceData.items.map((i) => ({
                        ...i,
                        singlePrice: i.singlePrice * 100,
                    })),
                },
            },
        }).then((d) => {
            url = d;
        });
    }

    onMount(() => {
        renderPDF();
        invoiceData.paidAt = "";
        invoiceData.issuedAt = "";
    });

    let date = $state(
        ("0000" + moment(invoiceData.paidAt).year()).slice(-4) +
            "-" +
            ("00" + moment(invoiceData.paidAt).date() + 1).slice(-2) +
            "-" +
            ("00" + moment(invoiceData.paidAt).month()).slice(-2),
    );

    $inspect(date);
</script>

<Crawl />

<div class="relative mb-40 flex gap-x-3 justify-center">
    <form
        class="relative m-0 mt-5 mb-15 flex w-full max-w-[450px] shrink-0 flex-col gap-2"
        onsubmit={(e) => {
            e.preventDefault();
            renderPDF();
        }}
        onchange={() => renderPDF}
    >
        <h2 class="h3 text-center">Údaje</h2>
        <Input
            bind:value={invoiceData.companyName}
            label={m["form.company"]()}
        />

        <hr class="hr my-4" />

        <h3 class="font-bold uppercase">{m["form.general"]()}</h3>
        <Input bind:value={invoiceData.refId} label={m["form.refid"]()} />
        <Input bind:value={invoiceData.currency} label={m["form.currency"]()} />
        <Input
            label={m["form.issued-at"]()}
            type="date"
            onchange={(e) => {
                console.log(e.currentTarget.value);
                invoiceData.issuedAt = moment(
                    e.currentTarget.value,
                ).toISOString();
            }}
        />
        <Input
            label={m["form.paid-at"]()}
            type="date"
            onchange={(e) => {
                console.log(e.currentTarget.value);
                invoiceData.paidAt = moment(
                    e.currentTarget.value,
                ).toISOString();
            }}
        />

        <hr class="hr my-4" />

        <h3 class="font-bold uppercase">{m["form.receiver"]()}</h3>
        <Input
            bind:value={invoiceData.billing.fullname}
            label={m["form.fullname"]()}
        />
        <Input
            bind:value={invoiceData.billing.line1}
            label={m["form.address"]()}
        />
        <Input
            bind:value={invoiceData.billing.postal}
            label={m["form.postal"]()}
        />
        <Input bind:value={invoiceData.billing.city} label={m["form.city"]()} />
        <Input
            bind:value={invoiceData.billing.country}
            label={m["form.country"]()}
        />
        <Input bind:value={invoiceData.billing.ine} label={m["form.ine"]()} />
        <Input bind:value={invoiceData.billing.vat} label={m["form.vat"]()} />

        <hr class="hr my-4" />

        <h3 class="font-bold uppercase">{m["form.items"]()}</h3>
        {#each invoiceData.items as item (item.id)}
            <Item {item} />
        {/each}
        <div>
            <button
                onclick={() => {
                    invoiceData.items.push({
                        count: 0,
                        measurementUnit: "",
                        name: "",
                        singlePrice: 0,
                        currency: "",
                        id: _.uniqueId("item_") + Math.random() + Math.random(),
                    });
                }}
                type="button"
                class="btn btn-group preset-filled-success-100-900"
            >
                <SvgPlusCircle class="fill-success-600 w-10" />
                {m["actions.add-item"]()}
            </button>
        </div>

        <hr class="hr my-4" />

        <button
            type="submit"
            class="btn preset-filled-success-100-900 sticky bottom-0 min-h-15"
        >
            Uložit
        </button>
    </form>
    <div
        class="pdf-viewer-wrap sticky top-25 m-0 h-[80svh] max-w-[750px] flex-1 overflow-auto opacity-70"
    >
        {#if url}
            {#key url}
                <PdfViewer
                    {url}
                    showTopButton={false}
                    showButtons={[]}
                    scale={3}
                />
            {/key}
        {/if}
    </div>
</div>

<style lang="scss">
    .pdf-viewer-wrap {
        :global(.parent),
        :global(.control) {
            margin: 0;
            padding: 0;
        }

        :global(.parent) {
            width: 100% !important;
            overflow: hidden;
            min-width: 600px;

            :global(canvas) {
                width: 100% !important;
            }
        }
    }
</style>
