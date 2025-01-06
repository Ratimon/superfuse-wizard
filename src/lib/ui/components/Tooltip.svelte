<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { Action } from 'svelte/action';
  import type { Instance as TippyInstance } from 'tippy.js';
  import tippy from 'tippy.js';

  import { onMount } from 'svelte';

  type Props = {
    children: Snippet;
    caption: Snippet;
    // trigger: Snippet | (node: Element) => void;
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
    // trigger = (node: Element) => { target = node; },
		text = '',
		disabled = false,

    interactive = true,
    placement = 'right',
    theme = 'light-yellow border',
    maxWidth = '22em',
    arrow = false,
    ...others 
  }: Props = $props();

  // export let text = '';
  // export let disabled = false;

  let target: Element | undefined;
  let content: HTMLElement | undefined = $state(undefined);
  let instance: TippyInstance | undefined;

  const trigger : Action = (node: Element) => { target = node; } ;

  // function trigger(node: Element) {
	// 	target = node;
	// }


  onMount(() => {
    if (target) {
      instance = tippy(target, {  interactive, placement,theme, maxWidth,  ...others, content });
      // instance = tippy(target, { ...$$restProps, content });

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
  

  // $: {
  //   if (instance) {
  //     if (disabled) {
  //       instance.disable();
  //     } else {
  //       instance.enable();
  //     }
  //   }
  // }
</script>


<!-- {#snippet trigger(children:any)}
  {@render children?.()}
{/snippet} -->



<div  use:trigger>
  {@render children?.() }
</div>

<!-- <slot {trigger}></slot> -->

<div style="display: none;" bind:this={content}>
  <!-- <slot name="content">{text}</slot> -->
  <!-- <slot name="caption">{text}</slot> -->

  <!-- {#snippet caption(text:any)}
    {text}
	{/snippet} -->

  <!-- {@render caption?.(text)} -->
  {@render caption?.()}
</div>
