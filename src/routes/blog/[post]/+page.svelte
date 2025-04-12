<script lang="ts">
	import type { AuthorPresenter, CategoryPresenter, PostPresenter } from '../Blog.presenter';

	import {icons} from '$data/icon';
	import AbstractIcon from '$lib/ui/icons/AbstractIcon.svelte';

    import Avatar from '$lib/ui/blog/Avatar.svelte';
    import BadgeCategory from '$lib/ui/blog/BadgeCategory.svelte';
	import {categories, authors} from '../Blog.data'

	//refactor to store
	let { data } = $props();

    let postToDisplay: PostPresenter = $state({
		title: data.meta.title,
		slug: data.meta.slug,
		description: data.meta.description,
		date: data.meta.date,
		categories: data.meta.categories.map( (categoryString: string) => {
			return categories.find((category) => category.slug === categoryString)!;
		}),
		author: authors.find((author) => author.slug == data.meta.author)!,
		published: data.meta.published,
		imgSrc: data.meta.imgSrc,
		imgAlt: data.meta.imgAlt
	});


	$effect(() => {
		postToDisplay = {
			...data.meta,
			categories: data.meta.categories.map( (categoryString: string) => {
			return categories.find((category) => category.slug === categoryString)!;
		}),
			author: authors.find((author) => author.slug == data.meta.author)!
		}
	});


	let categoriesToLabel : CategoryPresenter[] = $state([]);

	$effect(() => {
		categoriesToLabel = postToDisplay.categories;
	});


	let allPosts : PostPresenter[] = $state([]);
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

	let postsRelated : PostPresenter[] = $state([]);
	$effect(() => {
		postsRelated = allPosts.filter(
      (a) =>
        a.slug !== data.slug &&
        a.categories.some((c) =>
			postToDisplay.categories.map((c) => c.slug).includes(c.slug)
        )
    )
    .sort(
      (a, b) =>
            new Date(b.date).valueOf() - new Date(a.date).valueOf()
        )
        .slice(0, 3);
	});

</script>

<!-- SEO -->
<svelte:head>
	<title>{data.meta.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
	<meta property="og:description" content={data.meta.description} />
</svelte:head>

<article>

	<div class="m-8">
		<a
			href="/blog"
			class="link !no-underline text-base-content/80 hover:text-base-content inline-flex items-center gap-1"
			title="Back to Blog"
		>
			<AbstractIcon name={icons.ArrowBack.name} width="20" height="20" />
			Back to Blog
		</a>
	</div>

	<article>
		<section class="mx-12 my-12 md:my-20 max-w-[800px]">

			<div class="flex items-center gap-4 mb-6">
				{#if categoriesToLabel}
					{#each categoriesToLabel as category}
						<BadgeCategory
							category={category}
							extraStyle={"!badge-lg"}
						/>
					{/each}
				{/if}

				<span class="text-base-content/80" itemProp="datePublished">
					{new Date(postToDisplay.date).toLocaleDateString("en-US", {
					  month: "long",
					  day: "numeric",
					  year: "numeric",
					})}
				</span>
			</div>

			<h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 md:mb-8">
				{postToDisplay.title}
			</h1>

			<p class="text-base-content/80 md:text-lg max-w-[700px]">
				{postToDisplay.description}
			</p>

		</section>
		<div class="flex flex-col md:flex-row">

			<section class="max-md:pb-4 md:pl-12 max-md:border-b md:border-l md:order-last md:w-72 shrink-0 border-base-content/10">
				<p class="text-base-content/80 text-sm mb-2 md:mb-3">
					Posted by
				</p>
				<Avatar post={postToDisplay} />

				{#if postsRelated}
					<div class="hidden md:block mt-12">
						<p class=" text-base-content/80 text-sm  mb-2 md:mb-3">
							Related reading
						</p>
						<div class="space-y-2 md:space-y-5">

							{#each postsRelated as post, i}
								<p class="mb-0.5">
									<a 
										href={`/blog/${post.slug}`}
										class="link link-hover hover:link-primary font-medium"
										title={post.title}
										rel="bookmark"
										>
										{post.title}
									</a>
								</p>
								<p class="text-base-content/80 max-w-full text-sm">
									{post.description}
								</p>
							{/each}
							
						</div>
					</div>
				{/if}
			</section>

			<section class="mx-32 w-full max-md:pt-4 md:pr-20 space-y-12 md:space-y-20">
				<div class="prose">
					<data.content></data.content>
				</div>
			</section>

		</div>
	</article>

</article>