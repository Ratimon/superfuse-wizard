<script lang="ts">
    import Background from '$lib/ui/background/Background.svelte';
  
    import HelpTooltip from '$lib/ui/controls/HelpTooltip.svelte';
    // import UpgradeabilitySection from '$lib/ui/controls/UpgradeabilitySection.svelte';
    import InfoSection from '$lib/ui/controls/InfoSection.svelte';
    import ToggleRadio from '$lib/ui/inputs/ToggleRadio.svelte';
  
    import type {  OptionsErrorMessages } from '$lib/wizard/shared';
    import type { KindedERC20Options } from '$lib/wizard/shared';
  
    import { erc20Votes, premintPattern } from '$lib/wizard/smart-contracts';
    import { deployERC20Votes } from '$lib/wizard/deploy-scripts';
  
    import { error } from './error-tooltip';
    import { resizeToFit } from './resize-to-fit';
  
    const contractDefaults = erc20Votes.defaults;
    const deployDefaults = deployERC20Votes.defaults;
  
    export let opts: Required<KindedERC20Options['ERC20Votes']> = {
      kind: 'ERC20Votes',
      ...contractDefaults,
    //   premint: '', // default to empty premint in UI instead of 0
      ...deployDefaults,
      contractInfo: {  securityContact: 'Consult full code at https://github.com/OpenZeppelin/openzeppelin-contracts', license: 'MIT'  },
      deployInfo: {  securityContact: 'Consult full internal deploy script at https://github.com/Ratimon/redprint-forge', license: 'MIT'  },
    };

    // $: requireAccessControl = erc20Votes.isAccessControlRequired(opts);

  
</script>
  
<section class="controls-section">

    <Background color="bg-neutral-content">
        <h1>Contract Settings</h1>
    </Background>

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
        <span class="flex justify-between pr-2">
            Premint
            <HelpTooltip placement="right" align="right" link="https://docs.openzeppelin.com/contracts/api/token/erc20#ERC20-_mint-address-uint256-">
            Create an initial amount of tokens for the deployer.</HelpTooltip>
        </span>
        <input bind:value={opts.premint} placeholder="0" pattern={premintPattern.source}>
    </label>

</section>

<!-- to do add Opsec option  -->

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
  
      <label class:checked={opts.burnable}>
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
        <input type="checkbox" bind:checked={opts.permit}>
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
      </label>
    </div>
  </section>
  
  <section class="controls-section">
    <h1>
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="flex items-center tooltip-container pr-2">
        <span>Votes</span>
        <span class="ml-1">
          <ToggleRadio bind:value={opts.votes} defaultValue="blocknumber" />
        </span>
        <HelpTooltip placement="right" align="right" link="https://docs.openzeppelin.com/contracts/api/token/erc20#ERC20Votes">
          Keeps track of historical balances for voting in on-chain governance, with a way to delegate one's voting power to a trusted account.
        </HelpTooltip>
      </label>
    </h1>
  
    <div class="checkbox-group">
      <label class:checked={opts.votes === 'blocknumber'}>
        <input type="radio" bind:group={opts.votes} value="blocknumber">
        Block Number
        <HelpTooltip placement="right" align="right" link="https://docs.openzeppelin.com/contracts/governance#governor">
          Uses voting durations expressed as block numbers.
        </HelpTooltip>
      </label>
      <label class:checked={opts.votes === 'timestamp'}>
        <input type="radio" bind:group={opts.votes} value="timestamp">
        Timestamp
        <HelpTooltip placement="right" align="right" link="https://docs.openzeppelin.com/contracts/governance#timestamp_based_governance">
          Uses voting durations expressed as timestamps.
        </HelpTooltip>
      </label>
    </div>
  </section>

  
  <!-- <UpgradeabilitySection bind:upgradeable={opts.upgradeable} /> -->
  
  <InfoSection bind:info={opts.contractInfo} />