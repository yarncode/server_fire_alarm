import { Server as SocketIOServer, Socket } from 'socket.io';
import { RocketService } from '../ManageService';
import { GpioState } from '../DatabaseService/models/gpio';
export declare const SOCKET_IO_SERVICE_NAME = "socket-io-service";
export interface DataSocket {
    mac: string;
    userId: string;
    deviceId: string;
    data: any;
}
interface InfoClientSocketCache {
    [clientId: string]: {
        userId: string;
        devices: {
            id: string;
            mac: string;
        }[];
    };
}
interface InfoDeviceLinkClient {
    [deviceId: string]: string[];
}
interface BasePayload<T> {
    mac: string;
    userId: string;
    deviceId: string;
    data: T;
}
declare class SocketIOInstance extends RocketService {
    constructor(port: number);
    private handleDataMqtt;
    private handleFromDatabase;
    private deviceBoardcastMsg;
    onReceiveMessage(payload: string): void;
    onConnected(socket: Socket): void;
    onDisconnected(socket: Socket, reason: string): void;
    onControl(socket: Socket, data: BasePayload<GpioState>): void;
    removeCacheBySocketId(socketId: string): void;
    validateBasePayload(payload: BasePayload<GpioState>): boolean;
    onConnection(socket: Socket): void;
    validateAuthentication(socket: Socket, next: (err?: Error) => void): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
    port: number;
    io: SocketIOServer;
    cacheClientLinkDevice: InfoClientSocketCache;
    cacheDeviceLinkClient: InfoDeviceLinkClient;
}
declare const _default: SocketIOInstance;
export default _default;
