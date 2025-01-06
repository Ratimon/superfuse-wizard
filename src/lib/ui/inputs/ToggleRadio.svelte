<script lang="ts">
  type T = $$Generic;

  type Props = {
    value: false | T;
    checked: boolean;
    defaultValue: T;
    disabled: boolean | undefined;
  };

  let {
    value = $bindable(),
    checked = value !== false,
    defaultValue,
    disabled = undefined,
  }: Props = $props();
  
  let wasChecked = checked;
  let wasValue = value || defaultValue;

  $effect(() => {
    if (!wasChecked) {
      if (checked) {
        value = wasValue;
      } else if (value !== false) {
        checked = true;
      }
    } else if (!checked) {
      value = false;
    } else if (value === false) {
      checked = false;
    }

    wasChecked = checked;
    wasValue = value || wasValue;
  });
</script>

<input type="checkbox" bind:checked {disabled}>
