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
exports.IoMD = exports.MODEL_IO_PAYLOAD_NAME = exports.MODEL_IO_NAME = void 0;
const mongoose_1 = __importStar(require("mongoose"));
/* my import */
const devices_1 = require("./devices");
exports.MODEL_IO_NAME = 'IO';
exports.MODEL_IO_PAYLOAD_NAME = 'IOPayload';
const Gpio = new mongoose_1.Schema({
    by_device: { ref: devices_1.MODEL_DEVICE_NAME, type: mongoose_1.Schema.Types.ObjectId },
    input: {
        type: [{ value: mongoose_1.Schema.Types.Boolean, update_at: mongoose_1.Schema.Types.Date }],
        required: true,
    },
    output: {
        type: [{ value: mongoose_1.Schema.Types.Boolean, update_at: mongoose_1.Schema.Types.Date }],
        required: true,
    },
}, { timestamps: true });
const IoMD = mongoose_1.default.model(exports.MODEL_IO_PAYLOAD_NAME, Gpio);
exports.IoMD = IoMD;
//# sourceMappingURL=gpio.js.map