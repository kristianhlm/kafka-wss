declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV: string
        PORT: number
        USE_SSL: string
        
        SSL_KEY_PATH: string
        SSL_CERT_PATH: string
        SSL_CA_PATH: string

        KAFKA_CLIENT_ID: string
        KAFKA_BROKERS: string
        CONSUMER_GROUP_ID: string
        KAFKA_TOPICS: string
      }
    }
  }
  
  export {};