<!-- SVELTE 4 - DON'T CHANGE IT! -->
<script lang="ts">
    import { m } from "$lib/paraglide/messages";
    import { fade } from "svelte/transition";
    import { useRegisterSW } from "virtual:pwa-register/svelte";

    const intervalMS = 5 * 60 * 1000;

    const { needRefresh, updateServiceWorker, offlineReady } = useRegisterSW({
        onRegistered(r: any) {
            // uncomment following code if you want check for updates
            r &&
                setInterval(() => {
                    console.log("Checking for sw update");
                    r.update();
                }, intervalMS);
            console.log(`SW Registered: `, r);
        },
        onRegisterError(error: any) {
            console.log("SW registration error", error);
        },
    });
    const close = () => {
        needRefresh.set(false);
    };

    $: if ($needRefresh && $offlineReady) {
        console.log("SW automatically reloaded!");
        updateServiceWorker(true);
    }
</script>

{#if $needRefresh}
    <div
        class="pwa-toast card preset-outlined-surface-600 bg-surface-900 shadow"
        role="alert"
        transition:fade={{ duration: 150 }}
    >
        <div class="message">
            <span>
                {m["pwa.new-update"]()}
            </span>
        </div>

        <button
            class="btn preset-filled-success-500"
            on:click={() => updateServiceWorker(true)}
        >
            {m["pwa.reload"]()}
        </button>
        <button class="btn preset-tonal hover:preset-filled" on:click={close}>
            {m["actions.close"]()}
        </button>
    </div>
{/if}

<style lang="scss">
    .pwa-toast {
        position: fixed;
        left: 0;
        bottom: 0;
        margin: 16px;
        padding: 12px;
        border-radius: 4px;
        z-index: 2000;
        text-align: left;
        max-width: 400px;
    }
    .pwa-toast .message {
        margin-bottom: 8px;
    }
</style>
