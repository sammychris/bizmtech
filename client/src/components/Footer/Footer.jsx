import React from 'react';


class Footer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mailSent: false,
			name: '',
			email: '',
			location: '',
			message: '',
			phone: '',
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(e) {
		const { name, value } = e.target;
		this.setState({
			[name]: value
		})
	}

	handleSubmit(e) {
		e.preventDefault();
		const { name, email, phone, location, message } = this.state;
		fetch('/api/contact', {
			method: 'POST',
			headers: {
		      'Content-Type': 'application/json'
		    },
			body: JSON.stringify({ name, email, phone, location, message })
		}).then(res => res.json())
			.then(res => {
				console.log(res.message);
				this.setState({ mailSent: res.success});
			});
		setTimeout(() => this.setState({ mailSent: false }), 10000);
	}

	render() {
		const { name, email, location, message, phone } = this.state;
		return (
			<footer id="footer-contact">
				<h2>Get In Touch</h2>
				<div className="contact-holder">
					<form onSubmit={this.handleSubmit}>
						<div className="row1">
							<input
								name="name"
								value={ name }
								placeholder="Your Name (Eg: Samuel Okanume)"
								type="text"
								required
								onChange={this.handleChange}
							/>
							<input
								name="email"
								value={ email }
								placeholder="Your E-mail (To help us get back to you)"
								type="email"
								onChange={this.handleChange}
							/>
						</div>
						<div className="row2">
							<input
								name="phone"
								value={ phone }
								placeholder="Your Phone no (To help us get back to you)"
								type="number"
								onChange={this.handleChange}
							/>
						</div>
						<div className="row2">
							<input
								name="location"
								value={ location }
								placeholder="Your Subject (required)"
								type="address"
								required
								onChange={this.handleChange}
							/>
						</div>
						<div className="row3">
							<textarea
								name="message"
								value={ message }
								placeholder="Message"
								type="text"
								required
								onChange={this.handleChange}
							/>
						</div>
						<div className="row3">
							<button>Submit</button>
						</div>
						<div style={{ color: '#2164f3', fontWeight: 'bolder'}}>
						  {this.state.mailSent &&
						    <div>Thank you for contacting us...</div>
						  }
						</div>
					</form>
					<div className="details">
						<div className="icons1">
							<i className="fas fa-map-marker-alt"></i>
							<span>94 Kirikiri Road, Olodia Apapa, Lagos.</span>
						</div>
						<div className="icons1">
							<i className="fas fa-envelope"></i>
							<span>ebusameric@gmail.com</span>
						</div>
						<div className="icons1">
							<i className="fas fa-phone-square"></i>
							<span>+23408140132155</span>
						</div>
						<div className="icons1">
							<i className="fab fa-whatsapp-square"></i>
							<span>+2349088323232</span>
						</div>
						<h4>About Us</h4>
						<p>We can also join, like and follow us through these platforms</p>
						<a target="_blank"
							href="https://www.facebook.com/jakazautoparts"
							rel="noopener noreferrer"
							className="icons2">
							<i className="fab fa-facebook-square"></i>
							<span>Join our Facebook group for more business insight.</span>
						</a>
						<a target="_blank"
							href="https://www.facebook.com/jakazautoparts"
							rel="noopener noreferrer"
							className="icons2">
							<i className="fab fa-twitter-square"></i>
							<span>Follow us on Twitter</span>
						</a>
						<a target="_blank"
							href="https://www.instagram.com/jakazautoparts"
							rel="noopener noreferrer"
							className="icons2">
							<i className="fab fa-instagram"></i>
							<span>Follow us on Instagram</span>
						</a>
					</div>
				</div>
			</footer>
		);
	}
}

export default Footer;