const express = require("express");
const app = express();
const PORT = process.env.PORT || 4002;

const amqp = require('amqplib');

const receiveMessage = async () => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const queueName = 'hello';

  channel.assertQueue(queueName, { durable: false });
  console.log(`Waiting for messages in queue: ${queueName}`);

  channel.consume(
    queueName,
    (message) => {
      console.log(`Received message: ${message.content.toString()}`);
      channel.ack(message);
    },
    { noAck: false }
  );
};

receiveMessage().catch((error) => console.error(error));

app.use(express.json());
app.listen(PORT, () => console.log("Server running at port " + PORT));