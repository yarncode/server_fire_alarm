import mongoose, { Schema } from 'mongoose';

/* my import */
import { MODEL_DEVICE_NAME } from './devices';

export interface DataSensor {
  smoke: number;
  humidity: number;
  temperature: number;
}

export const MODEL_SENSOR_NAME = 'Sensor';
export const MODEL_SENSOR_PAYLOAD_NAME = 'SensorPayload';

export type SensorType = 'smoke' | 'humidity' | 'temperature' | 'gas';

const Sensor = new Schema(
  {
    by_device: { ref: MODEL_DEVICE_NAME, type: Schema.Types.ObjectId },
    smoke: [{ value: Schema.Types.Number, update_at: Schema.Types.Date }],
    env: {
      humidity: [{ value: Schema.Types.Number, update_at: Schema.Types.Date }],
      temperature: [
        { value: Schema.Types.Number, update_at: Schema.Types.Date },
      ],
    },
    gas: [{ value: Schema.Types.Number, update_at: Schema.Types.Date }],
  },
  { timestamps: true }
);

const SensorMD = mongoose.model(MODEL_SENSOR_NAME, Sensor);

export { SensorMD };
