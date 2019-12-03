import React from 'react';

function Portfolio() {
	return (
		<section id="portfolio">
			<header>
				<h2>These are some of our works</h2>
			</header>
			<ul>
				<li class="project-tile">
					<a href="http://jakazautoparts.com" target="_blank" alt="">
						<img src='images/jakazpics.png'/>
					</a>
				</li>
				<li class="project-tile">
					<a href="https://chingu-habit-tracker.herokuapp.com" target="_blank" alt="">
						<img src="images/habit.png" alt="" />
					</a>
				</li>
				<li class="project-tile">
					<a href="https://sammychris.github.io/" target="_blank" alt="">
						<img src="images/portfolio.png" alt="" />
					</a>
				</li>
				<li class="project-tile">
					<a href="https://sammychris.github.io/Product-Landing-Page" target="_blank" alt="">
						<img src="images/productLand.png" alt="" />
					</a>
				</li>
				<li class="project-tile">
					<a href="https://sammychris-metric-imperial-converter.glitch.me/" target="_blank" alt="">
						<img src="images/project.jpg" alt="" />
					</a>
				</li>
				<li class="project-tile">
					<a href="#" target="_blank" alt="">
						<img src="images/maintenance.jpg" alt="" />
					</a>
				</li>
			</ul>
	  	</section>
	);
}

export default Portfolio;
