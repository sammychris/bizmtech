const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly','https://www.googleapis.com/auth/gmail.modify',
'https://www.googleapis.com/auth/gmail.compose','https://www.googleapis.com/auth/gmail.send'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

function mail(callback) {
  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Gmail API.
    //authorize(JSON.parse(content), listLabels);
    //authorize(JSON.parse(content), SendMails);
    authorize(JSON.parse(content), callback)
  });
}


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listLabels(auth) {
  const gmail = google.gmail({version: 'v1', auth});
  gmail.users.labels.list({
    userId: 'me',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const labels = res.data.labels;
    if (labels.length) {
      console.log('Labels:');
      labels.forEach((label) => {
        console.log(`- ${label.name}`);
      });
    } else {
      console.log('No labels found.');
    }
  });
}


/*
All the index.js code from first article 
*/

function SendMails(auth){
    var Mail = require('./createMail.js');

    // const users = [
    //   { "First name": "Ebuka Okanume", 'email':"sammychrise@gmail.com" },
    //   { "First name": "Samuel Okanume", 'email':"ebusameric@yahoo.com" }
    // ];


    // for(let i = 0; i < users.length; i++){
    //   const user = users[i];
    //   // Auth, Emails, Subject, Body, Mail,
    //   var obj = new Mail(auth, user['email'], subject,  `
    // Hey ${user['First name']}, How are you doing it me samuel.
    // Using this platform to test my work.

    // Done.`, 'mail', []);
      
      //'mail' is the task, if not passed it will save the message as draft.
      //attachmentSrc array is optional.
      //obj.makeBody();
      //This will send the mail to the recipent.
    //}
}


// function customize() {
//   var transporter = nodemailer.createTransport({
//    service: 'gmail',
//    auth: {
//         user: 'ebusameric@gmail.com',
//         pass: '09076272351'
//     }
//   });


//   const mailOptions = {
//     from: 'ebusameric@gmail.com', // sender address
//     to: 'sammychrise@gmail.com', // list of receivers
//     subject: 'Subject of your email', // Subject line
//     html: '<p><em>The</em> editor can use <code>BR</code> tags. When ENTER key is hit, a <code>BR</code> tag is inserted...</p>'// plain text body
//   };


//   transporter.sendMail(mailOptions, function (err, info) {
//      if(err)
//        console.log(err)
//      else
//        console.log(info);
//   });
// }

//customize();


function checkMails(callback){
  const Check = require('./Check');
  const getAuth = (auth) => {
    var obj = new Check(auth);

    obj.checkForMediumMail();
  }
  mail(getAuth);
}


function sendMails(obj, callback){
  const createMail = require('./createMail.js');
  const { data, subject, body } = obj;
  const getAuth = (auth) => {
    const dataVal = {};
    let emailKey;
    let nextItem = 1;
      for(let key in data[0]) {
        let newKey = key.replace(/\s/g, '').toLowerCase();
        if(/email/.test(newKey)) emailKey = newKey;
        dataVal[newKey] = key;
      }

      for(let person of data) { // loop through each users
        let email = person[dataVal[emailKey]];
        let newBody = body;
        let isLastItem = !data[nextItem]; // if no next item
        for(let key in dataVal){ // loop through the body to find the variables
          const find = new RegExp(`{${key}}`,'gi');
          newBody = newBody.replace(find, person[dataVal[key]]);  // find and replace the variables
        }
        ///////////////////////// (Auth, Email, Subject, Body, Mail, attachmentSrc)...
        const obj = new createMail(auth, email, subject, newBody);
        // 'mail' is the task, if not passed it will save the message as draft.
        // attachmentSrc array is optional.

        obj.makeBody(callback, isLastItem);
        nextItem++;
      }
  }
  mail(getAuth);
}


module.exports = { sendMails, checkMails };
