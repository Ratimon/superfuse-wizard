<script  lang="ts">

import type {  DeployContract } from '$lib/wizard/deploy-scripts';
import { DeployBuilder, buildDeployGeneric } from '$lib/wizard/deploy-scripts';

import type { KindedOptions, Kind, OptionsErrorMessages } from '$lib/wizard/shared';
import {  sanitizeKind, OptionsError } from '$lib/wizard/shared';

import Background from '$lib/ui/background/Background.svelte';
import WizardSingleScript from '$lib/ui/components/WizardSingleScript.svelte';
import OverflowMenu from '$lib/ui/layouts/OverflowMenu.svelte';
import DeployControls from '$lib/ui/controls/DeployControls.svelte';

type Props = {
    initialContractTab: string | undefined ;
    contractTab: Kind;
    deployScriptOpts: { [k in Kind]?: Required<KindedOptions [k]> };
    errors: { [k in Kind]?: OptionsErrorMessages };
    deployContract: DeployContract;
  };


let {
  initialContractTab = 'ERC20Votes',
  contractTab = sanitizeKind(initialContractTab),
  deployScriptOpts = {},
  errors = {},
  deployContract = new DeployBuilder('DeployERC20VotesScript'),
}: Props = $props();

let opts: KindedOptions | undefined = $state(undefined);

$effect(() => {
  const opts = deployScriptOpts[contractTab];
});

$effect(() => {
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
});

</script>


<div class="container flex flex-col gap-4 p-8 mx-8">

  <h2 class="m-4 font-semibold">
    Hello World!
  </h2>

</div>

<WizardSingleScript isShowingCommand={true} conventionNumber={'000'} initialContractTab={initialContractTab} contractTab={contractTab} opts={opts} deployContract={deployContract}>

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
  
    {#snippet control()}
        <div class="controls w-64 flex flex-col shrink-0 justify-between h-[calc(150vh-80px)] overflow-auto">
            <div class:hidden={contractTab !== 'ERC20Votes'}>
                <DeployControls bind:opts={deployScriptOpts.ERC20Votes} />
            </div>
        </div>
    {/snippet}
    
</WizardSingleScript>


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