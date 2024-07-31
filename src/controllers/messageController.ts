import { KafkaMessage } from "kafkajs";
import { ISocket } from "../types";

// Import controllers
import webhookTopicController from "./topic/exampleWebhookController";
import websocketTopicController from "./topic/exampleWebsocketController";

// Main controller for handling kafka message
export default function messageController(topic: string , partition: number, message: KafkaMessage, sockets: ISocket[]): void {
    switch(topic) {
        case "EXAMPLE_WEBSOCKET_TOPIC": {
            // do logic
            websocketTopicController(topic, sockets, message);
            break;
        }	
        case "EXAMPLE_WEBHOOK_TOPIC": {
            // do logic
            webhookTopicController(topic, message);
            break;
        }
        default: {
            // default statement
            break;
        }
    }
}