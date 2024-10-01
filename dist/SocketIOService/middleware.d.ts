import { Socket } from 'socket.io';
export declare const main_auth: {
    validate_token: (socket: Socket, next: (err?: Error) => void) => Promise<void>;
};
