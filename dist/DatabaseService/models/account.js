"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMD = exports.MODEL_USER_NAME = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.MODEL_USER_NAME = 'User';
const User = new mongoose_1.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    username: { type: String },
    hash: { type: String, required: true },
    token: { type: String },
    desc: { type: String },
    avatar_url: { type: String },
    state: { type: String, enum: ['removed', 'active', 'disable'], require: true }
}, { timestamps: true });
const UserMD = mongoose_1.default.model(exports.MODEL_USER_NAME, User);
exports.UserMD = UserMD;
//# sourceMappingURL=account.js.map