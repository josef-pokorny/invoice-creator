<script lang="ts">
    import { useRegisterSW } from "virtual:pwa-register/svelte";

    const { needRefresh, updateServiceWorker, offlineReady } = useRegisterSW({
        onRegistered(r: any) {
            // uncomment following code if you want check for updates
            // r &&
            //     setInterval(() => {
            //         console.log("Checking for sw update");
            //         r.update();
            //     }, intervalMS);
            console.log(`SW Registered: `, r);
        },
        onRegisterError(error: any) {
            console.log("SW registration error", error);
        },
    });
    const close = () => {
        offlineReady.set(false);
        needRefresh.set(false);
    };
    $: toast = $offlineReady || $needRefresh;
</script>

{#if toast}
    <div
        class="pwa-toast card preset-outlined-surface-500 bg-surface-900"
        role="alert"
    >
        <div class="message">
            {#if $offlineReady}
                <span> App ready to work offline </span>
            {:else}
                <span>
                    New content available, click on reload button to update.
                </span>
            {/if}
        </div>
        {#if $needRefresh}
            <button
                class="btn preset-filled-success-500 hover:preset-filled"
                on:click={() => updateServiceWorker(true)}
            >
                Reload
            </button>
        {/if}
        <button class="btn preset-tonal hover:preset-filled" on:click={close}>
            Close
        </button>
    </div>
{/if}

<style lang="scss">
    .pwa-toast {
        position: fixed;
        right: 0;
        bottom: 0;
        margin: 16px;
        padding: 12px;
        border-radius: 4px;
        z-index: 2;
        text-align: left;
        box-shadow: 3px 4px 5px 0 #8885;
    }
    .pwa-toast .message {
        margin-bottom: 8px;
    }
</style>
