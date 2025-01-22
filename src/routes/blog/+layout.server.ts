import type { PostData } from './Blog.model'
import type {Link } from '$lib/model/Link';

export async function load({ fetch }) {
	const response = await fetch('/blog/api/posts')
	const posts: PostData[] = await response.json()

    const footLinks : Link[] = [
        {pathname: '/blog/category/announcements', title: 'Announcements', navType: 'tab'},
        {pathname: '/blog/category/reports', title: 'Report Hub', navType: 'tab'},
        {pathname: '/', title: 'Home', navType: 'tab'},
    ];

	const headLinks  : Link[] = [
		{pathname: '/blog', title: 'All Posts', navType: 'tab'},
	  ];
	
	const dropDownLinks  : Link[] = [
        {pathname: '/blog/category/announcements', title: 'Features', navType: 'tab'},
		{pathname: '/blog/category/reports', title: 'Report Hub', navType: 'tab'},
	];
	

	return {
		headLinks: headLinks,
		// menuTitle: "Try Our toolkit",
        dropDownLinks: dropDownLinks,
        footLinks: footLinks,
		posts: posts,
		stepsHidden: true
	}
}