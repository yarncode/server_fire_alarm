import mongoose, { Schema } from 'mongoose';

/* my import */
import { MODEL_USER_NAME } from './account';

export interface DataStateDevice {
  status: NodeStateType;
}

export const MODEL_DEVICE_NAME = 'Device';
export const MODEL_DEVICE_SETTING_NAME = 'DeviceSetting';
export const MODEL_DEVICE_LOGGER_NAME = 'DeviceLogger';

export type NodeType = 'GATEWAY' | 'NODE' | 'UNKNOWN';
export type NodeStateType = 'ONLINE' | 'OFFLINE';
export const NodeTypeList = ['GATEWAY', 'NODE', 'UNKNOWN'];
export const LoggerTypeList = ['CROSS_THRESHOLD', 'UNKNOWN'];

const DeviceLogger = new Schema(
  {
    deviceId: { type: Schema.Types.ObjectId, required: true },
    type: { type: Schema.Types.String, enum: LoggerTypeList, required: true },
    raw: { type: Schema.Types.Mixed },
    message: { type: Schema.Types.String, required: true },
  },
  { timestamps: true }
);

const DeviceSetting = new Schema({
  by_device: { type: Schema.Types.ObjectId, required: true },
  threshold: {
    type: Schema.Types.Mixed,
    required: true,
    temperature: {
      start: { type: Schema.Types.Number, required: true },
      end: { type: Schema.Types.Number, required: true },
    },
    humidity: {
      start: { type: Schema.Types.Number, required: true },
      end: { type: Schema.Types.Number, required: true },
    },
    smoke: {
      start: { type: Schema.Types.Number, required: true },
      end: { type: Schema.Types.Number, required: true },
    },
  },
});

const Device = new Schema(
  {
    by_user: {
      ref: MODEL_USER_NAME,
      type: Schema.Types.ObjectId,
      required: true,
    },
    name: { type: Schema.Types.String },
    desc: { type: Schema.Types.String },
    mac: { type: Schema.Types.String, required: true, unique: true },
    parent_mac: { type: Schema.Types.String },
    child_mac: [{ type: Schema.Types.String }],
    ram_size: { type: Schema.Types.Number },
    ip: { type: Schema.Types.String },
    auth: {
      username: { type: Schema.Types.String, required: true },
      password: { type: Schema.Types.String, required: true },
    },
    token: { type: Schema.Types.String },
    layer: { type: Schema.Types.Number },
    type: { type: Schema.Types.String, enum: NodeTypeList, required: true },
    status: {
      type: Schema.Types.String,
      enum: ['ONLINE', 'OFFLINE'],
      required: true,
    },
    state: {
      type: Schema.Types.String,
      enum: ['removed', 'active', 'disable'],
      require: true,
    },
  },
  { timestamps: true }
);

const DeviceMD = mongoose.model(MODEL_DEVICE_NAME, Device);
const DeviceSettingMD = mongoose.model(
  MODEL_DEVICE_SETTING_NAME,
  DeviceSetting
);
const DeviceLoggerMD = mongoose.model(MODEL_DEVICE_LOGGER_NAME, DeviceLogger);

export { DeviceMD, DeviceSettingMD, DeviceLoggerMD };
