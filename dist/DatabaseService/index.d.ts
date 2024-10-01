import { RocketService } from '../ManageService';
export declare const DATABASE_SERVICE_NAME = "db-service";
declare class DatabaseInstance extends RocketService {
    constructor(port: number);
    onReceiveMessage(payload: string): void;
    onMongoConnected(): void;
    onMongoFailure(): void;
    start(): void;
    stop(): void;
    port: number;
}
declare const _default: DatabaseInstance;
export default _default;
