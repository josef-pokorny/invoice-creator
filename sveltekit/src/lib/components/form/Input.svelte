<script lang="ts">
    import { isNumber } from "lodash-es";
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
    }

    let {
        label,
        value = $bindable(""),
        date = $bindable(new Date()),
        onchange: onchangeProp,
        id = $bindable(createId()),
        error,
        isErrorVisible = true,
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

            if (!e.currentTarget.value.length || !isNumber(currentValue)) {
                value = rest.min || 0;
            }

            if (isNumber(rest.min) && currentValue < rest.min) {
                value = rest.min;
            } else if (isNumber(rest.max) && currentValue > rest.max) {
                value = rest.max;
            }
        }
    }
</script>

<fieldset class="label">
    {#if label}
        <Label for={id} {label} />
    {/if}

    {#if rest.type === "textarea"}
        <textarea
            {id}
            aria-errormessage="{id}-error"
            aria-invalid={!!error}
            {onchange}
            bind:value
            {...rest}
            class={"input min-h-[2rem] " + rest.class}
        ></textarea>
    {:else}
        <input
            {id}
            aria-errormessage="{id}-error"
            aria-invalid={!!error}
            {onchange}
            bind:value
            {...rest}
            class={"input " + rest.class}
        />
    {/if}

    {#if isErrorVisible}
        <Error id={id || ""} {error} />
    {/if}
</fieldset>
