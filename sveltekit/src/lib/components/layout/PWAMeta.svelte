<!-- SVELTE 4 - DON'T CHANGE IT! -->
<script lang="ts">
    import { onMount } from "svelte";
    // @ts-expect-error
    import { pwaInfo } from "virtual:pwa-info";

    onMount(async () => {
        if (pwaInfo) {
            const { registerSW } = await import("virtual:pwa-register");
            registerSW({
                immediate: true,
                onRegistered(r) {
                    console.log(`SW Registered: `, r);
                },
                onRegisterError(error) {
                    console.log("SW registration error", error);
                },
            });
        }
    });

    $: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : "";
</script>

<svelte:head>
    {@html webManifest}
</svelte:head>
