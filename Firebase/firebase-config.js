var admin = require("firebase-admin");

var serviceAccount = require("./signal-3aeeb-firebase-adminsdk-utvqp-f224d91297.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

// module.exports.admin = admin

exports.sendNotification = async (req, res) => {
  try {
    // Define the message you want to send
    const message = {
      notification: {
        title: 'My Notification Title',
        body: 'My Notification Body',
      },
      topic: 'my-topic',
    };

    // Send the message using the Firebase Admin SDK
    const response = await admin.messaging().send(message);

    res.status(200).send(response);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send(error);
  }
};