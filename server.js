const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const kafka = require('kafka-node');



const app = express();
const port = 3000;
const allowedOrigins = ['https://lzzz666.github.io/LuxGroupVC_Web/', 'http://localhost:5173'];
const kafkaClient = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const producer = new kafka.Producer(kafkaClient);

producer.on('ready', () => {
    console.log('Kafka producer is ready');
});

producer.on('error', (error) => {
    console.error('Error in Kafka producer', error);
});


app.use(cors({
    origin: function(origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  }));

// 解析 JSON 請求體
app.use(bodyParser.json());

// 設定 POST 路由來接收人臉座標
app.post('/face-coordinates', (req, res) => {
    const messages = req.body.map((face) => JSON.stringify(face)); // 每個資料轉成字串
    const payloads = [
        { topic: 'face-coordinates', messages },
    ]; 

    producer.send(payloads, (error, data) => {
        if (error) {
            console.error('Error in sending message to Kafka', error);
            return res.status(500).send({ message: 'Error in sending message to Kafka' });
        }

        console.log('Message sent to Kafka:', data);
        res.status(200).send({ message: 'Coordinates received successfully' });
    });

});

// 啟動伺服器
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
