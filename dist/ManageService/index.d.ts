import { RedisClientType } from 'redis';
import { DataRocketDynamic, ServiceType } from '../Constant/interface';
declare class RocketService {
    constructor(serviceName: string);
    onReceiveMessage(payload: string): void;
    sendMessage(to: ServiceType, payload: DataRocketDynamic): Promise<void>;
    onConnect(): void;
    onDisconnect(): void;
    onError(err: any): void;
    onReconnect(): void;
    startRocket(): void;
    stopRocket(): void;
    subscriber: RedisClientType;
    publisher: RedisClientType;
    _SERVICE_NAME: string;
}
export { RocketService };
