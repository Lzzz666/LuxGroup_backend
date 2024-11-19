const kafka = require('kafka-node');

const kafkaClient = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const consumer = new kafka.Consumer(
    kafkaClient,
    [{ topic: 'face-coordinates', partition: 0 }],
    { autoCommit: true }
);

consumer.on('message', (message) => {
    console.log('Received message from Kafka:', JSON.parse(message.value));
});

consumer.on('error', (err) => {
    console.error('Error in Kafka Consumer:', err);
});