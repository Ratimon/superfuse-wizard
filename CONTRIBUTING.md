## CONTRIBUTING

Please make a pull request to [Dev Branch](https://github.com/Ratimon/superfuse-wizard/tree/dev)

### Developer's Quick Guide

>[!NOTE]
> For who want to scaffolding their own svelte project

Scaffolding:

```bash
npx sv create superfuse-wizard
```


>[!TIP]
> We, when scaffolding, use following options :
- SvelteKit minimal
- Yes, using Typescript syntax
- tailwindcss, mdsvex
- typography, forms
- pnpm

### Publishing

#### For First Time

#### For Second Time

>[!WARNING]
> For Repo Owner only!!

```bash
git add .
git commit -am "v0.0.4"
git push -u origin main
git tag v0.0.4 main
git push origin tag v0.0.4
```
>[!WARNING]
> DONT forget to add secret env `NPM_AUTH_TOKEN` at [repo](https://github.com/Ratimon/superfuse-wizard/settings/secrets/actions)