import mongoose, { Schema } from 'mongoose';

const Device = new Schema({
    by_users: [{ ref: 'User', type: Schema.Types.ObjectId }],
    name: { type: String, required: true },
    desc: { type: String },
    mac: { type: String },
    ip: { type: String },
    type: { type: String, enum: ['GATEWAY', 'NODE', 'UNKNOWN'], required: true },
    status: { type: String, enum: ['ONLINE', 'OFFLINE'], required: true },
    state: { type: String, enum: ['removed', 'active', 'disable'], require: true }
}, { timestamps: true });

const DeviceMD = mongoose.model('Device', Device);

export {
    DeviceMD,
}
