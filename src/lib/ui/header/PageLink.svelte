<script lang="ts">
    import type { Snippet } from 'svelte';

	import {page} from '$app/state';
	import {route, isParentRoute, isSameRoute} from '$lib/utils/path';


	type Props = {
		children: Snippet;
		href: string;
		class?: string;
		whenSelected?: string;
		whenUnselected?: string;
	}

	let {
		children,
		href = '',
		class: className = '',
		whenSelected = '',
		whenUnselected = ''
	} : Props = $props();

</script>

<a
	href={route(href)}
	class={`${className} ${
		(href === '/' ? isSameRoute(page.url.pathname, href) : isParentRoute(page.url.pathname, href))
			? whenSelected
			: whenUnselected
	}`}>{@render children?.()}</a
>
