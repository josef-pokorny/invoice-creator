<script lang="ts">
    import { page } from "$app/state";
    import { locales, localizeHref } from "$lib/paraglide/runtime";
</script>

<div style:display="none" aria-hidden="true">
    {#each locales as locale (locale)}
        <a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
    {/each}
</div>
