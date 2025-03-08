<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { Action } from 'svelte/action';
  import type { Instance as TippyInstance } from 'tippy.js';
  import tippy from 'tippy.js';

  import { onMount } from 'svelte';

  type Props = {
    children: Snippet;
    caption: Snippet;
		text: string;
		disabled: boolean;

    interactive: boolean;
    placement: 'top' | 'bottom' | 'left' | 'right';
    theme: string;
    maxWidth: string;
    arrow: boolean;
    };
	
	let {
    children,
    caption,
		text = '',
		disabled = false,

    interactive = true,
    placement = 'right',
    theme = 'light-yellow border',
    maxWidth = '22em',
    arrow = false,
    ...rest 
  }: Props = $props();

  let target: Element | undefined;
  let content: HTMLElement | undefined = $state(undefined);
  let instance: TippyInstance | undefined;

  const trigger : Action = (node: Element) => { target = node; } ;

  onMount(() => {
    if (target) {
      instance = tippy(target, {  interactive, placement, theme, maxWidth,  ...rest, content });

      content?.style.removeProperty('display');
    }
  });

  $effect(() => {
		if (instance) {
      if (disabled) {
        instance.disable();
      } else {
        instance.enable();
      }
    }
	});
  
</script>

<div use:trigger>
  {@render children?.() }
</div>


<div style="display: none;" bind:this={content}>
  {@render caption?.()}
</div>
