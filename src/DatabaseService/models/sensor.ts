import mongoose, { Schema } from 'mongoose';

/* my import */
import { MODEL_DEVICE_NAME } from './devices';

export const MODEL_SENSOR_NAME = 'Sensor';
export const MODEL_SENSOR_PAYLOAD_NAME = 'SensorPayload';

export type SensorType = 'smoke' | 'humidity' | 'temperature' | 'gas';

const SensorPayload = new Schema({
  value: { type: Schema.Types.Mixed },
  time_at: { type: Schema.Types.Date },
});

const Sensor = new Schema(
  {
    by_device: { ref: MODEL_DEVICE_NAME, type: Schema.Types.ObjectId },
    smoke: [{ ref: 'SensorPayload', type: Schema.Types.ObjectId }],
    env: {
      humidity: [{ ref: 'SensorPayload', type: Schema.Types.ObjectId }],
      temperature: [{ ref: 'SensorPayload', type: Schema.Types.ObjectId }],
    },
    gas: [{ ref: 'SensorPayload', type: Schema.Types.ObjectId }],
  },
  { timestamps: true }
);

const SensorMD = mongoose.model(MODEL_SENSOR_NAME, Sensor);
const SensorPayloadMD = mongoose.model(MODEL_SENSOR_PAYLOAD_NAME, SensorPayload);

export { SensorMD, SensorPayloadMD };
