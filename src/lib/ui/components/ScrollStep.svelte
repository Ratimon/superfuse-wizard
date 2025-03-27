<script lang="ts">
    import ScrollLink from '$lib/ui/header/ScrollLink.svelte';
    import type {Link } from '$lib/model/Link';


    type Props = {
        links: Link[];
        titleHighlighted: string;
    };

    let {
        links = [],
        titleHighlighted = ''
    }: Props = $props();

</script>


<nav class="flex justify-center my-4">
    <ul class="steps steps-vertical lg:steps-horizontal">

        {#each links as link}
            <ScrollLink
                class={`${link.title === titleHighlighted ? 'step step-primary' : 'step'}`}
                href={link.pathname}
            >
                {link.title}
            </ScrollLink>
        {/each}
  
    </ul>
  </nav>