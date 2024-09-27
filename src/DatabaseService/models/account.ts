import mongoose, { Schema } from 'mongoose';

export const MODEL_USER_NAME = 'User';

const User = new Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    username: { type: String },
    hash: { type: String, required: true },
    token: { type: String },
    desc: { type: String },
    avatar_url: { type: String },
    state: { type: String, enum: ['removed', 'active', 'disable'], require: true }
}, { timestamps: true });

const UserMD = mongoose.model(MODEL_USER_NAME, User);

export {
    UserMD,
}
