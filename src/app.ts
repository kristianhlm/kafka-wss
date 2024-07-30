// Import libs
import dotenv from "dotenv";
import http, { IncomingMessage } from "http";
import https from "https";
import {Consumer, Kafka} from "kafkajs";
import { v4 as uuidv4 } from 'uuid';
import fs from "fs";
import ws from "ws";
import { IOptionSSL, ISocket } from "./types";
import logger from "./logger/logger";
import messageController from "./controller/messageController";

// Dotenv
dotenv.config();
const port = process.env.PORT;

let server: http.Server | https.Server;
if(process.env.USE_SSL == "true"){
	// Init server HTTPS
	const sslCA: Buffer[] = [], sslPaths: string[] = process.env.SSL_CA_PATH.split(',');
	for(let i = 0 ; i < sslPaths.length ; i++){
		sslCA.push(fs.readFileSync(sslPaths[i]));
	}
	const options: IOptionSSL = {
		key: fs.readFileSync(process.env.SSL_KEY_PATH),
		cert: fs.readFileSync(process.env.SSL_CERT_PATH),
		ca: sslCA
	};
	server = https.createServer(options, (req, res) => {
		// Set header
		res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080/');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
		res.setHeader('Access-Control-Allow-Credentials', 'true');
	});
} else {
	// Init server HTTP. Not recommended for production and websockets. Use HTTPS and WS over TLS
	server = http.createServer((req, res) => {
		// Set header
		res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080/');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
		res.setHeader('Access-Control-Allow-Credentials', 'true');
	});
}
server.listen(port, function(){ console.log('Listening on port : ' + port); }); 

// Init Kafka
const kafka: Kafka = new Kafka({
	clientId: process.env.KAFKA_CLIENT_ID,
	brokers: process.env.KAFKA_BROKERS.split(',')
});
const consumer: Consumer = kafka.consumer({ groupId: process.env.CONSUMER_GROUP_ID || "" });
const topicNames: string[] = process.env.KAFKA_TOPICS.split(',');

// Websockets
let sockets: ISocket[] = [];

// Main
const main = async () => {
    // Connect kafka consumer
    await consumer.connect();
    await consumer.subscribe({topics: topicNames});

    // Websocket server
    const wsServer: ws.Server = new ws.Server({ server });

    // On Connection
	wsServer.on('connection', (socket: ws.WebSocket, req: IncomingMessage) => {
		// Check topic from incoming. it will determine what data they receive
		let topic: string = "default";
		let urlSplit = req.url!.split('/');
		if(urlSplit.length > 1){
			if(urlSplit[1].trim() != ""){
				topic = urlSplit[1];
			}	
		}
		
		// Assign unique id for each connection and save to array
		const uuid: string = uuidv4();
		const socketObject: ISocket = {
			"topic" : topic,
			"id" : uuid,
			"socket" : socket
		};
		sockets.push(socketObject);
		logger("Open Connection (total: " + sockets.length + " conn). user/uuid: " + topic + "/" + uuid);
		
        // Handle client close connection
		socket.on('close', function (event) {
            // Remove closed connection from sockets
			const index: number = sockets.findIndex(function(item, i){
				return item.id === uuid
			});
			sockets.splice(index,1);
			logger("Close Connection (total: " + sockets.length + " conn). user/uuid: " + topic + "/" + uuid);
		}); 
	});
	
	// Run consumer		
	consumer.run({
		autoCommit: true,
		eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
			// Handle kafka message
			messageController(topic, partition, message, sockets);
		},
	});	
}
main()
