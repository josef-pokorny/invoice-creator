<script lang="ts" generics="T">
    import type { Snippet } from "svelte";
    import type { HTMLInputAttributes } from "svelte/elements";
    import { slide, type SlideParams } from "svelte/transition";
    import { type ClassNameValue, twMerge } from "tailwind-merge";

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
        containerClass?: ClassNameValue;
        id?: string;
        uncheckable?: boolean;
        groupLabel?: string;
        snippetRadio?: Snippet<[{ label?: string; value?: T }]>;
        transitionSettings?: SlideParams;
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
        transitionSettings,
    }: IProps = $props();
</script>

<div
    class="radiogroup flex flex-col {containerClass}"
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

            <div
                class="w-full py-1"
                transition:slide={{ duration: 200, ...transitionSettings }}
            >
                <fieldset class="flex items-center">
                    <div class="flex w-8">
                        <input
                            id={radioId}
                            checked={group === rest.value}
                            type="radio"
                            bind:group
                            aria-label={label}
                            {...rest}
                            class={twMerge("radio")}
                        />
                    </div>

                    {#if label}
                        {#if snippetRadio}
                            {@render snippetRadio({ label, value: rest.value })}
                        {:else}
                            <Label for={radioId} {label} />
                        {/if}
                    {/if}
                </fieldset>
            </div>
        {/each}
    {/if}

    {#if isErrorVisible}
        <Error id={id || ""} {error} />
    {/if}
</div>
