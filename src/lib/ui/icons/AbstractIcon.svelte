<script lang="ts">
    import { icons } from '$data/icon';

    type Props = {
        name: string;
        class?: string;
        width: string;
        height: string;
        focusable?: string;
        stroke?: string;
    }

    let {
        class: className = '',
        name,
        width = '24',
        height = '24',
        focusable = 'false',
        stroke = ''
    }: Props = $props();

    const iconsInArray = Object.values(icons).map(({ name, box, svg }) => ({
        name,
        ...(box !== undefined && { box }), // Preserve box only if it exists
        svg
    }));

    let iconsDisplayed = iconsInArray.find((icon: any) => icon.name === name);

</script>

{#if iconsDisplayed}
    <svg
        class={className}
        {focusable}
        {width}
        {height}
        viewBox="0 0 {iconsDisplayed.box} {iconsDisplayed.box}"
        stroke={stroke}
    >
        {@html iconsDisplayed.svg }
    </svg>
{/if}