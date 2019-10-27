import React from 'react';


function MailSettings() {
	return (
		<div id="mailer">
			<div>
				<div>Send test: </div>
				<form>
					<input 
						placeholder="example@gmail.com"
					/>
					<button>Send Test Email</button>
				</form>
			</div>
			<div>
				<div>Personalize: </div>
				<div>
					<span>First Name</span>
					<span>Last Name</span>
					<span>Email Address</span>
				</div>
			</div>
			<div>
				<div>Compose as: </div>
				<div>
					<span>New messages<input name="compose" type="radio"/></span>
					<span>Replies<input name="compose" type="radio" /></span>
				</div>
			</div>
			<div>
				<div>Action: </div>
				<div>
					<span>Send<input name="action" type="radio"/></span>
					<span>Just create Drafts<input name="action" type="radio" /></span>
				</div>
			</div>
			<div>
				<div>Spread out: </div>
				<div>
					Send <input type="number" defaultValue='450'/> emails/day
				</div>
			</div>
			<div>
				<div>Send when: </div>
				<div>
					<input
						defaultValue='Now'
						type="time"
					/>
				</div>
			</div>
			<div>
				<button>Next</button>
			</div>
		</div>
	);
}

export default MailSettings;
