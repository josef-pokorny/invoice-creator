<!-- 

Copied from https://github.com/TanStack/query/blob/svelte-5-adapter/packages/svelte-query-persist-client/src/PersistQueryClientProvider.svelte

-->

<script lang="ts">
    import {
        type PersistQueryClientOptions,
        persistQueryClientRestore,
        persistQueryClientSubscribe,
    } from "@tanstack/query-persist-client-core";
    import type {
        OmitKeyof,
        QueryClientProviderProps,
    } from "@tanstack/svelte-query";
    import {
        QueryClientProvider,
        setIsRestoringContext,
    } from "@tanstack/svelte-query";

    import { box } from "./utils.svelte";

    type PersistQueryClientProviderProps = QueryClientProviderProps & {
        persistOptions: OmitKeyof<PersistQueryClientOptions, "queryClient">;
        onSuccess?: () => void;
        onError?: () => void;
    };

    let {
        client,
        children,
        persistOptions,
        ...props
    }: PersistQueryClientProviderProps = $props();

    let isRestoring = box(true);

    setIsRestoringContext(isRestoring);

    const options = $derived({
        ...persistOptions,
        queryClient: client,
    });

    $effect(() => {
        return isRestoring.current
            ? () => {}
            : persistQueryClientSubscribe(options);
    });

    $effect(() => {
        isRestoring.current = true;
        persistQueryClientRestore(options)
            .then(() => props.onSuccess?.())
            .catch(() => props.onError?.())
            .finally(() => {
                isRestoring.current = false;
            });
    });

    // $inspect({ isRestoring });
</script>

<QueryClientProvider {client} {...props}>
    {@render children()}
</QueryClientProvider>
