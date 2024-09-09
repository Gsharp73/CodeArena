require('dotenv').config();
const amqp = require('amqplib/callback_api');

function connectToRabbitmq() {
  return new Promise((resolve, reject) => {
    // Connect to RabbitMQ server
    amqp.connect('amqp://localhost', (err, connection) => {
      if (err) {
        console.error("Error connecting to RabbitMQ:", err);
        return reject(err);
      }
      connection.createChannel((err1, channel) => {
        if (err1) {
          console.error("Error creating channel:", err1);
          return reject(err1); 
        }

        console.log("Connected to RabbitMQ successfully");
        resolve(channel);
      });
    });
  });
}

module.exports = {
  connectToRabbitmq
};
