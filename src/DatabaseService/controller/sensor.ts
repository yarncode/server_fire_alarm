import { InfoSensor } from '..';
import { SensorMD } from '../models/sensor';

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

export const updateSensor = async (
  sensor: InfoSensor
): Promise<ResponseDataSensor> => {
  const { deviceId, data } = sensor;
  const { humidity, smoke, temperature } = data;

  /* generate date */
  const date = new Date();
  /* check sensor is exist */
  return {
    smoke: { value: smoke, time_at: date },
    env: {
      humidity: { value: humidity, time_at: date },
      temperature: { value: temperature, time_at: date },
    },
  };
};
