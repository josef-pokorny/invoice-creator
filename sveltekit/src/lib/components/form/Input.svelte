<script lang="ts">
    import _ from "lodash";
    import type { Snippet } from "svelte";
    import type {
        HTMLAttributes,
        HTMLInputAttributes,
        HTMLTextareaAttributes,
    } from "svelte/elements";

    import type { IYupError } from "$lib/types/types";
    import { createId } from "$lib/utils";

    import Error from "./Error.svelte";
    import Label from "./Label.svelte";

    type TExdended = HTMLInputAttributes & HTMLTextareaAttributes;
    interface IProps extends Omit<TExdended, "prefix"> {
        label?: string;
        value?: string | number;
        type?: HTMLInputAttributes["type"] | "textarea";
        date?: string | Date;
        error?: IYupError;
        isErrorVisible?: boolean;
        suffix?: Snippet;
        prefix?: Snippet;
        containerProps?: HTMLAttributes<HTMLDivElement>;
        fieldsetProps?: HTMLAttributes<HTMLFieldSetElement>;
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
        prefix,
        containerProps,
        fieldsetProps,
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
    let hasPrefix = _.isFunction(prefix);
</script>

<fieldset class="w-full {fieldsetProps?.class}">
    {#if label}
        <Label for={id} {label} />
    {/if}

    <div
        class:contents={!hasSuffix && !hasPrefix}
        class="input-group flex w-full items-stretch {containerProps?.class}"
    >
        {#if prefix}
            {@render prefix()}
        {/if}

        {#if rest.type === "textarea"}
            <textarea
                {id}
                aria-errormessage="{id}-error"
                aria-invalid={!!error}
                {onchange}
                bind:value
                {...rest}
                class={"min-h-[2rem] flex-1 " +
                    (hasSuffix || hasPrefix ? "ig-input" : "input") +
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
                    (hasSuffix || hasPrefix ? "ig-input" : "input") +
                    " " +
                    rest.class}
            />
        {/if}

        {#if suffix}
            {@render suffix()}
        {/if}
    </div>

    {#if isErrorVisible}
        <Error id={id || ""} {error} />
    {/if}
</fieldset>
