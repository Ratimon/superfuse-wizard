<script  lang="ts">

  import type {  DeployContract } from '$lib/wizard/deploy-scripts';
  import { DeployBuilder, buildDeployGeneric } from '$lib/wizard/deploy-scripts';

  import type { KindedOptions, Kind, OptionsErrorMessages } from '$lib/wizard/shared';
  import {  sanitizeKind, OptionsError } from '$lib/wizard/shared';

  import CopyBlock from '$lib/ui/components/CopyBlock.svelte';
  import Background from '$lib/ui/background/Background.svelte';
  import WizardSingleScript from '$lib/ui/components/WizardSingleScript.svelte';
  import OverflowMenu from '$lib/ui/layouts/OverflowMenu.svelte';
  import DeployControls from '$lib/ui/controls/DeployControls.svelte';

  let initialContractTab: string | undefined = $state('ERC20Votes');
  let contractTab: Kind = $derived(sanitizeKind(initialContractTab));
  let allOpts: { [k in Kind]?: Required<KindedOptions [k]> } =  $state({});
  let errors : { [k in Kind]?: OptionsErrorMessages } =  $state({});
  let deployContract: DeployContract = $state(new DeployBuilder('DeployERC20VotesScript'));


  const optsDeploy = $derived(allOpts[contractTab]);

  const conventionNumber = $state('000');
  const deployCommand = $derived(`forge script script/${conventionNumber}_${deployContract.name}.s.sol --trezor --sender <DEPLOYER_ADDRESS> --rpc-url <RPC_URL> --broadcast`)
  const mnemonicCommand = $state(`--mnemonic-derivation-paths \"m/44'/60'/0'/0/0\"`)

  $effect(() => {
    if (optsDeploy) {
          try {
              deployContract = buildDeployGeneric(optsDeploy);

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

<WizardSingleScript conventionNumber={conventionNumber} initialContractTab={initialContractTab} contractTab={contractTab} opts={optsDeploy} deployContract={deployContract}>

    {#snippet guide()}
      <div class="pt-3 pb-4 justify-center">
        <h2 class="m-4 font-semibold">In your terminal, copy below contracts' codes and run deployment scripts to your prefered network:</h2>
        <CopyBlock
          boxClass="p-2 rounded-box font-black text-primary max-w-full mx-auto text-center"
          class="mb-5"
          background="bg-primary-content"
          copiedBackground="bg-success"
          copiedColor="text-success-content"
          text={deployCommand}
        />
      </div>

      <div class="pt-3 pb-4 justify-center">
        <h2 class="m-4 font-semibold">(Optional), you can specify your derivation path:</h2>
        <CopyBlock
          boxClass="p-2 rounded-box font-black text-primary max-w-full mx-auto text-center"
          class="mb-5"
          background="bg-primary-content"
          copiedBackground="bg-success"
          copiedColor="text-success-content"
          text={mnemonicCommand}
        />
      </div>
      
    {/snippet}

    {#snippet menu()}
      <div class="tab overflow-hidden">
        <Background color="bg-base-200">
          <OverflowMenu>
            <button class:selected={contractTab === 'ERC20Votes'} onclick={() => initialContractTab = 'ERC20Votes'}>
              ERC20Votes
            </button>      
          </OverflowMenu>
        </Background>
      </div>
    {/snippet}

    {#snippet control()}
        <div class="controls w-64 flex flex-col shrink-0 justify-between h-[calc(150vh-80px)] overflow-auto">
            <div class:hidden={contractTab !== 'ERC20Votes'}>
                <DeployControls bind:opts={allOpts.ERC20Votes!} />
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