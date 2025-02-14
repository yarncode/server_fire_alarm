import { API_SERVICE_NAME } from '../APIService';
import { DATABASE_SERVICE_NAME } from '../DatabaseService';
import { MQTT_SERVICE_NAME } from '../MqttService';
import { SOCKET_IO_SERVICE_NAME } from '../SocketIOService';

export type ServiceType =
  | typeof API_SERVICE_NAME
  | typeof DATABASE_SERVICE_NAME
  | typeof MQTT_SERVICE_NAME
  | typeof SOCKET_IO_SERVICE_NAME;

export type ActionPayload = 'GET' | 'SET' | 'NOTIFY' | 'CONTROL' | 'CONFIG';

export type TDataMqtt = undefined | string | object;
export interface QueuePayloadRequest<T = any> {
  code: string;
  action: ActionPayload;
  payload: T;
}

export interface QueuePayloadResponse {
  code: string;
  data: any;
}

export interface PayloadRocket {
  [key: string]: any;
}

export interface DataRocketDynamic<P = any> {
  service: ServiceType;
  action: ActionPayload;
  code: string;
  payload: P;
}
