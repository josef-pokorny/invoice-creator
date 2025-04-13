<script lang="ts">
    import _ from "lodash";
    import type { HTMLInputAttributes } from "svelte/elements";

    interface IProps extends HTMLInputAttributes {
        label?: string;
        value?: string | number;
    }

    let { label, value = $bindable(""), ...rest }: IProps = $props();

    const id = _.uniqueId("input_") + Math.random();

    function onchange(
        e: Parameters<NonNullable<HTMLInputAttributes["onchange"]>>[0],
    ) {
        if (rest.onchange) rest.onchange(e);

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
</script>

<fieldset class="label">
    {#if label}
        <label for={id} class="label-text text-surface-100 text-[0.9rem]">
            {label}
        </label>
    {/if}
    <input {id} bind:value {...rest} class={"input " + rest.class} {onchange} />
</fieldset>
