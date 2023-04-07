const express = require('express');
const router = express.Router();

const notificationController = require('./controllers/notificationController');

router.post('/sendNotification/:userId', notificationController.sendNotification);

module.exports = router;
