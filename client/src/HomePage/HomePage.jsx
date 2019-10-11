import React from 'react';
import { Banner, About } from '../components';


function HomePage() { 
	return (
		<div className="container">
			<Banner />
			<About />
			<div id="btm-call">
				We are proud of our works.
			</div>
		</div>
	)
}

export default HomePage;
