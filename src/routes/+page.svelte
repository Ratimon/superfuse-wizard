<script  lang="ts">
  import type { PageData } from './$types';

  import type {  DeployContract } from '$lib/wizard/deploy-scripts';
  import { DeployBuilder, buildDeployGeneric } from '$lib/wizard/deploy-scripts';

  import type { Contract } from '$lib/wizard/smart-contracts';
  import { ContractBuilder, buildContractGeneric } from '$lib/wizard/smart-contracts';

  import type { TestContract } from '$lib/wizard/test-suites';
  import { TestBuilder, buildTestGeneric } from '$lib/wizard/test-suites';

  import type { KindedOptions, Kind, OptionsErrorMessages } from '$lib/wizard/shared';
  import {  sanitizeKind, OptionsError } from '$lib/wizard/shared';

  import ScrollStep from '$lib/ui/templates/ScrollStep.svelte';
  import CopyBlock from '$lib/ui/components/CopyBlock.svelte';
  import Background from '$lib/ui/background/Background.svelte';
  import WizardSingle from '$lib/ui/components/WizardSingle.svelte';
  import OverflowMenu from '$lib/ui/layouts/OverflowMenu.svelte';
  import ERC20VotesContractControls from '$lib/ui/controls/ERC20VotesContractControls.svelte';
  import ERC20VotesDeployControls from '$lib/ui/controls/ERC20VotesDeployControls.svelte';
  import ERC20VotesTestControls from '$lib/ui/controls/ERC20VotesTestControls.svelte';

  type Props = {
	  data: PageData;
  } & PageData;

	let { data }: Props = $props();

  const stepLinks  = data.dropDownLinks;

  let initialContractTab: string | undefined = $state('ERC20Votes');
  let contractTab: Kind = $derived(sanitizeKind(initialContractTab));
  let allOpts: { [k in Kind]?: Required<KindedOptions [k]> } =  $state({});
  let errors : { [k in Kind]?: OptionsErrorMessages } =  $state({});

  let contract: Contract = $state(new ContractBuilder('ERC20Votes'));
  let deployContract: DeployContract = $state(new DeployBuilder('DeployMyERC20VotesScript'));
  let testContract: TestContract = $state(new TestBuilder('TestMyERC20VotesScript'));

  const opts = $derived(allOpts[contractTab]);

  const conventionNumber = $state(`001`);
  let deployCommand = $state(`forge script script/001_DeployMyERC20VotesScript.s.sol --trezor --sender <DEPLOYER_ADDRESS> --rpc-url <RPC_URL> --broadcast`)
  let walletCommand = $state(`--mnemonic-derivation-paths \"m/44'/60'/0'/0/0\"`)
  

  $effect(() => {
    if (opts) {
          try {
              deployCommand = `forge script script/${conventionNumber}_${deployContract.name}.s.sol --trezor --sender ${opts.deployerAddress} --rpc-url <RPC_URL> --broadcast`;

              if (opts.opSec === 'mnemonic') {
                walletCommand = `--mnemonic-derivation-paths \"m/44'/60'/0'/0/0\"`
              } else {
                walletCommand = `--private-key <DEPLOYER_PRIVATE_KEY>`
              }

            } catch (e: unknown) {
              throw e;
              }
            }
  });

  // const walletCommand = $state(`--mnemonic-derivation-paths \"m/44'/60'/0'/0/0\"`)

  $effect(() => {
    if (opts) {
          try {
              deployContract = buildDeployGeneric(opts);
              contract = buildContractGeneric(opts);
              testContract = buildTestGeneric(opts);

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

  <div class="pt-3 pb-4 justify-center">

    <!-- <h2 class="m-4 font-semibold">
      Create a new project using <a class="bg-primary underline" href="https://book.getfoundry.sh/projects/creating-a-new-project" target="_blank" rel="noreferrer">foundry</a> toolkit:
    </h2>

    <CopyBlock
      boxClass="p-2 rounded-box font-black text-primary max-w-xl mx-auto"
      class="mb-5"
      background="bg-primary-content"
      copiedBackground="bg-success"
      copiedColor="text-success-content"
      text={`forge init your_project`}
    />

    <CopyBlock
      boxClass="p-2 rounded-box font-black text-primary max-w-xl mx-auto"
      class="mb-5"
      background="bg-primary-content"
      copiedBackground="bg-success"
      copiedColor="text-success-content"
      text={`cd your_project`}
    />

    <p class="mt-6 text-base-300">
      Find out more on
      <a class="underline" href="https://github.com/foundry-rs/foundry" target="_blank" rel="noreferrer"
        >github</a
      >
    </p> -->

  </div>

</div>

<Background color="bg-base-100 pt-3 pb-4">
  <section id={stepLinks[0].pathname}>
    <div class="divider divider-primary ">
      <p class="btn btn-accent text-2xl">Step 1 : Contract Wizard</p>
    </div>
  </section>
</Background>

<ScrollStep links={stepLinks} titleHighlighted={stepLinks[0].title} />

<WizardSingle conventionNumber={conventionNumber} initialContractTab={initialContractTab} contractTab={contractTab} opts={opts} contractInstance={contract}>

  {#snippet guide()}
    <!-- <div class="pt-3 pb-4 justify-center"> -->

      <h2 class="m-4 font-semibold">
        Create a new project using <a class="bg-primary underline" href="https://book.getfoundry.sh/projects/creating-a-new-project" target="_blank" rel="noreferrer">foundry</a>. Then add new solidity files with following:
      </h2>

      <CopyBlock
        boxClass="p-2 rounded-box font-black text-primary max-w-xl mx-auto"
        class="mb-5"
        background="bg-primary-content"
        copiedBackground="bg-success"
        copiedColor="text-success-content"
        text={`touch src/${contract.name}.sol scripts/${conventionNumber}_${deployContract.name}.s.sol test/${contract.name}.t.sol`}
      />

      <p class="mt-6 text-base-300">
        Check out example at our
        <a class="underline" href="https://github.com/Ratimon/superfuse-contracts-examples" target="_blank" rel="noreferrer"
          >repo</a
        >
      </p>

    <!-- </div> -->
    
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
              <ERC20VotesContractControls bind:opts={allOpts.ERC20Votes!} />
          </div>
      </div>
  {/snippet}

</WizardSingle>

<Background color="bg-base-100 pt-3 pb-4">
  <section id={stepLinks[1].pathname}>
    <div class="divider divider-primary ">
      <p class="btn btn-accent text-2xl">Step 2 :Deploy Wizard</p>
    </div>
  </section>
</Background>

<ScrollStep links={stepLinks} titleHighlighted={stepLinks[1].title} />

<WizardSingle conventionNumber={conventionNumber} initialContractTab={initialContractTab} contractTab={contractTab} opts={opts} contractInstance={deployContract}>

    {#snippet guide()}

      <div class="pt-3 pb-4 justify-center">
        <h2 class="m-4 font-semibold">
          Add the <a class="bg-primary underline" href="https://github.com/Ratimon/superfuse-forge" target="_blank" rel="noreferrer">superfuse-forge</a> using your favorite package manager, e.g., with pnpm:
        </h2>
        <CopyBlock
          boxClass="p-2 rounded-box font-black text-primary max-w-xl mx-auto"
          class="mb-5"
          background="bg-primary-content"
          copiedBackground="bg-success"
          copiedColor="text-success-content"
          text={`pnpm add superfuse-forge`}
        />
      </div>

      <div class="pt-3 pb-4 justify-center">
        <h2 class="m-4 font-semibold">In your terminal, copy below code and run deployment scripts to your prefered network:</h2>
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
          text={walletCommand}
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
                <ERC20VotesDeployControls bind:opts={allOpts.ERC20Votes!} errors={errors.ERC20Votes} />
            </div>
        </div>
    {/snippet}

</WizardSingle>

<Background color="bg-base-100 pt-3 pb-4">
  <section id={stepLinks[2].pathname}>
    <div class="divider divider-primary ">
      <p class="btn btn-accent text-2xl">Step 3 :Test Wizard</p>
    </div>
  </section>
</Background>

<ScrollStep links={stepLinks} titleHighlighted={stepLinks[2].title} />

<WizardSingle conventionNumber={conventionNumber} initialContractTab={initialContractTab} contractTab={contractTab} opts={opts} contractInstance={testContract}>

    {#snippet guide()}

      <div class="pt-3 pb-4 justify-center">
        <h2 class="m-4 font-semibold">
          Add the <a class="bg-primary underline" href="https://github.com/Ratimon/superfuse-forge" target="_blank" rel="noreferrer">superfuse-forge</a> using your favorite package manager, e.g., with pnpm:
        </h2>
        <CopyBlock
          boxClass="p-2 rounded-box font-black text-primary max-w-xl mx-auto"
          class="mb-5"
          background="bg-primary-content"
          copiedBackground="bg-success"
          copiedColor="text-success-content"
          text={`forge test`}
        />
      </div>

      <p class="mt-6 text-base-300">
        It is noted that we only support testing for ERC7802. Other contracts are not supported yet. Check out the spec here:
        <a class="underline" href="https://github.com/defi-wonderland/ERCs/tree/erc/crosschain-token-interface" target="_blank" rel="noreferrer"
          >repo</a
        >
      </p>


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
                <ERC20VotesTestControls bind:opts={allOpts.ERC20Votes!} errors={errors.ERC20Votes} />
            </div>
        </div>
    {/snippet}

</WizardSingle>


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