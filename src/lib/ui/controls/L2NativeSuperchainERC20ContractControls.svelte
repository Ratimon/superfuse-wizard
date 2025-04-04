<script lang="ts">
  import Background from '$lib/ui/layouts/Background.svelte';

  import HelpTooltip from '$lib/ui/controls/HelpTooltip.svelte';
  import ToggleRadio from '$lib/ui/inputs/ToggleRadio.svelte';
  import AccessControlSection from '$lib/ui/controls/AccessControlSection.svelte';
  // import UpgradeabilitySection from '$lib/ui/controls/UpgradeabilitySection.svelte';

  import type {  OptionsErrorMessages } from '$lib/wizard/shared';
  import type { KindedERC7802Options } from '$lib/wizard/shared';

  import { l2NativeSuperchainERC20 } from '$lib/wizard/smart-contracts';
  import { deployL2NativeSuperchainERC20 } from '$lib/wizard/deploy-scripts';

  import { error } from './error-tooltip';
  import { resizeToFit } from './resize-to-fit';

  const contractDefaults = l2NativeSuperchainERC20.defaults;
  const deployDefaults = deployL2NativeSuperchainERC20.defaults;


  type Props = {
    opts: Required<KindedERC7802Options['L2NativeSuperchainERC20']>;
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
    contractInfo: {  securityContact: 'Consult full code at https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts-bedrock/src/L2/SuperchainERC20.sol', license: 'MIT'  },
    deployInfo: {  securityContact: 'Consult full internal deploy script at https://github.com/Ratimon/superfuse-forge', license: 'MIT'  },
  };

  $effect.pre(() => {
    if (opts === undefined) opts = {
      kind: 'L2NativeSuperchainERC20',
      ...contractDefaults,
      //   premint: '', // default to empty premint in UI instead of 0
      ...deployDefaults,
      contractInfo: {  securityContact: 'https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts-bedrock/src/L2/SuperchainERC20.sol', license: 'MIT'  },
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

  <!-- <label class="labeled-input">
      <span class="flex justify-between pr-2">
          Premint
          <HelpTooltip placement="right" align="right" link="https://docs.openzeppelin.com/contracts/api/token/erc20#ERC20-_mint-address-uint256-">
          Create an initial amount of tokens for the deployer.</HelpTooltip>
      </span>
      <input bind:value={opts.premint} placeholder="0" pattern={premintPattern.source}>
  </label> -->

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

    

    <!-- <label class:checked={opts.burnable}>
      <input type="checkbox" bind:checked={opts.burnable}>
      Burnable
      <HelpTooltip placement="right" align="right" link="https://docs.openzeppelin.com/contracts/api/token/erc20#ERC20Burnable">
        Token holders will be able to destroy their tokens.
      </HelpTooltip>
    </label>

    <label class:checked={opts.pausable}>
      <input type="checkbox" bind:checked={opts.pausable}>
      Pausable
      <HelpTooltip placement="right" align="right" link="https://docs.openzeppelin.com/contracts/api/utils#Pausable">
        Privileged accounts will be able to pause the functionality marked as <code>whenNotPaused</code>.
        Useful for emergency response.
      </HelpTooltip>
    </label>

    <label class:checked={opts.permit || opts.votes}>
      <ToggleRadio bind:value={opts.votes} checked={true} defaultValue={true} disabled={true} />
      Permit
      <HelpTooltip placement="right" align="right" link="https://docs.openzeppelin.com/contracts/api/token/erc20#ERC20Permit">
        Without paying gas, token holders will be able to allow third parties to transfer from their account.
      </HelpTooltip>
    </label>

    <label class:checked={opts.flashmint}>
      <input type="checkbox" bind:checked={opts.flashmint}>
      Flash Minting
      <HelpTooltip placement="right" align="right" link="https://docs.openzeppelin.com/contracts/api/token/erc20#ERC20FlashMint">
        Built-in flash loans. Lend tokens without requiring collateral as long as they're returned in the same transaction.
      </HelpTooltip>
    </label> -->

  </div>

</section>

<AccessControlSection bind:access={opts.access} required={requireAccessControl} />

<!-- <UpgradeabilitySection bind:upgradeable={opts.upgradeable} /> -->

<section class="controls-section">
  <h1>
    <!-- svelte-ignore a11y_label_has_associated_control -->
    <label class="flex items-center tooltip-container pr-2">
      <span>Contract Info</span>
    </label>
  </h1>

  <label class="labeled-input">
    <span class="flex justify-between pr-2">
      Reference
      <HelpTooltip align="right" placement="right" link="https://github.com/Ratimon/superfuse-forge/tree/main">
          The link to original code
      </HelpTooltip>
    </span>
    <input bind:value={opts.contractInfo.securityContact} placeholder="security@example.com" />
  </label>

  <label class="labeled-input">
    <span>License</span>
    <input bind:value={opts.contractInfo.license} placeholder={opts.contractInfo.license} />
  </label>
</section>