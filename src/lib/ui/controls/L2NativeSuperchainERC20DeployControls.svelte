<script lang="ts">
  import Background from '$lib/ui/layouts/Background.svelte';

  import HelpTooltip from '$lib/ui/controls/HelpTooltip.svelte';
  import AccessControlSection from '$lib/ui/controls/AccessControlSection.svelte';

  import type {  OptionsErrorMessages } from '$lib/wizard/shared';
  import type { KindedERC20Options } from '$lib/wizard/shared';

  import { l2NativeSuperchainERC20 } from '$lib/wizard/smart-contracts';
  import { deployL2NativeSuperchainERC20 } from '$lib/wizard/deploy-scripts';

  import { error } from './error-tooltip';

  const contractDefaults = l2NativeSuperchainERC20.defaults;
  const deployDefaults = deployL2NativeSuperchainERC20.defaults;


  type Props = {
    opts: Required<KindedERC20Options['L2NativeSuperchainERC20']>;
    errors: undefined | OptionsErrorMessages;
  };

  let {
    opts = $bindable(),
    errors = $bindable()
  }: Props = $props();

  if (opts === undefined) opts = {
    kind: 'L2NativeSuperchainERC20',
    ...contractDefaults,
    //   premint: '', // default to empty premint in UI instead of 0
    ...deployDefaults,
    contractInfo: {  securityContact: 'Consult full code at https://github.com/Ratimon/superfuse-contracts-examples', license: 'MIT'  },
    deployInfo: {  securityContact: 'Consult full internal deploy script at https://github.com/Ratimon/superfuse-forge', license: 'MIT'  },
  };

  $effect.pre(() => {
    if (opts === undefined) opts = {
      kind: 'L2NativeSuperchainERC20',
      ...contractDefaults,
      //   premint: '', // default to empty premint in UI instead of 0
      ...deployDefaults,
      contractInfo: {  securityContact: 'Consult full code at https://github.com/Ratimon/superfuse-contracts-examples', license: 'MIT'  },
      deployInfo: {  securityContact: 'Consult full internal deploy script at https://github.com/Ratimon/superfuse-forge', license: 'MIT'  },
    }
  });

  let requireAccessControl = $state(true);

  $effect(() => {
    requireAccessControl = l2NativeSuperchainERC20.isAccessControlRequired!(opts);
  });
  
</script>

<section class="controls-section">
    <Background color="bg-neutral-content">
      <h1>Deploy Settings</h1>
    </Background>

    <h1>Parameters</h1>

    <label class="labeled-input">
      <span>Name</span>
      <input bind:value={opts.deployName}>
    </label>

    <label class="labeled-input">
      <span>Convention Number</span>
      <input bind:value={opts.conventionNumber}>
    </label>

    <h1>OpSec Management</h1>

    <div class="checkbox-group justify-start">
      <span class="flex justify-between pr-2">
        RPC endpoint
        <HelpTooltip align="right" placement="right" link="https://github.com/Ratimon/superfuse-contracts-examples/blob/main/.env.example">
          Please config your own RPC endpoint in the .env file.
        </HelpTooltip>
      </span>

      <label class:checked={opts.chain === 'optimism'}>
        <input type="radio" bind:group={opts.chain} value='optimism'>
        Optimism
        <HelpTooltip align="right" placement="right" link="https://docs.optimism.io/chain/networks">
          Checkout Optimism's official documentation for more information regarding RPC endpoints.
        </HelpTooltip>
      </label>
  
      <label class:checked={opts.chain === 'base'}>
        <input type="radio" bind:group={opts.chain} value='base'>
        Base
        <HelpTooltip align="right" placement="right" link="https://docs.base.org/docs/network-information/">
          Checkout Base's official documentation for more information regarding RPC endpoints.
        </HelpTooltip>
      </label>

      <label class:checked={opts.chain === 'localhost'}>
        <input type="radio" bind:group={opts.chain} value='localhost'>
        localhost
        <HelpTooltip align="right" placement="right" link="https://github.com/Ratimon/superfuse-contracts-examples/blob/main/.env.example">
          The default RPC endpoint is 'http://localhost:8545'
        </HelpTooltip>
      </label>
    </div>

    <label class="labeled-input">
      <span class="flex justify-between pr-2">
        Deployer Address
        <HelpTooltip align="right" placement="right" link="https://github.com/Ratimon/superfuse-contracts-examples/blob/main/.env.example">
          The default address here is derived from the foundry local' s network private key for testing purpose. Please use your own from your own private key or mnemonic.
        </HelpTooltip>
      </span>
      <input
          bind:value={opts.deployerAddress}
          use:error={errors?.address}
          placeholder="Enter a valid address"
      >
    </label>
    
    <div class="checkbox-group justify-start">
      <label class:checked={opts.opSec === 'key'}>
        <input type="radio" bind:group={opts.opSec} value='key'>
        Key
        <HelpTooltip align="right" placement="right" link="https://github.com/Ratimon/superfuse-contracts-examples">
          It is not recommended to store your private key in the environment file.
        </HelpTooltip>
      </label>
  
      <label class:checked={opts.opSec === 'mnemonic'}>
        <input type="radio" bind:group={opts.opSec} value='mnemonic'>
        Mnemonic
        <HelpTooltip align="right" placement="right" link="https://github.com/Ratimon/superfuse-contracts-examples">
          It is not recommended to store your mnemonic in the environment file.
        </HelpTooltip>
      </label>
    </div>

