<script lang="ts">
    import type { IYupError } from "$lib/types/types";

    let { error, id }: { error?: IYupError; id: string } = $props();
</script>

{#if error?.messages?.length}
    <div id="{id}-error" role="alert">
        {#each error.messages as message (id + message)}
            <p class="pl-2 text-[0.94rem] font-medium text-red-600">
                {message}
            </p>
        {/each}
    </div>
{/if}
