<script lang="ts">
	// based on https://github.com/skeletonlabs/skeleton/blob/58d9780dafd4a7ca04b1086a30aac8c0dc3ce416/src/lib/utilities/CodeBlock/CodeBlock.svelte

	import {clipboard} from '$lib/ui/utils/clipboard';

	type Props = {
		text: string;
		background: string;
		copiedBackground: string;
		boxClass: string;
        class?: string;
		copiedColor: string;
		// copied : any;
    };
	

	let {
		text = '',
		background = '',
		copiedBackground = '',
		boxClass = '',
        class: className = '',
		copiedColor = '',
    }: Props = $props();


	// Local
	let copyState = $state(false);

	function onCopyClick() {
		copyState = true;
		setTimeout(() => {
			copyState = false;
		}, 1000);

	}


</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	role="button"
	tabindex="0"
	class={`${boxClass} ${copyState ? copiedBackground : background}`}
	oncopied={onCopyClick}
	use:clipboard={text}
>
	{#if copyState}
		<code class={`${className} ${copiedColor}`}>Copied ✓</code>
	{:else}
		<code class={className}>{text}</code>
	{/if}
</div>