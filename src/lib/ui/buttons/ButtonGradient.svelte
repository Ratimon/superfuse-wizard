<script lang="ts">
    
  type Props = {
    title: string;
  }

  let {
    title : titleName
  }: Props = $props();

  const onClick = () => {};

</script>


<button class="btn btn-gradient animate-shimmer" onclick={() => onClick()}>
    {titleName}
</button>