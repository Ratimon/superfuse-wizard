<script lang="ts">
    import '../../app.postcss';
	import type { AuthorPresenter, CategoryPresenter, PostPresenter } from './Blog.presenter'
	import {categories, authors} from './Blog.data'
	import {appName} from 'web-config';

	import CardArticle from '$lib/ui/blog/CardArticle.svelte';
	import CardCategory from '$lib/ui/blog/CardCategory.svelte';

	// to do: add testimonials
	// import Testimonials3 from "$lib/ui/testimonials/Testimonials3.svelte";
	
	let { data } = $props();
	let allPosts : PostPresenter[]= $state([]);

	$effect(() => {
		allPosts = data.posts.map( post => {

		const cachedCategories : CategoryPresenter[] = post.categories.map( categoryString => {
			return categories.find((category) => category.slug === categoryString)!;
		} );

		const cachedAuthor : AuthorPresenter = authors.find((author) => author.slug == post.author)!;

		return {
            ...post,
            categories: cachedCategories,
				author: cachedAuthor
			};
		});
	});

	let postsSortedByLatest : PostPresenter[] = $state([]);

	$effect(() => {
		postsSortedByLatest = allPosts.sort(
			(a, b) =>
				new Date(b.date).valueOf() - new Date(a.date).valueOf()
		)
      	.slice(0, 6);
	});


</script>

<section class="text-center max-w-xl mx-auto mt-12 mb-24 md:mb-32">
	<h1 class="font-extrabold text-3xl lg:text-5xl tracking-tight mb-6">
	  The Official {appName} Blog
	</h1>
	<p class="text-lg opacity-80 leading-relaxed">
		Updates, stories, and announcements from the {appName} team.
	</p>
</section>


<section class="grid lg:grid-cols-2 mb-24 md:mb-32 gap-8">
	{#each postsSortedByLatest as post, i}
		<CardArticle
			post={post}
			showCategory={true}
		></CardArticle>
	{/each}
</section>

<section>
	<p class="font-bold text-2xl lg:text-4xl tracking-tight text-center mb-8 md:mb-12">
		Browse articles by category
	</p>

	<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
		{#each categories as category, i}
			<CardCategory
				category={ category}
			></CardCategory>
		{/each}
	</div>

</section>
<!-- <Testimonials3></Testimonials3> -->