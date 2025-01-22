<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { PageData } from './$types';

    import type {Link } from '$lib/model/Link';

	import '../app.postcss';
	import {url} from '$lib/utils/path';
	import {appName, themeColor, appleStatusBarStyle} from 'web-config';

	import { PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID } from '$env/static/public'

	import { MetaTags } from 'svelte-meta-tags';
	import {page} from '$app/state';
    import extend from 'just-extend';


	import Background from '$lib/ui/background/Background.svelte';
	import Header from '$lib/ui/templates/Header.svelte';
	import Footer from '$lib/ui/templates/Footer.svelte';
	import GaAnalytics from '$lib/analytics/GaAnalytics.svelte';

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
    {pathname: '/blog/category/reports', title: 'Report Hub', navType: 'tab'},
    ];

	// only 'tab'
	const fallbackFootLinks : Link[] = [
    {pathname: '/', title: 'Home', navType: 'tab'},
    {pathname: '/blog/1-introduce-superfuse', title: 'Introduce Superfuse', navType: 'tab'},
    ];

    // $: metaTags = extend(true, {}, data.baseMetaTags, data.pageMetaTags);
	const metaTags = $derived(extend(true, {}, data.baseMetaTags, data.pageMetaTags));

	let MEASUREMENT_ID = PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID;
	
</script>

<MetaTags
    {...metaTags}
    
    additionalLinkTags={[
        {
        rel: 'icon',
        href: url('/pwa/favicon.svg'),
        },
        {
        rel: 'icon',
        href: url('/pwa/favicon.svg'),
        sizes: "any" //  32×32
        },
        {
        rel: 'apple-touch-icon',
        href: url('/pwa/apple-touch-icon.png')
        },
        {
        rel: 'manifest',
        href: url('/pwa/manifest.webmanifest')
        }
    ]}

    additionalMetaTags={[
        // extra info
        {
        name: "theme-color",
        content: themeColor
        },
        {
        name: 'mobile-web-app-capable',
        content: 'yes'
        },
        {
        name: 'application-name',
        content: appName
        },
        // apple
        {
        name: "apple-mobile-web-app-capable",
        content: 'yes'
        },
        {
        name: 'apple-mobile-web-app-status-bar-style',
        content: appleStatusBarStyle
        },
        {
        name: 'apple-mobile-web-app-title',
        content: appName
        }
    ]}
    >
</MetaTags>

<Background color='bg-base-200'>
	{#if page.data.headLinks && page.data.actionLink }
        <Header links={page.data.headLinks} menuTitle={page.data.menuTitle} dropDownLinks={page.data.dropDownLinks} actionLink={page.data.actionLink} ></Header>
    {:else}
        <Header links={fallbackHeadLinks} menuTitle={fallbackMenuTitle} dropDownLinks={fallbackDropDownLinks} actionLink={fallbackHeadLinks[0]} ></Header>
    {/if}
</Background>

{@render children()}

<Background color='bg-base-200'>
	{#if page.data.footLinks}
		<Footer links={page.data.footLinks}></Footer>
	{:else}
		<Footer links={fallbackFootLinks}></Footer>
	{/if}
</Background>

<GaAnalytics {MEASUREMENT_ID} />