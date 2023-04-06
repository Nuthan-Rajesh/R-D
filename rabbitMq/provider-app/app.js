const amqp = require('amqplib/callback_api');
const express = require('express');
const app = express();

// Set up RabbitMQ connection
amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }

  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }

    const queue = 'requests_queue';

    // Set up API endpoint to send data to RabbitMQ
    app.post('/send-data', (req, res) => {
      const requestData = req.query.data;

      // Publish the data to the RabbitMQ queue
      channel.assertQueue(queue, {
        durable: false
      });
      channel.sendToQueue(queue, Buffer.from(requestData));

      console.log('Sent data:', requestData);

      // Return response to the API request
      res.send('Data sent to RabbitMQ: ' + requestData);
    });
  });
});

// Start the API server
app.listen(3000, () => console.log('API server running on port 3000'));
