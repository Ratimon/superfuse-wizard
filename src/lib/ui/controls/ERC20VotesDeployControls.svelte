<script lang="ts">
  import Background from '$lib/ui/layouts/Background.svelte';

  import HelpTooltip from '$lib/ui/controls/HelpTooltip.svelte';

  import type {  OptionsErrorMessages } from '$lib/wizard/shared';
  import type { KindedERC20Options } from '$lib/wizard/shared';

  import { erc20Votes } from '$lib/wizard/smart-contracts';
  import { deployERC20Votes } from '$lib/wizard/deploy-scripts';

  import { error } from './error-tooltip';

  const contractDefaults = erc20Votes.defaults;
  const deployDefaults = deployERC20Votes.defaults;

  type Props = {
    opts: Required<KindedERC20Options['ERC20Votes']>;
    errors: undefined | OptionsErrorMessages;
  };

  let {
    opts = $bindable(),
    errors = $bindable()
  }: Props = $props();

  if (opts === undefined) opts = {
          kind: 'ERC20Votes',
          ...contractDefaults,
          //   premint: '', // default to empty premint in UI instead of 0
          ...deployDefaults,
          contractInfo: {  securityContact: 'Consult full code at https://github.com/OpenZeppelin/openzeppelin-contracts', license: 'MIT'  },
          deployInfo: {  securityContact: 'Consult full internal deploy script at https://github.com/Ratimon/superfuse-forge', license: 'MIT'  },
    };

  $effect.pre(() => {
    if (opts === undefined) opts = {
          kind: 'ERC20Votes',
          ...contractDefaults,
          //   premint: '', // default to empty premint in UI instead of 0
          ...deployDefaults,
          contractInfo: {  securityContact: 'Consult full code at https://github.com/OpenZeppelin/openzeppelin-contracts', license: 'MIT'  },
          deployInfo: {  securityContact: 'Consult full internal deploy script at https://github.com/Ratimon/superfuse-forge', license: 'MIT'  },
    }
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
      <HelpTooltip align="right" placement="right" link="https://github.com/Ratimon/superfuse-contracts-examples/blob/main/.env.example">
        The key must be match with the provided mnemonic.
      </HelpTooltip>
    </label>

    <label class:checked={opts.opSec === 'mnemonic'}>
      <input type="radio" bind:group={opts.opSec} value='mnemonic'>
      Mnemonic
      <HelpTooltip align="right" placement="right" link="https://github.com/Ratimon/superfuse-contracts-examples/blob/main/.env.example">
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

</section>