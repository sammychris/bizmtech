const multer = require('multer');
const csv = require('csvtojson');
const SSEChannel = require('sse-pubsub');

const { sendMails } = require('../mail');
const channel = new SSEChannel();
const csvFilePath = __dirname + "/../csv/contacts.csv";



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/../csv/')
  },
  filename: function (req, file, cb) {
    cb(null, 'contacts.csv') // file.fieldname + '-' + Date.now())
  }
})
 
const uploadCsv = multer({ storage }).single('csvfile');


function divideArr(arr, dividedBy){
    let copyArr = [...arr];
    let newArr = [];
    while(copyArr[0]){
        newArr.push(copyArr.splice(0, dividedBy));
    }
	return newArr;
}

const allRequest = [{
	request:[
		{date: "Wed Nov 13 2019", number: 1, status: "sent", time: "14:45"},
		{date: "Thu Nov 14 2019", number: 1, status: "waiting", time: "14:45"},
		{date: "Fri Nov 15 2019", number: 1, status: "waiting", time: "14:45"}
	],
	id: 565654,
}];

const timeStocker = {'565654': [{Timeout: 'just'}, {TimeIn: 'welcome'}]};

module.exports = function (app) {

	app.delete('/api/sendmail/:id', (req, res) => {
		console.log(timeStocker)
		const { id } = req.params;
		const timeArr = timeStocker[id];
		if(!timeArr) return res.json({ message: 'nothing to delete!'});
		for(let i = 0; i < timeArr.length; i++) clearInterval(timeArr);
		const item = allRequest.find(a => a.id == id);
		delete timeStocker[id];
		return res.json({ message: 'Delete the request with id '+id})
	})

	app.post('/api/sendmail', (req, res) => {
		//////  Data, Subject, Body,
		const { data, subject, body, startTime, now, daily } = req.body;
		const mailsPerDay = divideArr(data, Number(daily)); // number of mails per day: depends on the user..
		const waitingMails = [];
		const myId = Math.round(Math.random() * 9999999) + 1;
		timeStocker[myId] = []; // to keep track of timer...
		let begin = Number(startTime);

		if(now) begin = 100;

		const startTimeout = setTimeout( () => {
			let trackItem = 0; // current item 

			sendMails({ data: mailsPerDay[trackItem], subject, body}, (err, result) => {
				if (err) return res.json({ message: '!could not send'});
				waitingMails[trackItem].status = 'sent';
				return channel.publish({ message: `Completed Today's Message` }, 'e');
			});

			if (mailsPerDay.length > 1){
				const scheduler = setInterval( () => {
					trackItem++;
					sendMails({ data: mailsPerDay[trackItem], subject, body}, (err, result) => {
						if (err) { 
							clearInterval(scheduler);
							return channel.publish({ message: '!could not send'}, 'e');	
						}
						if(!mailsPerDay[trackItem + 1]){ // if no next item...
							clearInterval(scheduler); 
							waitingMails[trackItem].status = 'sent';
							return channel.publish({ message: `Sent All Messages!`}, 'e');
						}
						waitingMails[trackItem].status = 'sent';
						return channel.publish({ message: `Completed Today's Message!`}, 'e');
					});
				}, 50000)//24 * (60 * (60 * 1000)));  // 25hrs 

				timeStocker[myId].push(scheduler); //....
			}

		}, begin ); // Time the test should start...

		timeStocker[myId].push(startTimeout); //.....

		for(let i = 0; i < mailsPerDay.length; i++) {
			const date = new Date();
			date.setDate(date.getDate()+i);
			waitingMails.push({ 
				date: date.toDateString(),
				number: mailsPerDay[i].length,
				status: 'waiting',
				time: date.getHours() +":"+ date.getMinutes(),
			});
		}

		allRequest.push({ request: waitingMails, id: myId });
		return res.json({ message: 'Your Messages request has begin!' });
	});

	app.get('/api/sendmail', (req, res) => {
		console.log(timeStocker);
		res.status(200).json(allRequest);
	});


	app.post('/api/testmail', (req, res) => {
		//////  Data, Subject, Body,
		const { data, subject, body } = req.body;
		sendMails({ data, subject, body}, (err, result) => {
			if (err) return res.json({ message: '!could not send'});
			return res.json({ message: 'Test mail sent!' });
		})		
	});


	app.post('/api/import', uploadCsv, (req, res) => {
	    csv()
		.fromFile(csvFilePath)
		.then((jsonObj)=>{
			days = jsonObj;
		    return res.json({success : "Data imported successfully.", jsonObj}); 
		})
	    
	})


	app.get('/api/stream', (req, res) => {
		channel.subscribe(req, res);
	});

}
