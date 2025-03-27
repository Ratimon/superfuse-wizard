import type { MetaTagsProps } from 'svelte-meta-tags';
import {appName, appDescription} from 'web-config';

export const ssr = false;
export const prerender = false;

export const load = ( { url} : {url:any} ) => {
    const baseMetaTags = Object.freeze({
      title: appName,
      titleTemplate: '%s | Superchain Wizard',
      description: appDescription,
      canonical: new URL(url.pathname, url.origin).href,
      openGraph: {
        type: 'website',
        url: new URL(url.pathname, url.origin).href,
        locale: 'en_IE',
        title: appName,
        description: appDescription,
        siteName: appName,
        images: [
          {
            url: 'https://github.com/Ratimon/superfuse-wizard/blob/main/static/icon.png',
            alt: 'Superfuse Wizard Logo',
            width: 512,
            height: 512,
            secureUrl: 'https://github.com/Ratimon/superfuse-wizard/blob/main/static/icon.png',
            type: 'image/jpeg'
          },
        ],
      },
      x: {
        handle: 'RATi_MOn',
        site: 'https://x.com/RATi_MOn',
        title: appName,
        description: appDescription,
        image: '/icon.png',
        imageAlt: 'Superfuse Wizard'
      }
    }) satisfies MetaTagsProps;
  
    return {
      baseMetaTags
    };
  };