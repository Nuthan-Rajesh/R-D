const amqp = require('amqplib/callback_api');
const express = require('express');
const app = express();

// Set up RabbitMQ connection
let data = [];
amqp.connect('amqp://localhost', function (error0, connection) {
  if (error0) {
    throw error0;
  }

  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    const queue = 'requests_queue';

    // Set up RabbitMQ queue to receive data
    channel.assertQueue(queue, {
      durable: false
    });
    console.log('Waiting for messages in queue:', queue);

    // Consume messages from the queue
    channel.consume(queue, function (message) {
      const requestData = message.content.toString();
      console.log('Received data:', requestData);

      data.push(requestData);

      // app.get('/receive-data', (req, res) => {
      //   res.send('Data received from RabbitMQ: ' + requestData);
      // });
    }, {
      noAck: false
    });
  });
});

// // Set up API endpoint to receive data from RabbitMQ
app.get('/receive-data', (req, res) => {
  res.send('Data received from RabbitMQ: ' + data);
});

// Start the API server
app.listen(4000, () => console.log('API server running on port 4000'));
