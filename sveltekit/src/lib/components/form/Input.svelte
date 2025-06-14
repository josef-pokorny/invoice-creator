<script lang="ts">
    import _ from "lodash";
    import type { Snippet } from "svelte";
    import type {
        HTMLInputAttributes,
        HTMLTextareaAttributes,
    } from "svelte/elements";

    import type { IYupError } from "$lib/types/types";
    import { createId } from "$lib/utils";

    import Error from "./Error.svelte";
    import Label from "./Label.svelte";

    type TExdended = HTMLInputAttributes & HTMLTextareaAttributes;
    interface IProps extends TExdended {
        label?: string;
        value?: string | number;
        type?: HTMLInputAttributes["type"] | "textarea";
        date?: string | Date;
        error?: IYupError;
        isErrorVisible?: boolean;
        suffix?: Snippet;
    }

    let {
        label,
        value = $bindable(""),
        date = $bindable(new Date()),
        onchange: onchangeProp,
        id = $bindable(createId()),
        error,
        isErrorVisible = true,
        suffix,
        ...rest
    }: IProps = $props();

    function onchange(
        e: Parameters<
            NonNullable<
                | HTMLInputAttributes["onchange"]
                | HTMLTextareaAttributes["onchange"]
            >
        >[0],
    ) {
        if (onchangeProp) onchangeProp(e as any);

        if (rest.type === "number") {
            const currentValue = Number(e.currentTarget.value);

            if (!e.currentTarget.value.length || !_.isNumber(currentValue)) {
                value = rest.min || 0;
            }

            if (_.isNumber(rest.min) && currentValue < rest.min) {
                value = rest.min;
            } else if (_.isNumber(rest.max) && currentValue > rest.max) {
                value = rest.max;
            }
        }
    }

    let hasSuffix = _.isFunction(suffix);
</script>

<fieldset class="w-full">
    {#if label}
        <Label for={id} {label} />
    {/if}

    <div
        class:contents={!hasSuffix}
        class="input-group flex w-full items-stretch"
    >
        {#if rest.type === "textarea"}
            <textarea
                {id}
                aria-errormessage="{id}-error"
                aria-invalid={!!error}
                {onchange}
                bind:value
                {...rest}
                class={"min-h-[2rem] flex-1 " +
                    (hasSuffix ? "ig-input" : "input") +
                    " " +
                    rest.class}
            ></textarea>
        {:else}
            <input
                {id}
                aria-errormessage="{id}-error"
                aria-invalid={!!error}
                {onchange}
                bind:value
                {...rest}
                class={"flex-1 " +
                    (hasSuffix ? "ig-input" : "input") +
                    " " +
                    rest.class}
            />
        {/if}

        {#if hasSuffix && suffix}
            {@render suffix()}
        {/if}
    </div>

    {#if isErrorVisible}
        <Error id={id || ""} {error} />
    {/if}
</fieldset>
