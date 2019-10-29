import React from 'react';


class SendMailForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			subject: '',
			body: '',
			model: '',
			csvfile: '',
			data: JSON.parse(localStorage.getItem('jsonObj')),
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleCsv = this.handleCsv.bind(this);
	}
	handleSubmit(event) {
		event.preventDefault();
		const { subject, body, data } = this.state;
		fetch('/api/sendmail', {
			method: 'POST',
			headers: {
		      'Content-Type': 'application/json'
		    },
			body: JSON.stringify({ subject, body, data }),
		}).then(res => res.json())
			.then(res => console.log(res));


	};

	handleCsv(event) {
		event.preventDefault();
		const { csvfile } = this.state;

		const formData = new FormData();
		formData.append('csvfile', csvfile.files[0]);

		fetch('/api/import', {
			method: 'POST',
			body: formData
		}).then(res => res.json())
			.then(res => {
				const { jsonObj, success } = res;
				localStorage.setItem('jsonObj', JSON.stringify(jsonObj));
				console.log(success);
			});
	};

	handleChange(event) {
		const { name, value } = event.target;
		this.setState({
			[name]: value
		});
	}
	
	componentDidMount() {
		const link = `http://localhost:3000/stream`;
		const es = new EventSource(link);
		es.addEventListener('myEvent', ev => {
		    console.log(ev.data);
		});

		const _this = this;
		new window.FroalaEditor('.selector', {
			attribution: false,
			placeholder: 'enter',
			// Set the file upload URL.
		    //imageUploadURL: 'image_upload',
		    imageUploadParams: {
		        id: 'my_editor'
		    },
			events: {
				contentChanged: function(){
					_this.setState({
						body: this.html.get(),
					})
				}
			}
		});
	}

	render(){
		const { subject, data } = this.state;
		return (
			<div id="mailform">
				<div>Your available "variable" use {'{Fname}'} for "First name"</div>
				<div>Your available "variable" use {'{Lname}'} for "Last name"</div>
				{ //<div dangerouslySetInnerHTML={{__html: testing}} />//
			}
				<form onSubmit={this.handleCsv}>
				    <input
				    	required
						type="file"
						accept="text/csv"
						onChange={(e) => this.setState({ csvfile: e.target})}
					/>
				    <button>Import</button>
				</form>
				<form onSubmit={this.handleSubmit}>
					<div> Recipients: {data.length} people </div>
					<div>Variables: {Object.keys(data[0])}</div>
					<div className="row2">
						<input
							name="subject"
							onChange={this.handleChange}
							value={subject}
							required
							placeholder="Enter Subject"
						/>
					</div>
					<div className="row2" >
						<textarea className="selector">
							
						</textarea>
					</div>
					<div className="row3">
						<button>Send</button>
					</div>
				</form>
			</div>
		);
	}
}

export default SendMailForm;
