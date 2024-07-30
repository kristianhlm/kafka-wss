import {WebSocket} from "ws";

export interface IOptionSSL {
  key: Buffer;
  cert: Buffer;
  ca: Buffer[];
}

export interface ISocket {
  topic: string;
  id: string;
  socket: WebSocket;
}