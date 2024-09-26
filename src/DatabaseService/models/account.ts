import mongoose, { Schema } from 'mongoose';

export const MODEL_USER_NAME = 'User';

const User = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String },
    signature_hash: { type: String },
    refresh_token: { type: String },
    access_token: { type: String },
    desc: { type: String },
    state: { type: String, enum: ['removed', 'active', 'disable'], require: true }
}, { timestamps: true });

const UserMD = mongoose.model(MODEL_USER_NAME, User);

export {
    UserMD,
}
