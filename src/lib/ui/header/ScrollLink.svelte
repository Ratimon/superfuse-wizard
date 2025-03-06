<script lang="ts">
	import type { Snippet } from 'svelte';

	import {page} from '$app/state';
	import {isParentRoute, isSameRoute} from '$lib/utils/path';

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

	function preventDefault(fn: any) {
		return function (event: any) {
			event.preventDefault();
			fn.call(this, event);
		};
	}

    const handleAnchorClick =  (event: Event | undefined) => {
        if (!event) return;
		const target = event.currentTarget as HTMLTextAreaElement;
		const anchorId = target.getAttribute("href");
		const anchor = document.getElementById(anchorId!)
		window.scrollTo({
			top: anchor?.offsetTop,
			behavior: 'smooth'
		})
	}

</script>

<!-- to do : test this refactored part when scrolled component is added -->
<a
	href={href}
	onclick={preventDefault(handleAnchorClick)}
	class={`${className} ${
		(href === '/' ? isSameRoute(page.url.pathname, href) : isParentRoute(page.url.pathname, href))
			? whenSelected
			: whenUnselected
	}`}>{@render children?.()}</a
>