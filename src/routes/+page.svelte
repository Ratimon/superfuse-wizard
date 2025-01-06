<script  lang="ts">

import type {  DeployContract } from '$lib/wizard/deploy-scripts';
import { DeployBuilder, buildDeployGeneric } from '$lib/wizard/deploy-scripts';

import type { KindedOptions,Kind, OptionsErrorMessages } from '$lib/wizard/shared';
import {  sanitizeKind, OptionsError } from '$lib/wizard/shared';


import Background from '$lib/ui/background/Background.svelte';
import WizardSingleScript from '$lib/ui/components/WizardSingleScript.svelte';
import OverflowMenu from '$lib/ui/layouts/OverflowMenu.svelte';
import DeployControls from '$lib/ui/controls/DeployControls.svelte';

import MarkdownIt from "markdown-it";
import hljs  from '$lib/ui/utils/highlightjs';

// to do : optimize bundler
const md = MarkdownIt({
    html: true,
    linkify: true,
    highlight: function (str: string, lang: string) {
    // to do : refactor : hljs to specify language
    if (lang && hljs.getLanguage(lang)) {
    try {
        return hljs.highlight(str, { language: lang }).value;
    } catch (err) {
        // Handle error
        }
    }
    return '';
    }
});

export let initialContractTab: string | undefined = 'ERC20Votes';
export let contractTab: Kind = sanitizeKind(initialContractTab);

let deployScriptOpts: { [k in Kind]?: Required<KindedOptions [k]> } = {};

let errors: { [k in Kind]?: OptionsErrorMessages } = {};

let deployContract: DeployContract = new DeployBuilder('DeployERC20VotesScript');

$: opts = deployScriptOpts[contractTab];
$: {
if (opts) {
        try {
            deployContract = buildDeployGeneric(opts);
            errors[contractTab] = undefined;
        } catch (e: unknown) {
            if (e instanceof OptionsError) {
                errors[contractTab] = e.messages;
            } else {
            throw e;
            }
        }
    }
}


</script>


<div class="container flex flex-col gap-4 p-8 mx-8">

  <h2 class="m-4 font-semibold">
    Hello World!
  </h2>

</div>

<WizardSingleScript isShowingCommand={true} conventionNumber={'000'} initialContractTab={initialContractTab} contractTab={contractTab} opts={opts} deployContract={deployContract}>

    <!-- <div slot="menu" > -->
    {#snippet menu()}
      <div class="tab overflow-hidden">
        <Background color="bg-base-200">
          <OverflowMenu>
            <button class:selected={contractTab === 'ERC20Votes'} onclick={() => contractTab = 'ERC20Votes'}>
              ERC20Votes
            </button>      
          </OverflowMenu>
        </Background>
      </div>
    {/snippet}
    <!-- </div>  -->
  
    <!-- <div slot="control" > -->
    {#snippet control()}
         <!-- w-64 -->
        <div class="controls w-48 flex flex-col shrink-0 justify-between h-[calc(150vh-80px)] overflow-auto">
            <div class:hidden={contractTab !== 'ERC20Votes'}>
                <DeployControls bind:opts={deployScriptOpts.ERC20Votes} />
            </div>
        </div>
    {/snippet}
    <!-- </div> -->
    
    <!-- <div slot="artifact" > -->
    <!-- {#snippet artifact()}
  
      <div class="flex flex-col items-center">
        <p class="m-4 font-semibold">
          After running the deploy script, the address deployed is saved at <span class="underline bg-secondary">deployments/31337/.save.json</span>. Otherwise, as specified in <span class="underline bg-secondary">.env.&lt;network&gt;.local</span>.
        </p>
      
        <button class="btn modal-button" on:click={()=>isArtifactAllModalOpen = true}>See the artifact's content example</button>
      
        <div class="modal" class:modal-open={isArtifactAllModalOpen}>
          <div class="modal-box w-11/12 max-w-5xl">
      
            <form method="dialog">
              <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" on:click={()=>isArtifactStepAllModalOpen = false} >✕</button>
            </form>
      
            <h3 class="font-bold text-lg">Example!</h3>
            <p class="py-4"> Your saved address will be different. </p>
            <p class="py-4"> You can change <span class="underline bg-secondary">DEPLOYMENT_OUTFILE=deployments/31337/.save.json</span> to reflect yours!</p>
            <div class="output flex flex-col grow overflow-auto">
              <code class="hljs grow overflow-auto p-4">
                {@html md.render(addressStepAllContent)}
              </code>
            </div>
            <p class="py-4">click on ✕ button to close</p>
      
          </div>
        </div>
      </div>
  
    {/snippet} -->
    <!-- </div> -->
</WizardSingleScript>


<!-- <style lang="postcss">
    :global(html) {
        background-color: theme(colors.gray.100);
    }
</style> -->

<style lang="postcss">

  .container {
      background-color: var(--gray-1);
      border: 1px solid var(--gray-2);
      border-radius: 10px;
      min-width: 32rem;
  }

  .tab {
    color: var(--gray-5);
  }

  .tab button, :global(.overflow-btn) {
    padding: var(--size-1) var(--size-2);
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
  }

  .tab button, :global(.overflow-btn) {
    border: 0;
    background-color: transparent;
  }

  .tab button:hover, :global(.overflow-btn):hover {
    background-color: var(--gray-2);
  }

  .tab button.selected {
    background-color: var(--solidity-blue-2);
    color: white;
    order: -1;
  }

  :global(.overflow-menu) button.selected {
    order: unset;
  }

  .controls {
    background-color: white;
    padding: var(--size-4);
  }

  .controls {
    border-radius: 5px;
    box-shadow: var(--shadow);
  }
</style>