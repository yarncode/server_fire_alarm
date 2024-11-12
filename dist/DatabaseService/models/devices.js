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
exports.DeviceLoggerMD = exports.DeviceSettingMD = exports.DeviceMD = exports.LoggerTypeList = exports.NodeTypeList = exports.MODEL_DEVICE_LOGGER_NAME = exports.MODEL_DEVICE_SETTING_NAME = exports.MODEL_DEVICE_NAME = void 0;
const mongoose_1 = __importStar(require("mongoose"));
/* my import */
const account_1 = require("./account");
exports.MODEL_DEVICE_NAME = 'Device';
exports.MODEL_DEVICE_SETTING_NAME = 'DeviceSetting';
exports.MODEL_DEVICE_LOGGER_NAME = 'DeviceLogger';
exports.NodeTypeList = ['GATEWAY', 'NODE', 'UNKNOWN'];
exports.LoggerTypeList = ['CROSS_THRESHOLD', 'UNKNOWN'];
const DeviceLogger = new mongoose_1.Schema({
    deviceId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    type: { type: mongoose_1.Schema.Types.String, enum: exports.LoggerTypeList, required: true },
    raw: { type: mongoose_1.Schema.Types.Mixed },
    message: { type: mongoose_1.Schema.Types.String, required: true },
}, { timestamps: true });
const DeviceSetting = new mongoose_1.Schema({
    by_device: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    threshold: {
        type: mongoose_1.Schema.Types.Mixed,
        required: true,
        temperature: {
            start: { type: mongoose_1.Schema.Types.Number, required: true },
            end: { type: mongoose_1.Schema.Types.Number, required: true },
        },
        humidity: {
            start: { type: mongoose_1.Schema.Types.Number, required: true },
            end: { type: mongoose_1.Schema.Types.Number, required: true },
        },
        smoke: {
            start: { type: mongoose_1.Schema.Types.Number, required: true },
            end: { type: mongoose_1.Schema.Types.Number, required: true },
        },
    },
});
const Device = new mongoose_1.Schema({
    by_user: {
        ref: account_1.MODEL_USER_NAME,
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    name: { type: mongoose_1.Schema.Types.String },
    desc: { type: mongoose_1.Schema.Types.String },
    mac: { type: mongoose_1.Schema.Types.String, required: true, unique: true },
    parent_mac: { type: mongoose_1.Schema.Types.String },
    child_mac: [{ type: mongoose_1.Schema.Types.String }],
    ram_size: { type: mongoose_1.Schema.Types.Number },
    ip: { type: mongoose_1.Schema.Types.String },
    auth: {
        username: { type: mongoose_1.Schema.Types.String, required: true },
        password: { type: mongoose_1.Schema.Types.String, required: true },
    },
    token: { type: mongoose_1.Schema.Types.String },
    layer: { type: mongoose_1.Schema.Types.Number },
    type: { type: mongoose_1.Schema.Types.String, enum: exports.NodeTypeList, required: true },
    status: {
        type: mongoose_1.Schema.Types.String,
        enum: ['ONLINE', 'OFFLINE'],
        required: true,
    },
    state: {
        type: mongoose_1.Schema.Types.String,
        enum: ['removed', 'active', 'disable'],
        require: true,
    },
}, { timestamps: true });
const DeviceMD = mongoose_1.default.model(exports.MODEL_DEVICE_NAME, Device);
exports.DeviceMD = DeviceMD;
const DeviceSettingMD = mongoose_1.default.model(exports.MODEL_DEVICE_SETTING_NAME, DeviceSetting);
exports.DeviceSettingMD = DeviceSettingMD;
const DeviceLoggerMD = mongoose_1.default.model(exports.MODEL_DEVICE_LOGGER_NAME, DeviceLogger);
exports.DeviceLoggerMD = DeviceLoggerMD;
//# sourceMappingURL=devices.js.map