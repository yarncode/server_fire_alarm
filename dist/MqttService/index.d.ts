import { Server } from 'net';
import Aedes, { Client, AedesPublishPacket, PingreqPacket, AuthenticateError } from 'aedes';
import { RocketService } from '../ManageService';
export interface DataMqtt {
    topic: string;
    mac: string;
    userId: string;
    deviceId: string;
    data: any;
}
export declare const MQTT_SERVICE_NAME = "mqtt-service";
interface InfoClientMQTTCache {
    [clientId: string]: {
        userId: string;
        deviceId: string;
        mac: string;
    };
}
interface LinkDeviceCache {
    [deviceId: string]: {
        ctx: Client;
    };
}
export interface NotifyPayload {
    timestamp?: number;
    _type?: string;
}
export interface NotifyIoPayload extends NotifyPayload {
    input?: boolean[];
    output?: boolean[];
}
declare class MqttInstance extends RocketService {
    constructor(port: number);
    private handleDeviceActive;
    private handleSensor;
    private handleNotify;
    private handleIoOutput;
    private handleIoInput;
    private handleStateDevice;
    private handleDataSocketIo;
    private handleDataApi;
    onReceiveMessage(payload: string): void;
    onConnected(client: Client): void;
    onDisconnected(client: Client): void;
    onPing(packet: PingreqPacket, client: Client): void;
    onPublished(packet: AedesPublishPacket, client: Client | null): void;
    onAuthentication(client: Client, username: Readonly<string | undefined>, password: Readonly<Buffer | undefined>, done: (error: AuthenticateError | null, success: boolean | null) => void): Promise<void>;
    sendPayload(id: string, topic: string, msg: string): void;
    setClientCache(client: Client, deviceId: string, userId: string, mac: string): void;
    getClientByDeviceId(deviceId: string): Client | undefined;
    getClientByClientId(clientId: string): Client | undefined;
    removeCacheByDeviceId(deviceId: string): void;
    removeCacheByClientId(clientId: string): void;
    start(): Promise<void>;
    stop(): Promise<void>;
    port: number;
    aedes: Aedes;
    server: Server;
    cacheInfoClient: InfoClientMQTTCache;
    cacheLinkDevice: LinkDeviceCache;
}
declare const _default: MqttInstance;
export default _default;
