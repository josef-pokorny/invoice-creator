<script lang="ts">
    import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
    import { QueryClient } from "@tanstack/svelte-query";
    import type { Snippet } from "svelte";

    import { browser } from "$app/environment";

    import SvelteQueryDevtools from "../devtools/SvelteQueryDevtools.svelte";
    import PersistQueryClientProvider from "../persister/PersistQueryClientProvider.svelte";

    let { children }: { children: Snippet } = $props();

    const persister = createSyncStoragePersister({
        storage: browser ? window.localStorage : undefined,
    });

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { staleTime: 10 * 60 * 1000 },
        },
    });
</script>

<PersistQueryClientProvider
    client={queryClient}
    persistOptions={{ persister, maxAge: 300 * 24 * 60 * 60 * 1000 }}
    onError={() => console.log("tankstack error")}
>
    <SvelteQueryDevtools position="top" buttonPosition="top-right" />

    {@render children()}
</PersistQueryClientProvider>
