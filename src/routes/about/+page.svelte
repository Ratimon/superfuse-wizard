<script lang="ts">
	import CopyBlock from '$lib/ui/components/CopyBlock.svelte';
	// import Testimonial1Small from "$lib/ui/testimonials/Testimonial1Small.svelte";

	import {appName} from 'web-config';

</script>

<section class="py-2 px-4 text-center">
	<div class="max-w-auto md:max-w-lg mx-auto">

		<p class="!text-2xl flex justify-center space-x-2 font-black my-8">
			About {appName}
		</p>

		<p class="!text-xl flex justify-center space-x-2 my-8">
			We are engineering and product focused team with regenerative midset, pushing the envelope of Optimism ecosystems.
		</p>

        <p class="!text-xl flex justify-center space-x-2 my-8">
			We are the team behind Superfuse Wizard, an open-source code generator to build on Superchain.
		</p>

		<p class="mt-6 text-base-300">
			Report Bug at 
			<a class="underline" href="https://github.com/Ratimon/superfuse-wizard/issues" target="_blank" rel="noreferrer"
				>github</a
			>
		</p>

		<div class="pt-3 pb-4">
			<h1 class="m-4 font-semibold">Use it:</h1>
			<CopyBlock
				boxClass="p-2 rounded-box font-black text-primary max-w-xl mx-auto"
				class="mb-5"
				background="bg-primary-content"
				copiedBackground="bg-success"
				copiedColor="text-success-content"
				text={`npm add -D superfuse-wizard`}
			/>
			<p class="mt-6 text-base-300">
				Find out more on
				<a class="underline" href="https://github.com/Ratimon/superfuse-wizard" target="_blank" rel="noreferrer"
					>github</a
				>
			</p>
		</div>

        <p class="!text-xl flex justify-center space-x-2 my-8">
            We are also building superfuse-forge, a developer-friendly framework/library in solidity to build smart contracts with interoperability on Superchain.
		</p>

		<div class="pt-3 pb-4">
			<h1 class="m-4 font-semibold">Use it:</h1>
			<CopyBlock
				boxClass="p-2 rounded-box font-black text-primary max-w-xl mx-auto"
				class="mb-5"
				background="bg-primary-content"
				copiedBackground="bg-success"
				copiedColor="text-success-content"
				text={`npm add -D superfuse-forge`}
			/>
			<p class="mt-6 text-base-300">
				Find out more on
				<a class="underline" href="https://github.com/Ratimon/superfuse-forge" target="_blank" rel="noreferrer"
					>github</a
				>
			</p>
		</div>
		
		<!-- <Testimonial1Small
			quoteHighlighted={testimonial.quoteHighlighted}
			quoteDetail1={testimonial.quoteDetail1}
			quoteDetail2={testimonial.quoteDetail2}
			name={testimonial.name}
			bio={testimonial.bio}
			companyName={testimonial.companyName}
			companyLink={testimonial.companyLink}
			socialPlatform={testimonial.socialPlatform}
			socialAccount={testimonial.socialAccount}
			socialLink={testimonial.socialLink}
			bioImgPath={testimonial.bioImgPath}
			companyImgPath={testimonial.companyImgPath}
		>
		</Testimonial1Small> -->
       
	</div>
</section>