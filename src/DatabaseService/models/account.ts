import mongoose, { Schema } from 'mongoose';

const User = new Schema({
    by_devices: [{ ref: 'Device', type: Schema.Types.ObjectId }],
    name: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String },
    signature_hash: { type: String },
    refresh_token: { type: String },
    access_token: { type: String },
    desc: { type: String },
    state: { type: String, enum: ['removed', 'active', 'disable'], require: true }
}, { timestamps: true });

const UserMD = mongoose.model('User', User);

export {
    UserMD,
}
