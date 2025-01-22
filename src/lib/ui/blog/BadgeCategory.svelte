<script lang="ts">
	import type { CategoryPresenter } from '../../../routes/blog/Blog.presenter'

    type Props = {
        category: CategoryPresenter;
        extraStyle: string;
    }

    let {
        category,
        extraStyle=''
    }: Props = $props();

</script>

<a
    href={`/blog/category/${category.slug}`}
    class={`badge badge-sm md:badge-md hover:badge-primary ${
        extraStyle ? extraStyle : ""
      }`}
    title={`Posts in ${category.title}`}
    rel="tag">

    <!-- <slot /> -->
    {category.titleShort}

</a>