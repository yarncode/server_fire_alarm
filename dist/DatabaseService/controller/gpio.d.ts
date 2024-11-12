import { InfoIo, IoState } from '..';
import { GpioState } from '../models/gpio';
export interface ResponseInfoIo {
    deviceId: string;
    data: {
        input: boolean[];
        output: boolean[];
    };
}
export interface ResponseGpioState {
    deviceId: string;
    data: GpioState;
}
export declare const createGpio: (info: InfoIo) => Promise<ResponseInfoIo>;
export declare const updateGpio: (info: IoState) => Promise<ResponseGpioState>;
