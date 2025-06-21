<script lang="ts" module>
    import type { Snippet } from "svelte";
    import { slide } from "svelte/transition";

    export type TAccordionItemReturn = AccordionItem<TAccordionItem, boolean>;

    export interface IAccordionSnippetArguments {
        item: TAccordionItemReturn;
    }

    export type TAccordionPartSnippet = Snippet<[IAccordionSnippetArguments]>;

    export type TAccordionItem = {
        title: string | TAccordionPartSnippet;
        content: string | TAccordionPartSnippet;
        id: string;
    };

    export interface IAccordionProps {
        title?: TAccordionPartSnippet;
        content?: TAccordionPartSnippet;
        items: TAccordionItem[];
    }
</script>

<script lang="ts">
    import _ from "lodash";
    import { Accordion, type AccordionItem } from "melt/builders";

    let { title, content, items }: IAccordionProps = $props();

    const accordion = new Accordion();
</script>

<div {...accordion.root}>
    {#each items as i (i.id)}
        {@const item = accordion.getItem(i)}

        {#if _.isFunction(title)}
            {@render title({ item })}
        {:else if _.isFunction(item.item.title)}
            {@render item.item.title({ item })}
        {:else}
            <h2 {...item.heading}>
                <button {...item.trigger}>
                    {item.item.title}
                </button>
            </h2>
        {/if}

        {#if item.isExpanded}
            <div transition:slide={{ duration: 250 }}>
                {#if _.isFunction(item.item.content)}
                    {@render item.item.content({ item })}
                {:else if _.isFunction(content)}
                    {@render content({ item })}
                {:else}
                    <div {...item.content}>
                        {item.item.content}
                    </div>
                {/if}
            </div>
        {/if}
    {/each}
</div>
