import { Server as SocketIOServer, Socket } from 'socket.io';
import { RocketService } from '../ManageService';
export declare const SOCKET_IO_SERVICE_NAME = "socket-io-service";
declare class SocketIOInstance extends RocketService {
    constructor(port: number);
    onReceiveMessage(payload: string): void;
    onConnected(socket: Socket): void;
    onDisconnected(socket: Socket, reason: string): void;
    onConnection(socket: Socket): void;
    start(): Promise<void>;
    stop(): Promise<void>;
    port: number;
    io: SocketIOServer;
}
declare const _default: SocketIOInstance;
export default _default;
