<script lang="ts">
    import type {Link } from '$lib/model/Link';

	import ScrollLink from '$lib/ui/header/ScrollLink.svelte';
    import PageLink from '$lib/ui/header/PageLink.svelte';

    type Props = {
        class?: string;
        tabClass?: string;
        whenSelected?: string;
        whenUnselected?: string;
        pages: Link[];
    };

	let {
        class: className = '',
        tabClass = '',
        whenSelected = '',
        whenUnselected = '',
        pages = []
    }: Props = $props();


</script>

<div class={`tabs ${className}`}>
	{#each pages as page}

        {#if page.navType == 'scroll'}
            <ScrollLink class={tabClass} {whenUnselected} {whenSelected} href={page.pathname}>
                {page.title}
            </ScrollLink>
        {:else}
            <PageLink class={tabClass} {whenUnselected} {whenSelected} href={page.pathname}>
                {page.title}
            </PageLink>
        {/if}

	{/each}
</div>
