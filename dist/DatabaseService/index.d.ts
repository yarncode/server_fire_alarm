import msgQueue from 'bull';
import { RocketService } from '../ManageService';
import { DataSensor } from './models/sensor';
import { DataStateDevice } from './models/devices';
import { DataStateInfoIO, GpioState } from './models/gpio';
export interface DeviceInfo {
    userId: string;
    deviceId: string;
    mac: string;
}
export interface IoState extends DeviceInfo {
    data: GpioState;
}
export interface InfoIo extends DeviceInfo {
    data: DataStateInfoIO;
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
    private handleUpdateIo;
    private handleUpdateStateDevice;
    private handleSyncIo;
    private onHandleUpdateStateDeviceCompleted;
    private onHandleSyncIoCompleted;
    private onHandleUpdateSensorCompleted;
    private onHandleUpdateIoCompleted;
    onReceiveMessage(payload: string): void;
    onMongoConnected(): void;
    onMongoFailure(): void;
    start(): void;
    stop(): void;
    port: number;
    queueSensor: msgQueue.Queue<InfoSensor>;
    queueStateIO: msgQueue.Queue<IoState>;
    queueStateDevice: msgQueue.Queue<InfoStateDevice>;
    queueSyncIo: msgQueue.Queue<InfoIo>;
}
declare const _default: DatabaseInstance;
export default _default;
