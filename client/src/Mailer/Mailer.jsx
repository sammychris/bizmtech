import React from 'react';
//import { SendMailForm, MailSettings } from '../components';

import { RequestList } from '../components';


class UserRequests extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tick: '',
		}
		this.cancelRequest = this.cancelRequest.bind(this);
	}

	componentDidMount() {
		setInterval(() => this.setState({tick: ''}), 500);
	}

	cancelRequest(id) {
		return () => {
			console.log('....'+id);
			// const allow = window.confirm('Are you sure... you want to do this?');
			// if(!allow) return '';
			fetch('/api/sendmail/'+id, { 
				method: 'DELETE',
				headers: {
			    	'Content-Type': 'application/json'
			    }
			})
			.then(a => a.json())
			.then(a => console.log(a));
		}
	}

	render() {
		const date = new Date();
		const currentD = date.getDate();
		const currentH = date.getHours();
		const currentM = date.getMinutes();
		const currentS = date.getSeconds();
		const { requests } = this.props;
		if(!requests) return '';
		return requests.map(each => {
			return(
				<div id="requests">
					<div className="cancel">
						<i
							onClick={this.cancelRequest(each.id)}
							title="Cancel Request"
							className="fas fa-times"
						></i>
					</div>
				{
	   				each.request.map(e => {
	   					const { date, number, status, time } = e;
	   					if(!time) return '';
	   					const mark = status === 'sent'? "fa-check": "fa-angle-double-right";
	   					const [outHour, outMinute] = time.split(':');
	   					const outDate = date.split(' ')[2];
	   					const hourDifference = outHour - currentH;
	   					let minDifference = outMinute - currentM;
	   					if(minDifference < 0) minDifference = minDifference + 60;
	   					const dateDiff = Number(outDate) - currentD;
	   					const timer = dateDiff+':'+hourDifference+':'+minDifference+':'+(60 - currentS);
	   					return (
		   					<div className={"row "+status}>
		   						<div className="date"><span className="key">Date: </span><span className='d'>{date}</span></div>
					      		<div className="number"><span className="key">Number: </span><span className='n'>{number}</span></div>
					      		<div className="status"><span className="key">Status: </span><span className='s'>{status}</span></div>
					      		<div className="time"><span className="key">Due in: </span><span className='t'>{timer}</span></div>
					      		<div className="state"><i className={"fas "+mark}></i></div>
		   					</div>
	   					)
	   				})
	   			}
	   			</div>
	   		);
		})
  	}
}




