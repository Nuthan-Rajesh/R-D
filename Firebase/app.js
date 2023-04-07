const express = require("express")
const bodyparser = require('body-parser');
const { admin } = require('./firebase-config');
const firebaseController = require('./firebase-config');
const routes = require('./route');
require("./message")

const app = express()
app.use(bodyparser.json())

const port = 3001
const notification_options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
  };
app.post('/firebase/notification', (req, res)=>{
    const  registrationToken = req.body.registrationToken
    const message = req.body.message
    const options =  notification_options
    console.log(registrationToken);
    
      admin.messaging(message_notification).sendToDevice(registrationToken, message, options)
      .then( response => {

       res.status(200).send("Notification sent successfully")
       
      })
      .catch( error => {
          console.log(error);
      });

});



app.post('/send-notification', firebaseController.sendNotification);

app.post('/api', routes);

app.listen(port, () =>{
console.log("listening to port"+port)
})