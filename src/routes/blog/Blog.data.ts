import type { CategoriesSlug, SocialSlug } from './Blog.model';
import type { CategoryPresenter, AuthorPresenter } from './Blog.presenter';

export const categorySlugs: { [key: string]: CategoriesSlug } = {
	announcements: "announcements",
	products: "products",
	tutorials: "tutorials",
	reports: "reports",
	events: "events"
};

export const categories: CategoryPresenter[] = [
	{
		// The slug to use in the URL, from the categorySlugs object above.
		slug: categorySlugs.announcements,
		// The title (h1), the category badge, the category filter Less than 60 characters.
		title: "Product Announcements",
		// A short version of the title . 1 or 2 words
		titleShort: "Announcements",
		description: "Here are the latest product announcements we've added to Superfuse toolkit, including Superfuse Wizard and Superfuse-forge.",
		descriptionShort: "Latest product annoucement added to Superfuse toolkit.",
	},
	{
		slug: categorySlugs.products,
		title: "New Product Features",
		titleShort: "Product Features",
		description:
		"Here are the latest features we've added to Superfuse toolkit.",
		descriptionShort: "Latest features added to Superfuse.",
	},
	{
		slug: categorySlugs.tutorials,
		title: "How Tos & Tutorials",
		titleShort: "Tutorials",
		description:
		"Learn how to use Superfuse with these step-by-step tutorials. I'll show you how to modify OPStack.",
		descriptionShort:
		"Learn how to use Superfuse with these step-by-step tutorials.",
	},
	{
		slug: categorySlugs.reports,
		title: "Reports",
		titleShort: "Reports & Metrics",
		description:
		"Report to communicate the impacts of Superfuse to ecosystem as public goods.",
		descriptionShort:
		"Report to communicate the impacts of Superfuse to ecosystem as public goods.",
	},
	{
		slug: categorySlugs.events,
		title: "Past Events",
		titleShort: "Events",
		description:
		"Past Event we participated.",
		descriptionShort:
		"Past Event we participated.",
	},
	];
	export const socialSlugs: { [key: string]: SocialSlug } = {
		x: "X",
		linkedIn: "LinkedIn",
		github: "Github",
		blog: "Blog",
	};

	// Social icons used in the author's bio.
	const socialIcons: {
		[key: string]: {
			name: string;
			iconName: string;
		};
		} = {
		x: {
			name: socialSlugs.x,
			iconName: "X",
		},
		linkedin: {
			name: socialSlugs.linkedIn,
			iconName: "LinkedIn",
		},
		github: {
			name: socialSlugs.github,
			iconName: "Github",
		},
		blog: {
			name: socialSlugs.blog,
			iconName: "Newspaper",
		},
		};
		

	const authorSlugs: {[key: string]: string; } = {
		rati: "Rati",
	};

	export const authors: AuthorPresenter[] = [
	{
		// The slug to use in the URL, from the authorSlugs object above.
		slug: authorSlugs.rati,
		// The name to display in the author's bio. Up to 60 characters.
		name: "Rati Montreewat",
		// The job to display in the author's bio. Up to 60 characters.
		job: "Indie Hacker",
		// The description of the author to display in the author's bio. Up to 160 characters.
		description:
		"Rati is a blockchain developer and an entrepreneur.",
		// The avatar of the author to display in the author's bio and avatar badge. It's better to use a local image, but you can also use an external image (https://...)
		avatarSrc: "/blog/authors/rati.webp",
		// A list of social links to display in the author's bio.
		socials: [
		{
			name: socialIcons.x.name,
			icon: socialIcons.x.iconName,
			url: "https://x.com/RATi_MOn",
		},
		{
			name: socialIcons.linkedin.name,
			icon: socialIcons.linkedin.iconName,
			url: "https://www.linkedin.com/in/rati-montreewat/",
		},
		{
			name: socialIcons.github.name,
			icon: socialIcons.github.iconName,
			url: "https://github.com/Ratimon",
		},
		{
			name: socialIcons.blog.name,
			icon: socialIcons.blog.iconName,
			url: "https://rati-eth-newsletter.beehiiv.com/subscribe",
		},
		],
	},
	];