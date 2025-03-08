<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Popover as PopoverPrimitive } from "bits-ui"
  import { cn, flyAndScale } from '$lib/ui/utils/mics'

  type $$Props = PopoverPrimitive.ContentProps

  type Props = {
    children?: Snippet;
    transition?: $$Props['transition'];
    transitionConfig?: $$Props['transitionConfig'];
    class?: $$Props['class'];
  }

  let {
    children,
    transition = flyAndScale,
    transitionConfig = undefined,
    class: className = undefined,
    ...rest
  }: Props = $props();


</script>

<PopoverPrimitive.Content
  {transition}
  {transitionConfig}
  class={cn('z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none', className)}
  {...rest}
>
  {@render children?.()}
</PopoverPrimitive.Content>
