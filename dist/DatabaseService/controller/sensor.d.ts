import { InfoSensor } from '..';
export interface ResponseDataSensor {
    smoke: {
        value: number;
        time_at: Date;
    };
    env: {
        humidity: {
            value: number;
            time_at: Date;
        };
        temperature: {
            value: number;
            time_at: Date;
        };
    };
}
export declare const updateSensor: (sensor: InfoSensor) => Promise<ResponseDataSensor>;
