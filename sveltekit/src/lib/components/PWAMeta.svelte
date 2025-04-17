<!-- SVELTE 4 - DON'T CHANGE IT! -->
<script lang="ts">
    import { onMount } from "svelte";
    // @ts-expect-error
    import { pwaInfo } from "virtual:pwa-info";

    const intervalMS = 30 * 60 * 1000;

    onMount(async () => {
        if (pwaInfo) {
            const { registerSW } = await import("virtual:pwa-register");
            registerSW({
                immediate: true,
                onRegistered(r) {
                    // uncomment following code if you want check for updates
                    r &&
                        setInterval(() => {
                            console.log("Checking for sw update");
                            r.update();
                        }, intervalMS);
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
