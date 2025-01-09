<script  lang="ts">
  import type { Snippet } from 'svelte';

  import fileSaver from 'file-saver';
  import { v4 as uuid } from 'uuid';

  import CopyIcon from '$lib/ui/icons/CopyIcon.svelte';
  import CheckIcon from '$lib/ui/icons/CheckIcon.svelte';
  import FileIcon from '$lib/ui/icons/FileIcon.svelte';

  import { injectHyperlinks } from '$lib/ui/utils/inject-hyperlinks';
  import {copyToClipboard} from '$lib/ui/utils/clipboard';
  import hljs  from '$lib/ui/utils/highlightjs';

  import type {  Kind,  } from '$lib/wizard/shared';
  import {  sanitizeKind, } from '$lib/wizard/shared';

  import type {  Contract } from '$lib/wizard/smart-contracts';
  import {  printContract } from '$lib/wizard/smart-contracts';

  import type {  DeployContract } from '$lib/wizard/deploy-scripts';
  import {  printDeployContract } from '$lib/wizard/deploy-scripts';

  import type {  TestContract } from '$lib/wizard/test-suites';
  import {  printTestContract } from '$lib/wizard/test-suites';

  import type { GaEvent } from '$lib/analytics/analytics.Store';
  import { analyticsStore } from '$lib/analytics/analytics.Store';

  type Props = {
    guide: Snippet;
    menu: Snippet;
    control: Snippet;
    contractInstance: Contract | DeployContract | TestContract;
    opts: any;
    conventionNumber: string;
    initialContractTab: string | undefined ;
    contractTab: Kind;
  };

  let {
    guide,
    menu,
    control,
    contractInstance,
    opts,
    conventionNumber,
    initialContractTab,
    contractTab = sanitizeKind(initialContractTab),
  }: Props = $props();

  // $effect.pre(() => {

  // $effect(() => {
  //   contractTab = sanitizeKind(contractTab);
  // });

  let code: string = $state("");
  let highlightedCode: string | undefined = $state("");


  $effect(() => {
    contractTab = sanitizeKind(contractTab);
    // @ts-ignore
    if ( contractInstance.kind === "deploy") {

      code = printDeployContract(contractInstance as DeployContract);
      highlightedCode = injectHyperlinks(hljs.highlight(code, {language: 'solidity'} ).value);
    } else if (contractInstance.kind === "contract") {

      code = printContract(contractInstance as Contract);
      highlightedCode = injectHyperlinks(hljs.highlight(code, {language: 'solidity'} ).value);
       
    } else if (contractInstance.kind === "test") {

      code = printTestContract(contractInstance as TestContract);
      highlightedCode = injectHyperlinks(hljs.highlight(code, {language: 'solidity'} ).value);

    } else {
      throw new Error("Invalid contract type");
    }
  });
  

  // const code = $derived(printDeployContract(contractInstance));
  // const highlightedCode = $derived(injectHyperlinks(hljs.highlight(code, {language: 'solidity'} ).value));
  
  let isScriptCopied = $state(false);

  const copyHandler = async () => {
      copyToClipboard(code);
        isScriptCopied = true;

        if (opts) {
          const new_event : GaEvent  = {
              id:   uuid(),
              data: {...opts},
              event: `copy-${contractInstance.kind}-${contractTab}`,
              type: "event",
        }
        $analyticsStore = [...$analyticsStore, new_event]
      }

      setTimeout(() => {
        isScriptCopied = false;
      }, 1000);
  };

  const downloadNpmHandler = async () => {
      const blob = new Blob([code], { type: 'text/plain' });
      if (opts) {
        fileSaver.saveAs(blob, opts.deployName + '.sol');

        const new_event : GaEvent  = {
            id:   uuid(),
            data: {...opts},
            event: `download-${contractInstance.kind}-${contractTab}`,
            type: "event",
        }
        $analyticsStore = [...$analyticsStore, new_event]
      }
  };


</script>

<div class="container flex flex-col gap-4 p-8 mx-8">

    {@render guide()}
  
    <div class="pt-3 pb-4 header flex flex-row justify-between">
  
      {@render menu()}
  
      <div class="action flex flex-row gap-2 shrink-0">
        <button class="action-button min-w-[165px]" onclick={copyHandler}>
          <div class="flex justify-between">
            {#if isScriptCopied}
              <CheckIcon />Copied
            {:else}
              <CopyIcon />Copy .sol Code
            {/if}
          </div>
        </button>
  
        <button class="action-button min-w-[165px]" onclick={downloadNpmHandler}>
          <div class="flex justify-between">
            <FileIcon /> Download As .sol
          </div>
        </button>
      </div>
  
    </div>
  
    <div class="flex flex-row gap-4 grow">
  
      {@render control()}
  
      <div class="output flex flex-col grow overflow-auto h-[calc(120vh-40px)]">
        <div class="badge badge-primary badge-outline badge-lg">
          {#if contractInstance.kind == 'contract'}
            Contract Code:
          {:else}
            Deploy Script:
          {/if}
        </div>
        <div class="badge badge-primary badge-outline badge-lg">
          {#if contractInstance.kind == 'contract'}
            {contractInstance.name}.sol
          {:else}
            {conventionNumber}_{contractInstance.name}.s.sol
          {/if}
        </div>
  
        <pre class="flex flex-col grow basis-0 overflow-auto">
          <code class="hljs grow overflow-auto p-4">
            {@html highlightedCode}
          </code>
        </pre>
  
      </div>
      
    </div>
  
</div>
      
<style lang="postcss">
  .container {
      background-color: var(--gray-1);
      border: 1px solid var(--gray-2);
      border-radius: 10px;
      min-width: 32rem;
  }

  /* .header {
      font-size: var(--text-small);
  } */

  /* .tab {
      color: var(--gray-5);
  }
  */
  .action-button, :global(.overflow-btn) {
      padding: var(--size-1) var(--size-2);
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
  }

  :global(.overflow-btn) {
      border: 0;
      background-color: transparent;
  }

  :global(.overflow-btn):hover {
      background-color: var(--gray-2);
  }


  .action-button {
      background-color: var(--gray-1);
      border: 1px solid var(--gray-3);
      color: var(--gray-6);
      cursor: pointer;

      &:hover {
      background-color: var(--gray-2);
      }

      /* &:active, &.active {
      background-color: var(--gray-2);
      }
      */

      /* &.disabled {
      color: var(--gray-4);
      } */

      :global(.icon) {
      margin-right: var(--size-1);
      }
  }

</style>