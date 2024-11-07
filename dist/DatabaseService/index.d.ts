import msgQueue from 'bull';
import { RocketService } from '../ManageService';
import { DataSensor } from './models/sensor';
import { DataStateDevice } from './models/devices';
export interface DeviceInfo {
    userId: string;
    deviceId: string;
    mac: string;
}
export interface InfoSensor extends DeviceInfo {
    data: DataSensor;
}
export interface InfoStateDevice extends DeviceInfo {
    data: DataStateDevice;
}
export declare const DATABASE_SERVICE_NAME = "db-service";
declare class DatabaseInstance extends RocketService {
    constructor(port: number);
    private handleDataMqtt;
    private handleUpdateSensor;
    private handleUpdateStateDevice;
    private onHandleUpdateStateDeviceCompleted;
    private onHandleUpdateSensorCompleted;
    onReceiveMessage(payload: string): void;
    onMongoConnected(): void;
    onMongoFailure(): void;
    start(): void;
    stop(): void;
    port: number;
    queueSensor: msgQueue.Queue<InfoSensor>;
    queueStateDevice: msgQueue.Queue<InfoStateDevice>;
}
declare const _default: DatabaseInstance;
export default _default;
