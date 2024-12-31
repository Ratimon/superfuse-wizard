<script lang="ts">
    import type { Snippet } from 'svelte';
    // let colorName: string;
    // export {colorName as color};

    type Props = {
        children: Snippet;
        color: string;
    }

    let {
        children,
        color: colorName = 'bg-base-200'
    }: Props = $props();
    
  </script>
  
  <div class={`${colorName}`}>
      {@render children?.()}
  </div>