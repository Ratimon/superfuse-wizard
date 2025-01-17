<script lang="ts">
    import type {GithubRepo } from '$lib/model/GithubRepo';
  
    import Background from '$lib/ui/background/Background.svelte';

    import TimelineCheckPrimaryIcon from '$lib/ui/icons/TimelineCheckPrimaryIcon.svelte';
    import TimelineCheckIcon from '$lib/ui/icons/TimelineCheckIcon.svelte';
  
    import Stargazers from '$lib/ui/components/Stargazers.svelte';
    import ScrollLink from '$lib/ui/header/ScrollLink.svelte';
  
    export let repositories: GithubRepo[]= [
        {title: 'solady', owner : 'Vectorized', name: 'solady' },
        {title: 'OZ contract', owner : 'OpenZeppelin', name: 'openzeppelin-contracts' },
        {title: 'OZ Wizard', owner : 'OpenZeppelin', name: 'contracts-wizard' },
        {title: 'Redprint Wizard', owner : 'Ratimon', name: 'redprint-wizard' },
        {title: 'superfuse-forge', owner : 'Ratimon', name: 'redprint-forge' },
    ];
  
  </script>
  
  <Background color="bg-base-100">
    
    <section class="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-4 lg:py-10">
      
      <div class="flex flex-col gap-10 lg:gap-7 items-center justify-center text-center lg:text-left lg:items-start">
        
        <h1 class="font-bold text-3xl lg:text-5xl tracking-tight md:-mb-4 bg-gradient-to-r from-red-600 via-green-500 to-indigo-400 text-transparent bg-clip-text">
            Let superpower Superchain interoperability!
        </h1>

        <div class="flex flex-row gap-x-6 justify-center">

            <Stargazers
                title="superfuse-forge"
                owner="Ratimon"
                name="superfuse-forge"
            />

            <p class="text-base opacity-80 leading-relaxed">
                - <b>superfuse-forge</b> is a solidity-based framework/library to deploy Superchain standaed contracts in a modular style 
            </p>

        </div>

        <div class="flex flex-row gap-x-6 justify-center">

            <Stargazers
                title="Wizard"
                owner="Ratimon"
                name="superfuse-wizard"
            />

            <p class="text-base opacity-80 leading-relaxed">
                - <b>Superfuse Wizard</b>: an interactive <b>end-2-end</b> smart contract generator based on superchain standards eg. <b>ERC7802</b>.
            </p>

        </div>

        <ul class="timeline timeline-vertical lg:timeline-horizontal">
            <li>
                <ScrollLink
                    href="#0-install"
                    class="timeline-start timeline-box btn btn-primary btn-wide"
                >
                    Install superfuse-forge
                </ScrollLink>
                <div class="timeline-middle">
                <TimelineCheckIcon />
                </div>
                
                <hr />
            </li>
            
            <li>
                <hr />
                <div class="timeline-middle">
                <TimelineCheckPrimaryIcon />
                </div>
                <ScrollLink
                    href="#1-contract"
                    class="timeline-end timeline-box btn btn-primary btn-wide"
                >
                    <p class="font-semibold	 text-sm tracking-tight md:-mb-4 bg-gradient-to-r from-red-600 via-green-700 to-indigo-600 text-transparent bg-clip-text">
                        1: Start Build/Customize your Contract
                    </p>
                </ScrollLink>
                <hr />
            </li>

            <li>
                <hr/>
                <ScrollLink
                    href="#2-deploy"
                    class="timeline-start timeline-box btn btn-primary btn-wide"
                >
                    2: Run Generated Deployment Script
                </ScrollLink>
                <div class="timeline-middle">
                <TimelineCheckIcon />
                </div>
                <hr />
            </li>
            
            <li>
                <hr />
                <div class="timeline-middle">
                <TimelineCheckIcon />
                </div>
                <ScrollLink
                    href="#3-test"
                    class="timeline-end timeline-box btn btn-primary btn-wide"
                >
                    3: Run Generated Test Suites
                </ScrollLink>
                
            </li>
        </ul>

    
        <div class="flex flex-col md:flex-row gap-x-2 justify-center">

            <p class="text-lg opacity-80 leading-relaxed">
                "We are 100% open source and free to use. We acknowledge the advanced iniatiative from opensource repositories as following" 
            </p> 


            <div class="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 md:grid-cols-3">

                {#if repositories}
                    {#each repositories as repo}
                        <Stargazers
                        title={repo.title}
                        owner={repo.owner}
                        name={repo.name}>
                        </Stargazers>
                    {/each}
                {/if}

            </div>
  
  
        </div>


  
        <!-- <div class="flex flex-row gap-x-12 justify-center">
          <TestimonialsAvatars />
            <ScrollLink
              class='btn btn-secondary btn-wide'
              href="#testimonial"
            >
            Check out full testimonials!!
            </ScrollLink>
        </div>
   -->
  
      </div>
  
    </section>
  
</Background>