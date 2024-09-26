import mongoose, { Schema } from 'mongoose';

/* my import */
import { MODEL_USER_NAME } from './account'

export const MODEL_DEVICE_NAME = 'Device';

const Device = new Schema({
    by_user: { ref: MODEL_USER_NAME, type: Schema.Types.ObjectId },
    name: { type: Schema.Types.String, required: true },
    desc: { type: Schema.Types.String },
    mac: { type: Schema.Types.String },
    parent_mac: { type: Schema.Types.String },
    child_mac: [{ type: Schema.Types.String }],
    ram_size: { type: Schema.Types.Number },
    ip: { type: Schema.Types.String },
    layer: { type: Schema.Types.Number },
    type: { type: Schema.Types.String, enum: ['GATEWAY', 'NODE', 'UNKNOWN'], required: true },
    status: { type: Schema.Types.String, enum: ['ONLINE', 'OFFLINE'], required: true },
    state: { type: Schema.Types.String, enum: ['removed', 'active', 'disable'], require: true }
}, { timestamps: true });

const DeviceMD = mongoose.model(MODEL_DEVICE_NAME, Device);

export {
    DeviceMD,
}
