import { KafkaMessage } from "kafkajs";
import axios from "axios";
import logger from "../../logger/logger";

/* 
    Example controller for handling kafka topic with sending data to webhook.
    This example is very basic, convert message to json and send to webhook.
    You modify with your own logic and operations if needed.
*/
export default function webhookTopicController(topic: string, message: KafkaMessage) {
    // Parse kafka message body to JSON format
    const stringJson = message.value == null ? "" : message.value.toString();
    const startIndex = stringJson.indexOf("{");
	const sendObj = JSON.parse(stringJson.substring(startIndex, stringJson.length));

    // Axios config
    const webhookUrl: string = "http://localhost:8080/";
    const webhookHeaders = {
        'Content-Type': 'application/json'
    }
    const webhookBody = sendObj;

    // Send to webhook with axios
    axios.post(webhookUrl, webhookBody, {headers : webhookHeaders}).then(res => {
		// Handle axios success
		logger(res);
	})
	.catch(error => {
		// Handle axios error
        logger(error);
	})
    .finally(() => {
        // Handle axios finally
        logger("finally");
    })
}