import { Server } from 'net';
import Aedes, { Client, AedesPublishPacket, PingreqPacket, AuthenticateError } from 'aedes';
import { ActionPayload } from '../Constant/interface';
import { RocketService } from '../ManageService';
export interface DataMqtt {
    topic: string;
    mac: string;
    action: Array<ActionPayload>;
    emitEvent: string;
    userId: string;
    data: any;
}
export declare const MQTT_SERVICE_NAME = "mqtt-service";
interface InfoClientMQTTCache {
    [clientId: string]: {
        userId: string;
        mac: string;
    };
}
declare class MqttInstance extends RocketService {
    constructor(port: number);
    private handleSensor;
    onReceiveMessage(payload: string): void;
    onConnected(client: Client): void;
    onDisconnected(client: Client): void;
    onPing(packet: PingreqPacket, client: Client): void;
    onPublished(packet: AedesPublishPacket, client: Client | null): void;
    onAuthentication(client: Client, username: Readonly<string | undefined>, password: Readonly<Buffer | undefined>, done: (error: AuthenticateError | null, success: boolean | null) => void): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
    port: number;
    aedes: Aedes;
    server: Server;
    cacheInfoDevice: InfoClientMQTTCache;
}
declare const _default: MqttInstance;
export default _default;
