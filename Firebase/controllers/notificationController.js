const admin = require('firebase-admin');

exports.sendNotification = async (req, res) => {
    try {
        const { userId } = req.params;

        // Get the FCM token for the user with the specified ID
        // const userSnapshot = await admin.firestore().collection
        // Get the FCM token for the user with the specified ID
        const userSnapshot = await admin.firestore().collection('users').doc(userId).get();
        const userData = userSnapshot.data();
        const fcmToken = userData.fcmToken;

        // Set the message to send
        const message = {
            notification: {
                title: 'New Notification',
                body: 'This is a new notification!',
            },
            token: fcmToken,
        };

        // Send the message using the Firebase Admin SDK
        const response = await admin.messaging().send(message);

        res.status(200).json({ success: true, response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error });
    }
};

