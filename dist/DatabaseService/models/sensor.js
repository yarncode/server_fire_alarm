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
exports.SensorMD = exports.MODEL_SENSOR_PAYLOAD_NAME = exports.MODEL_SENSOR_NAME = void 0;
var mongoose_1 = __importStar(require("mongoose"));
/* my import */
var devices_1 = require("./devices");
exports.MODEL_SENSOR_NAME = 'Sensor';
exports.MODEL_SENSOR_PAYLOAD_NAME = 'SensorPayload';
var Sensor = new mongoose_1.Schema({
    by_device: { ref: devices_1.MODEL_DEVICE_NAME, type: mongoose_1.Schema.Types.ObjectId },
    smoke: [{ value: mongoose_1.Schema.Types.Number, update_at: mongoose_1.Schema.Types.Date }],
    env: {
        humidity: [{ value: mongoose_1.Schema.Types.Number, update_at: mongoose_1.Schema.Types.Date }],
        temperature: [
            { value: mongoose_1.Schema.Types.Number, update_at: mongoose_1.Schema.Types.Date },
        ],
    },
    gas: [{ value: mongoose_1.Schema.Types.Number, update_at: mongoose_1.Schema.Types.Date }],
}, { timestamps: true });
var SensorMD = mongoose_1.default.model(exports.MODEL_SENSOR_NAME, Sensor);
exports.SensorMD = SensorMD;
//# sourceMappingURL=sensor.js.map