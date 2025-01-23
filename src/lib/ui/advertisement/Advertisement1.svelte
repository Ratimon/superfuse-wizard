<script lang="ts">
    import TestimonialsAvatars from "$lib/ui/testimonials/TestimonialsAvatars.svelte";

    type Props = {
        landingTitle: string;
        landingSubtitle: string;
        landingAction: string;
        link: string;
    }

    let {
        landingTitle= '',
        landingSubtitle= '',
        landingAction= '',
        link= ''
    }: Props = $props();

    // let {
    //     landingTitle= 'Redprint Wizard',
    //     landingSubtitle= 'an interactive code generator for OPStack Developers.',
    //     landingAction= 'Build your own OPStack contracts!!',
    //     link= 'https://redprint.ninja/'
    // }: Props = $props();
    
</script>
  
<div class="container flex flex-col gap-4 p-8 mx-8">
    <div class="flex flex-col md:flex-row gap-x-6 justify-center items-center">

      <h2 class="font-semibold text-xl lg:text-2xl text-base-300 tracking-tight md:-mb-4">
        <div class="bg-gradient-to-r from-red-600 via-yellow-500 to-orange-400 text-transparent bg-clip-text" >{landingTitle}</div>: {landingSubtitle}
      </h2>
      
      <a
        class='btn btn-secondary btn-wide'
        href={link}
      >
        {landingAction}
      </a>

      <TestimonialsAvatars />
    </div>
</div>

<style lang="postcss">

    .container {
        background-color: var(--gray-1);
        border: 1px solid var(--gray-2);
        border-radius: 10px;
        min-width: 32rem;
    }
</style>