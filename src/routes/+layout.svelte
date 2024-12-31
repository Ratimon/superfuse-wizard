<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { PageData } from './$types';

    import type {Link } from '$lib/model/Link';

	import '../app.postcss';
	import {url} from '$lib/utils/path';
	import {appName, themeColor, appleStatusBarStyle} from 'web-config';

	import Background from '$lib/ui/background/Background.svelte';
	import Header from '$lib/ui/templates/Header.svelte';

	type Props = {
        children: Snippet;
		data: PageData;
    } & PageData;


	let { children, data }: Props = $props();

	const fallbackHeadLinks : Link[] = [
    {pathname: '/', title: 'Home', navType: 'tab'},
    ];

    const fallbackMenuTitle: string = 'Blog'

    const fallbackDropDownLinks : Link[] = [
    {pathname: '/blog/category/announcements', title: 'Announcements', navType: 'tab'},
    {pathname: '/blog/category/tutorials', title: 'Tutorials', navType: 'tab'},
    ];
	
</script>

<Background color='bg-base-200'>
	{#if data.headLinks && data.actionLink }
        <Header links={data.headLinks} menuTitle={data.menuTitle} dropDownLinks={data.dropDownLinks} actionLink={data.actionLink} ></Header>
    {:else}
        <Header links={fallbackHeadLinks} menuTitle={fallbackMenuTitle} dropDownLinks={fallbackDropDownLinks} actionLink={fallbackHeadLinks[0]} ></Header>
    {/if}
</Background>

{@render children()}
