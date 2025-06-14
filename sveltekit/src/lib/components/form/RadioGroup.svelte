<script lang="ts" generics="T">
    import type { Snippet } from "svelte";
    import type { ClassValue, HTMLInputAttributes } from "svelte/elements";

    import { m } from "$lib/paraglide/messages";
    import type { IYupError } from "$lib/types/types";
    import { createId } from "$lib/utils";

    import Error from "./Error.svelte";
    import Label from "./Label.svelte";

    interface IRadio extends HTMLInputAttributes {
        label?: string;
        value?: T;
    }

    interface IProps {
        radios?: IRadio[];
        group?: string;
        type?: HTMLInputAttributes["type"] | "textarea";
        error?: IYupError;
        isErrorVisible?: boolean;
        containerClass?: ClassValue;
        id?: string;
        uncheckable?: boolean;
        groupLabel?: string;
        snippetRadio?: Snippet<[{ label?: string; value?: T }]>;
    }

    let {
        radios,
        group = $bindable(""),
        error,
        isErrorVisible = true,
        containerClass,
        id = createId(),
        uncheckable,
        groupLabel,
        snippetRadio,
    }: IProps = $props();
</script>

<div
    class="radiogroup flex flex-col gap-2 {containerClass}"
    aria-errormessage="{id}-error"
    aria-invalid={!!error}
    aria-label={groupLabel}
    role="radiogroup"
>
    {#if uncheckable}
        <input
            id="{id}-none-radio"
            class="radio"
            checked={group === ""}
            type="radio"
            value=""
            bind:group
        />
        <Label for="{id}-none-radio" label={m["form.none"]()} />
    {/if}
    {#if radios}
        {#each radios as { label, ...rest } (label)}
            {@const radioId = createId("radio")}

            <fieldset class="flex items-center gap-2">
                <input
                    id={radioId}
                    checked={group === rest.value}
                    type="radio"
                    bind:group
                    aria-label={label}
                    {...rest}
                    class={"radio " + rest.class}
                />

                {#if label}
                    {#if snippetRadio}
                        {@render snippetRadio({ label, value: rest.value })}
                    {:else}
                        <Label for={radioId} {label} />
                    {/if}
                {/if}
            </fieldset>
        {/each}
    {/if}

    {#if isErrorVisible}
        <Error id={id || ""} {error} />
    {/if}
</div>