</section>

<section class="controls-section">
    <h1>
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="flex items-center tooltip-container pr-2">
        <span>Deploy Info</span>
        </label>
    </h1>

    <label class="labeled-input">
        <span class="flex justify-between pr-2">
        Reference
        <HelpTooltip align="right" placement="right" link="https://github.com/Ratimon/superfuse-forge/tree/main">
            The link to original code
        </HelpTooltip>
        </span>
        <input bind:value={opts.deployInfo.securityContact} placeholder={"security@example.com"} />
    </label>

    <label class="labeled-input">
        <span>License</span>
        <input bind:value={opts.deployInfo.license} placeholder={opts.deployInfo.license} />
    </label>
</section>
  
<section class="controls-section">

  <Background color="bg-neutral-content">
      <h1>Contract Settings</h1>
  </Background>

  <h1>Parameters</h1>

  <label class="labeled-input">
      <span>Name</span>
      <input bind:value={opts.contractName}>
  </label>

  <label class="labeled-input">
      <span>Token Name</span>
      <input bind:value={opts.tokenName}>
  </label>

  <label class="labeled-input">
      <span>Symbol</span>
      <input bind:value={opts.tokenSymbol}>
  </label>

  <label class="labeled-input">
    <span>Decimals</span>
    <input bind:value={opts.decimals} placeholder="18">
  </label>

  {#if opts.access}

    <label class="labeled-input">
      <span class="flex justify-between pr-2">
        {#if opts.access === 'ownable'}
          Owner Address
        {:else if opts.access === 'roles'}
          Admin Address
        {/if}
        <HelpTooltip align="right" placement="right" link="https://book.getfoundry.sh/reference/forge/forge-script?highlight=forge%20scr#forge-script">
            The address is either the owner or the admin of the contract.
        </HelpTooltip>
      </span>

      <input
        bind:value={opts.ownerAddress}
        use:error={errors?.address}
        placeholder="Enter a valid address"
      >

    </label>

    {#if (opts.mintable && opts.access === 'roles')}
      <label class="labeled-input">
        <span class="flex justify-between pr-2">
          Minter Address
          <HelpTooltip align="right" placement="right" link="https://docs.openzeppelin.com/contracts/api/token/erc20#ERC20-_mint-address-uint256-">
            The address is the minter of the contract.
          </HelpTooltip>
        </span>
        <input
          bind:value={opts.minterAddress}
          placeholder="Enter a valid address"
        >
      </label>
    {/if}

  {/if}

</section>

<section class="controls-section">
  <h1>Features</h1>

  <div class="checkbox-group">

    <label class:checked={opts.mintable}>
      <input type="checkbox" bind:checked={opts.mintable}>
      Mintable
      <HelpTooltip placement="right" align="right" link="https://docs.openzeppelin.com/contracts/api/token/erc20#ERC20-_mint-address-uint256-">
        Privileged accounts will be able to create more supply.
      </HelpTooltip>
    </label>

  </div>

</section>

<AccessControlSection bind:access={opts.access} required={requireAccessControl} />
