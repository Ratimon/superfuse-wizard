import type {Link } from '$lib/model/Link';
import {appName, appDescription} from 'web-config';

import type { MetaTagsProps } from 'svelte-meta-tags';

export const ssr = false;

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
        // {pathname: '#testimonial', title: 'Testimonials', navType: 'scroll'},
        {pathname: '/blog/0-metric-hub', title: 'Metric Hub', navType: 'tab'},
        {pathname: '/about', title: 'Contact Us', navType: 'tab'},
    ];

    const dropDownLinks : Link[] = [
        {pathname: '#1-contract', title: 'Build', navType: 'scroll' },
        {pathname: '#2-deploy', title: 'Deploy', navType: 'scroll'},
        {pathname: '#3-test', title: 'Test', navType: 'scroll'},
    ];
    
    const actionLink : Link = {pathname: '/blog', title: 'Resources/Blog', navType: 'tab' };

    const footLinks : Link[] = [
        {pathname: '#1-contract', title: 'Build', navType: 'scroll' },
        {pathname: '#2-deploy', title: 'Deploy', navType: 'scroll'},
        {pathname: '#3-test', title: 'Test', navType: 'scroll'},
        {pathname: '/blog/0-metric-hub', title: 'Metric Hub', navType: 'tab'},
        {pathname: '/about', title: 'Contact Us', navType: 'tab'},
        {pathname: '/', title: 'Home', navType: 'tab'},
    ];

	return {
        pageMetaTags: pageMetaTags,
		headLinks: headLinks,
        menuTitle: "Wizardoorr",
        dropDownLinks: dropDownLinks,
        actionLink: actionLink,
        footLinks: footLinks,
	};
}
