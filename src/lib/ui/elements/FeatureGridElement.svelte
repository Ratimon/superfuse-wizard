<script lang="ts">
    import type { Snippet } from 'svelte';

    import AbstractIcon from '$lib/ui/icons/AbstractIcon.svelte';

    type Props = {
        children: Snippet;
        title: string;
        path: string;
        iconName: string;
    }

    let {
        children,
        title='',
        path='',
        iconName=''
    }: Props = $props();

</script>


<a href={path} class="text-primary-400 stroke-current w-6 h-6 stroke-2 flex flex-col">

    <div class="mx-auto flex size-10 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-gray-100">
        <AbstractIcon name={iconName} width="24" height="24" />
    </div>

    <div class="mt-2 text-center">
        <div class="text-xl font-semibold text-gray-900">
            {title}
        </div>
        <div class="mt-2 text-lg leading-8">
            {@render children?.()}
        </div>
    </div>

</a>