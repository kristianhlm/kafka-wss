## Kafka-WSS

Simple boilerplate for KafkaJS combined with websockets that are easy to use. 

## Quick-Start

1.  Create .env file. Format can be seen from .env.example
2.  Update files in controller folder to handle your incoming Kafka messages.
     * /src/controller/messageController.ts is the main handler. Add your kafka topic and call your topic handler from here.
     * /src/controller/topic is the folder that contain topic handlers. Some example already provided for handling websocket and webhook
3.  Run npm run build. Build the app to the dist folder.
4.  Run npm start. Start the app from the dist folder.
