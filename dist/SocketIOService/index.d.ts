import { Server as SocketIOServer, Socket } from 'socket.io';
import { RocketService } from '../ManageService';
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
        devices: string[];
    };
}
declare class SocketIOInstance extends RocketService {
    constructor(port: number);
    private handleDataMqtt;
    private handleFromDatabase;
    onReceiveMessage(payload: string): void;
    onConnected(socket: Socket): void;
    onDisconnected(socket: Socket, reason: string): void;
    onConnection(socket: Socket): void;
    validateAuthentication(socket: Socket, next: (err?: Error) => void): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
    port: number;
    io: SocketIOServer;
    cacheInfoUser: InfoClientSocketCache;
}
declare const _default: SocketIOInstance;
export default _default;