class Mailer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			subject: '',
			body: '',
			csvfile: '',
			testmail: '',
			time: '10:10',
			now: true,
			daily: '450',
			currTime: '',
			requests: '',
			data: JSON.parse(localStorage.getItem('jsonObj')),
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleCsvSubmit = this.handleCsvSubmit.bind(this);
		this.handleTestSubmit = this.handleTestSubmit.bind(this);
		this.getUserRequest = this.getUserRequest.bind(this);
		this.timer = this.timer.bind(this);
	}

	timer() {
		const date = new Date();
		const currentHour = date.getHours();
		const currentMinute = date.getMinutes();
		return {
			m: currentMinute,
			h: currentHour,
		}
	}

	handleSubmit(event) {
		event.preventDefault();
		const { subject, body, data, time, now, daily} = this.state;

		const [inputHour, inputMinute] = time.split(':');
		const hourDiff = Number(inputHour) - this.timer().h;
		const minuteDiff = Number(inputMinute) - this.timer().m;
		const h = Math.abs(hourDiff) * (60 * (60 * 1000));
		const s = Math.abs(minuteDiff) * (60 * 1000);
		const startTime = h + s;

		fetch('/api/sendmail', {
			method: 'POST',
			headers: {
		      'Content-Type': 'application/json'
		    },
			body: JSON.stringify({ subject, body, data, startTime, now, daily }),
		}).then(res => res.json())
			.then(res => console.log(res));

		this.setState({ currTime: this.timer().h +":"+ this.timer().m });
	};

	handleCsvSubmit(event) {
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
				this.setState({
					data: jsonObj,
					currTime: this.timer().h +":"+ this.timer().m,
				})
				localStorage.setItem('jsonObj', JSON.stringify(jsonObj));
				console.log(success);
			});
	};

	handleTestSubmit(event) {
		event.preventDefault();
		const { subject, body, testmail } = this.state;
		if(subject.length < 1) return alert('Subject must not be empty');
		if(body.length < 1) return alert('Body must not be empty');
		if(testmail.length < 1) return alert('email for test is required!');
		fetch('/api/testmail', {
			method: 'POST',
			headers: {
		      'Content-Type': 'application/json'
		    },
			body: JSON.stringify({ subject, body, testmail }),
		}).then(res => res.json())
			.then(res => console.log(res));
		this.setState({ currTime: this.timer().h +":"+ this.timer().m });

	}

	handleChange(event) {
		const { name, value } = event.target;
		this.setState({
			[name]: value,
			currTime: this.timer().h +":"+ this.timer().m,
		});
	}
	
	componentDidMount() {
		const es = new EventSource('/api/stream');
		es.addEventListener('e', ev => {
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

		fetch('/api/sendmail')
			.then(a => a.json())
			.then(a => this.setState({ requests: a }));

		this.setState({ currTime: this.timer().h +":"+ this.timer().m });
	}

	getUserRequest() {
		fetch('/api/sendmail')
			.then(a => a.json())
			.then(a => console.log(a));
	}

	render(){
		const { subject, data, now, time, daily, currTime, requests } = this.state;
		const pVar = Object.keys(data[0]).map((a, i)=> <span className="span-var" key={i}>{a}</span>);
		return (
			<div id="mailer">
				<UserRequests requests={requests}/>
				<form onSubmit={this.handleCsvSubmit} >
					<div  className="row4">
				    	<div className="left"><span>Import Your Csv Files First:</span></div>
					    <div className="right">
					    	<input
						    	required
								type="file"
								accept="text/csv"
								onChange={(e) => this.setState({ csvfile: e.target})}
							/>
					    	<button className="spanBtn">Import</button>
					    </div>
					</div>
				</form>
				<form onSubmit={this.handleSubmit}>
					<div className="row4">
						<div className="left"><span>Recipients:</span></div>
						<div className="right"><span><em className="n-people">{data.length+' people'}</em></span></div>
					</div>
					<div className="row4">
						<div className="left"><span>Personalize Variables:</span></div>
						<div className="right">
							<span>{ pVar }</span>
						</div>
					</div>
					<div className="row4">
						For personalize variables use <em>{'{firstname}'}</em> for <span className="span-var">First Name</span> or <em>{'{lastname}'}</em> for <span className="span-var">Last Name</span>
					</div>
					<div className="row2">
						<input
							name='subject'
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
					<div className="row4">
						<div className="left"><span>Spread out:</span></div>
						<div className="right">
							<input type="number" name="daily" defaultValue={daily} required onChange={this.handleChange}/><span>'' Send emails/day</span>
						</div>
					</div>
					<div className="row4">
						<div className="left"><span>Send when:</span></div>
						<div className="right">
							<div id="now">
								<div>Now: </div>
								<input
									type="radio"
									name="t"
									required
									onChange={() => this.setState({ now: true, currTime: this.timer().h +":"+ this.timer().m })}
								/>
							</div>
							<div id="schedule">
								<div id="time">Schedule: <input
									type="radio"
									name="t"
									required
									onChange={() => this.setState({ now: false, currTime: this.timer().h +":"+ this.timer().m })}
								/></div>
								<input
									required
									min={currTime}
									disabled={now}
									type="time"
									name="time"
									value={time}
									onChange={this.handleChange}
								/>
							</div>
						</div>
					</div>
					<div className="row4">
						<div className="left"><span>Test mail before sending:</span></div>
						<div className="right">
							<input
								name='testmail'
								placeholder='example@gmail.com'
								onChange={this.handleChange}
							/>
							<span className="spanBtn" onClick={this.handleTestSubmit}>Send Test Email</span>
						</div>
					</div>
					<div className="row3">
						<button>Send</button>
					</div>
				</form>
			</div>
		);
	}
}

export default Mailer;
