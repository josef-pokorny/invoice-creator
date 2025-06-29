<script lang="ts">
    import InfoIcon from "@lucide/svelte/icons/info";
    import type { Snippet } from "svelte";
    import { fade } from "svelte/transition";

    import { m } from "$lib/paraglide/messages";
    import { useMessageStore } from "$lib/stores/message";

    import Button from "./form/Button.svelte";

    let {
        children,
        type = "primary",
        clossable,
        id,
    }: {
        children: Snippet;
        type?: "info" | "error" | "primary";
        clossable?: boolean;
        id?: string;
    } = $props();

    const messageState = useMessageStore({ key: id });

    let isClosed = $derived(id ? messageState.value.closed : false);

    function onClose() {
        if (id) messageState.value.closed = true;

        isClosed = true;
    }
</script>

{#if !isClosed}
    <div
        {id}
        class="card {type === 'info'
            ? 'preset-outlined-surface-500'
            : type === 'error'
              ? 'preset-outlined-error-500'
              : 'preset-outlined-primary-500'} grid grid-cols-[auto_1fr_auto] items-center gap-3 p-3"
        transition:fade={{ duration: 120 }}
    >
        <div class="flex items-center gap-3">
            {#if type === "info"}
                <InfoIcon class="stroke-surface-400 shrink-0" />
            {:else if type === "primary"}
                <InfoIcon class="stroke-primary-400 shrink-0" />
            {/if}
            <div>
                {@render children()}
            </div>
        </div>
        {#if clossable}
            <div class="flex gap-1">
                <Button
                    class="btn preset-tonal hover:preset-filled"
                    onclick={onClose}
                >
                    {m["actions.close"]()}
                </Button>
            </div>
        {/if}
    </div>
{/if}
