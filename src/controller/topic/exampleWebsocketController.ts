import { KafkaMessage } from "kafkajs";
import { ISocket } from "../../types";

/* 
    Example controller for handling kafka topic with websocket.
    This example is very basic, convert message to json and send to matching receivers.
    You modify with your own logic and operations if needed.
*/
export default function websocketTopicController(topic: string, sockets: ISocket[], message: KafkaMessage) {
    // Parse kafka message body to JSON format
    const stringJson = message.value == null ? "" : message.value.toString();
    const startIndex = stringJson.indexOf("{");
	const sendObj = JSON.parse(stringJson.substring(startIndex, stringJson.length));

    // send to matching sockets
    for(let i = 0 ; i < sockets.length; i++){
        if (sockets[i].topic == topic) sockets[i].socket.send(JSON.stringify(sendObj));
    }
}