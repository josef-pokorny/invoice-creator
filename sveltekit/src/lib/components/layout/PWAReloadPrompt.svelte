<!-- SVELTE 4 - DON'T CHANGE IT! -->
<script lang="ts">
    import { fade } from "svelte/transition";
    import { useRegisterSW } from "virtual:pwa-register/svelte";

    import { m } from "$lib/paraglide/messages";

    const intervalMS = 30 * 60 * 1000;

    const { needRefresh, offlineReady, updateServiceWorker } = useRegisterSW({
        onRegistered(r: any) {
            // uncomment following code if you want check for updates

            r &&
                setInterval(async () => {
                    console.log("Checking for sw update");
                    await r.update();
                    updateServiceWorker(false);
                }, intervalMS);
            console.log(`SW Registered: `, r);
        },
        onRegisterError(error: any) {
            console.log("SW registration error", error);
        },
    });
    const close = () => {
        needRefresh.set(false);
        offlineReady.set(false);
    };
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
            type="button"
            on:click={() => updateServiceWorker(true)}
        >
            {m["pwa.reload"]()}
        </button>
        <button
            class="btn preset-tonal hover:preset-filled"
            type="button"
            on:click={close}
        >
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
