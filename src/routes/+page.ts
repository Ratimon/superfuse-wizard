import type {Link } from '$lib/model/Link';
import {appName, appDescription} from 'web-config';

import type { MetaTagsProps } from 'svelte-meta-tags';

export function load() {
    const pageMetaTags = Object.freeze({
        title: appName,
        titleTemplate: '%s | OPStack Deployer',
        description: appDescription,
        openGraph: {
            title: appName,
            description: appDescription,
        },
    }) satisfies MetaTagsProps;

    const headLinks : Link[] = [
        {pathname: '#solution', title: 'Features', navType: 'scroll'},
        {pathname: '#resource', title: 'Resources' , navType: 'scroll'},
        {pathname: '/blog/3-metric-hub', title: 'Metric Hub', navType: 'tab'},
        {pathname: '#contact', title: 'Contact Us', navType: 'scroll'},
    ];

    const dropDownLinks : Link[] = [
        {pathname: '#1-contract', title: 'Contract', navType: 'scroll' },
        {pathname: '#2-deploy', title: 'Deploy', navType: 'scroll'},
    ];
    
    const actionLink : Link = {pathname: '/blog', title: 'Read Our Blog', navType: 'tab' };

    const footLinks : Link[] = [
        {pathname: '#solution', title: 'Features', navType: 'scroll'},
        {pathname: '#testimonial', title: 'Testimonial', navType: 'scroll'},
        {pathname: '#resource', title: 'Resources', navType: 'scroll'},
        {pathname: '#contact', title: 'Contact Us', navType: 'scroll'},
        {pathname: '/', title: 'Home', navType: 'tab'},
    ];

	return {
        pageMetaTags: pageMetaTags,
		headLinks: headLinks,
        menuTitle: "Try Our toolkit",
        dropDownLinks: dropDownLinks,
        actionLink: actionLink,
        footLinks: footLinks,
	};
}
