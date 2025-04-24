<script lang="ts">
    import type { ClassValue, HTMLInputAttributes } from "svelte/elements";
    import Error from "./Error.svelte";
    import type { IYupError } from "$lib/types/types";
    import { createId } from "$lib/utils";
    import Label from "./Label.svelte";
    import { m } from "$lib/paraglide/messages";

    type TExdended = HTMLInputAttributes;

    interface IRadio extends TExdended {
        label?: string;
    }

    interface IProps {
        radios?: IRadio[];
        group?: string;
        type?: HTMLInputAttributes["type"] | "textarea";
        date?: string | Date;
        error?: IYupError;
        isErrorVisible?: boolean;
        containerClass?: ClassValue;
        id?: string;
        uncheckable?: boolean;
        groupLabel?: string;
    }

    let {
        radios,
        group = $bindable(""),
        date = $bindable(new Date()),
        error,
        isErrorVisible = true,
        containerClass,
        id = createId(),
        uncheckable,
        groupLabel,
    }: IProps = $props();
</script>

<div
    class="radiogroup grid grid-cols-[auto_1fr] gap-x-2 gap-y-2 {containerClass}"
    role="radiogroup"
    aria-errormessage="{id}-error"
    aria-invalid={!!error}
    aria-label={groupLabel}
>
    {#if uncheckable}
        <input
            type="radio"
            id="{id}-none-radio"
            bind:group
            checked={group === ""}
            value=""
            class="radio"
        />
        <Label for="{id}-none-radio" label={m["form.none"]()} />
    {/if}
    {#if radios}
        {#each radios as { label, ...rest }}
            {@const radioId = createId("radio")}

            <input
                type="radio"
                id={radioId}
                bind:group
                checked={group === rest.value}
                {...rest}
                class={"radio " + rest.class}
            />
            {#if label}
                <Label for={radioId} {label} />
            {/if}
        {/each}
    {/if}

    {#if isErrorVisible}
        <Error id={id || ""} {error} />
    {/if}
</div>

<style lang="scss">
    .date-picker {
        :global(input[type="text"]) {
            @apply input;
        }

        :global(#datepicker-dropdown) {
            width: 100%;
            max-width: 350px;

            :global([role="grid"]) {
                width: 100%;
            }

            :global(.mt-4.flex.justify-between) {
                :global(button:nth-of-type(1)) {
                    @apply btn bg-primary-500 text-white;
                }
                :global(button:nth-of-type(2)) {
                    @apply btn;
                }
                :global(button:nth-of-type(3)) {
                    @apply btn bg-success-600 text-white;
                }
            }
        }
    }
</style>
