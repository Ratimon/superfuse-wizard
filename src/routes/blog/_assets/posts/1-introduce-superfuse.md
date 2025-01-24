---
title: Introducing Superfuse
description: A dev library to build cross-chain contracts in superchain Ecosystem.
date: '2024-1-20'
categories:
  - announcements
  - products
author:
  - 'Rati'
published: true
imgSrc: /blog/1-introduce-superfuse/header.webp
imgAlt: Introducting superfuse-forge
---

# Introducing Superfuse


As interoperability becomes a core focus of the Superchain Product Vision in Season 7’s theme of Shared Success, it brings unique challenges when developing crosschain-based smart contract variations in superchain Ecosystem. It require secure smart contract, deployment process, and testing process and it is difficult to present all of them in a simple way.

To tackle this, we are pleased to introduce:

1.[superfuse-forge](https://github.com/superfuse-io/superfuse-forge): a developer-friendly framework/library in solidity to build a variations of cross-chain contracts in superchain Ecosystem. It works as an engine to:

- Provide type-safe deployment
- Re-usable  smart contract deployment and testing pipeline
- Save deployment schemas in **json** file
- Separatable into each of modular and customizable deploy scripts
- Based on All-Solidity, so no context switching, no new testing syntax


2. [Superfuse Wizard](https://superfuse.ninja/): a code generator/ interactive developer playground to develop a part of smart contract/deploy script/ test suites out of components from  crosschain specification. Select kind of contract that you want (currently support for ERC7802, SuperchainERC20, and ERC20Votes).

It can be seen below that there are several options to choose in own desired specifications. In our example, it is **L2NativeSuperchainERC20** (implementing ERC7802) based on OPLab's [offcial example](https://github.com/ethereum-optimism/superchainerc20-starter/blob/main/packages/contracts/src/L2NativeSuperchainERC20.sol) and the [`solady 's Ownable`](https://github.com/Vectorized/solady/blob/v0.0.292/src/auth/Ownable.sol) is picked over the [`solady 's EnumerableRoles`](https://github.com/Vectorized/solady/blob/v0.0.292/src/auth/EnumerableRoles.sol).

<img data-pagefind-meta="image[src]" width="1600" height="900" alt="Superfuse Contract UI" decoding="async" loading="eager" class="mt-4 border rounded bg-cover bg-center bg-no-repeat transform will-change-auto" src="1-introduce-superfuse/wizard_contract.webp" />

> **Note**💡
For **ERC20Votes** contract as an example, the dependency of access control functionality like `Ownable` is based on OpenZeppelin's [Ownable](https://docs.openzeppelin.com/contracts/5.x/api/access#Ownable).


It can be seen that the contract part is not only one generated solidity code, but also a set of deployment scripts and test suites, which are reactively presented when selecting the different desired options for different features.

<img data-pagefind-meta="image[src]" width="1600" height="900" alt="Superfuse Contract UI" decoding="async" loading="eager" class="mt-4 border rounded bg-cover bg-center bg-no-repeat transform will-change-auto" src="1-introduce-superfuse/wizard_deploy.webp" />

<img data-pagefind-meta="image[src]" width="1600" height="900" alt="Superfuse Contract UI" decoding="async" loading="eager" class="mt-4 border rounded bg-cover bg-center bg-no-repeat transform will-change-auto" src="1-introduce-superfuse/wizard_test.webp" />

Using together with [`superfuse-forg`](https://github.com/superfuse-io/superfuse-forge), it is highlighted that the deployment scripts module (e.g. `@superfuse-deploy`) can be re-used again in test suites to replicate the same environment when testing. This could minimize false positives from using different deployment logics among production and test environments. This will also speed up the development process, as the developer does not need to re-write deployment logics again in test suites.


> **Note**💡
If you want to learn more, check out our  example of using **superfuse-forge** in [repo](https://superfuse.ninja/) and the source code at [github repo](https://github.com/Ratimon/superfuse-forge) and let us know what you think!!

[👉🏻  🛠️ Installation Guide 🛠️](https://github.com/Ratimon/redprint-forge?tab=readme-ov-file#quickstart)

## Acknowledgement

We embrace a culture of regenerative approach of building open-source software and we acknowledge, use, and get inspiration from these upstream software repositories :
- [OZ 's contracts](https://github.com/OpenZeppelin/openzeppelin-contracts) by **OpenZeppelin**
- [OZ 's Wizard](https://github.com/OpenZeppelin/contracts-wizard/) by **OpenZeppelin**
- [OPStack monorepo](https://github.com/ethereum-optimism/optimism) by **OP Labs**
- [superchainerc20-starter template](https://github.com/ethereum-optimism/superchainerc20-starter) by **OP Labs**
- [foundry's forge](https://github.com/foundry-rs/foundry/tree/master/crates/forge) by **Paradigm**
- [forge-deploy](https://github.com/wighawag/forge-deploy) by **Ronan Sandford**
- [solady](https://github.com/Vectorized/solady) by **Vectorized**
- [Redprint Wizard](https://github.com/Ratimon/redprint-wizard) by **Ratimon**
- [redprint-forge](https://github.com/Ratimon/redprint-forge) by **Ratimon**
- [superfuse-contracts-examples](https://github.com/Ratimon/superfuse-contracts-examples) by **Ratimon**