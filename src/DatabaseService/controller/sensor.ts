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
  const sensorExist = await SensorMD.findOne({ by_device: deviceId });

  if (sensorExist) {
    /* update sensor */
    await SensorMD.updateOne(
      { by_device: deviceId },
      {
        $push: {
          smoke: { value: smoke, update_at: new Date() },
          'env.temperature': { value: temperature, update_at: new Date() },
          'env.humidity': { value: humidity, update_at: new Date() },
        },
      }
    ).exec();

    return {
      smoke: { value: smoke, time_at: date },
      env: {
        humidity: { value: humidity, time_at: date },
        temperature: { value: temperature, time_at: date },
      },
    };
  } else {
    /* create sensor */
    const newSensor = new SensorMD({
      by_device: deviceId,
      env: {
        humidity: humidity ? [{ value: humidity, update_at: new Date() }] : [],
        temperature: temperature
          ? [{ value: temperature, update_at: new Date() }]
          : [],
      },
      smoke: smoke ? [{ value: smoke, update_at: new Date() }] : [],
    });
    await newSensor.save();

    return {
      smoke: { value: smoke, time_at: new Date() },
      env: {
        humidity: { value: humidity, time_at: new Date() },
        temperature: { value: temperature, time_at: new Date() },
      },
    };
  }
};
