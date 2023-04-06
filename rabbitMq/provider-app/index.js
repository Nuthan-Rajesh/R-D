const express = require("express");
const app = express();
const PORT = process.env.PORT || 4001;
// const amqp = require("amqplib");

// var channel, connection;  //global variables
// async function connectQueue() {   
//     try {
//         connection = await amqp.connect("amqp://localhost:5672");
//         channel    = await connection.createChannel()
        
//         await channel.assertQueue("test-queue")
        
//     } catch (error) {
//         console.log(error)
//     }
// }

// connectQueue();

const amqp = require('amqplib');

const sendMessage = async () => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const queueName = 'hello';
  const message = 'Hello, world!';

  channel.assertQueue(queueName, { durable: false });
  channel.sendToQueue(queueName, Buffer.from(message));

  console.log(`Sent message: ${message}`);
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
};

// sendMessage()


app.use(express.json());

app.get("/send-msg", (req, res) => {
    
    // data to be sent
    const data = {
        title  : "Six of Crows",
        author : "Leigh Burdugo"
    }
    sendMessage(data)  // pass the data to the function we defined
    console.log("A message is sent to queue")
    res.send("Message Sent"); //response to the API request
    
})

app.listen(PORT, () => console.log("Server running at port " + PORT));