import React from 'react';
import Banner from '../Banner';
import Blog from '../Blog';
import Services from '../Services';
import Portfolio from '../Portfolio';

function Main() {
	return (
		<main id="main">
			<Banner />
			<Blog />
			<Services />
			<Portfolio />
		</main>
	);
}

export default Main;