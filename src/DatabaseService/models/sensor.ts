import mongoose, { Schema } from 'mongoose';

const Sensor = new Schema({
    by_users: [{ ref: 'User', type: Schema.Types.ObjectId }],
    by_devices: [{ ref: 'Device', type: Schema.Types.ObjectId }],
    name: { type: String },
    desc: { type: String },
}, { timestamps: true });

const SensorMD = mongoose.model('Sensor', Sensor);

export {
    SensorMD,
}
