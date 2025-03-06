## CONTRIBUTING

Please make a pull request to [Dev Branch](https://github.com/Ratimon/superfuse-wizard/tree/dev)

### TODO

- Port to Dailsy UI 5
- Abstrat Icon Component

### Developer's Quick Guide

>[!WARNING]
> For Repo Owner only!!

1. Scaffolding:

```bash
npx sv create superfuse-wizard
```

>[!NOTE]
> For who want to scaffolding their own svelte project

>[!TIP]
> We, when scaffolding, use following options :
- SvelteKit minimal
- Yes, using Typescript syntax
- tailwindcss, mdsvex
- typography, forms
- pnpm

```bash
pnpm add -D daisyui svelte-preprocess 
```

2. Adding Icon:

For reference only
- (Create Logo)[https://shipfa.st/tools/logo-fast?]
- (Convert to svg)[https://pixelied.com/convert/png-converter/png-to-svg]
- (Crop png)[https://www.iloveimg.com/crop-image/crop-png]
- (Make it PWA compatible)[https://github.com/wighawag/pwag]
- (webp)[https://squoosh.app]

3. Adding first header and footer:

```bash
pnpm add -D @iconify/svelte tailwind-merge bits-ui clsx
```

4. Adding meta tags:

```bash
pnpm add -D just-extend svelte-meta-tags
```

### Publishing

#### For First Time

Config `package.json`:

```bash
npm publish
```

#### For Second Time

```bash
git add .
git commit -am "v1.0.2"
git push -u origin main
git tag v1.0.2 main
git push origin tag v1.0.2
```
>[!WARNING]
> DONT forget to add secret env `NPM_AUTH_TOKEN` at [repo](https://github.com/Ratimon/superfuse-wizard/settings/secrets/actions)