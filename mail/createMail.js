const {google} = require('googleapis');
const mailComposer = require('nodemailer/lib/mail-composer');
    
class CreateMail{
    
    constructor(auth, to, sub, body, task = 'mail', attachmentSrc = []){
        this.me = 'me';
        this.task = task;
        this.auth = auth;
        this.to = to;
        this.sub = sub;
        this.body = body;
        this.gmail = google.gmail({version: 'v1', auth});
        this.attachment = attachmentSrc;
    }

    makeBody(callback, isLastItem){
        var arr = [];
        for (var i=0;i<this.attachment.length;i++) {
            arr[i] = {
                path: this.attachment[i],
                encoding: 'base64'
            }
        }
        let mail;
        //Mail Body is created.
        if (this.attachment.length){
            mail = new mailComposer({
                to: this.to,
                html: this.body,
                subject: this.sub,
                textEncoding: "base64",
                attachments: arr
            }); 
        }
        else {
            mail = new mailComposer({
                to: this.to,
                html: this.body,
                subject: this.sub,
                textEncoding: "base64"
            });
        }
        
        //Compiles and encodes the mail.
        mail.compile().build((err, msg) => {
            if (err){
                console.log('Error compiling email ' + err);
                return callback(true);
            } 
        
            const encodedMessage = Buffer.from(msg)
              .toString('base64')
              .replace(/\+/g, '-')
              .replace(/\//g, '_')
              .replace(/=+$/, '');
            
            if (this.task === 'mail'){
                this.sendMail(encodedMessage, callback, isLastItem);
            }
            else {
                this.saveDraft(encodedMessage, callback);
            }
        });
    }

    //Send the message to specified receiver.
    sendMail(encodedMessage, callback, isLastItem){
        this.gmail.users.messages.send({
            userId: this.me,
            resource: {
                raw: encodedMessage,
            }
        }, (err, result) => {
            if(err){
                console.log('NODEMAILER - The API returned an error: ' + err);
                return callback(true);
            }       
            console.log("NODEMAILER - Sending email reply from server:", result.data);
            if (isLastItem) callback(false, result.data);
        });
    }

    //Saves the draft.
    saveDraft(encodedMessage, callback){
        this.gmail.users.drafts.create({
            'userId': this.me,
            'resource': {
                 'message': {
                    'raw': encodedMessage
                }
            }
        }, (err, result) => {
            if(err) {
                return callback(true);
            }
            callback(false, result);
        })
    }

    //Deletes the draft.
    deleteDraft(id){
        this.attachment.gmail.users.drafts.delete({
            id: id,
            userId: this.me 
        });
    }

    //Lists all drafts.
    listAllDrafts(){
        this.gmail.users.drafts.list({
            userId: this.me
            }, (err, res) => {
                if(err){
                        console.log(err);
                }
            else{
                console.log(res.data);
            }
        });
    }
}

module.exports = CreateMail;
