"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStateDevice = void 0;
const devices_1 = require("../models/devices");
/* func update state device */
const updateStateDevice = (info) => __awaiter(void 0, void 0, void 0, function* () {
    const { deviceId, mac, userId } = info;
    const { status } = info.data;
    /* update state device */
    const device = yield devices_1.DeviceMD.findOneAndUpdate({ _id: deviceId, mac, by_user: userId }, { status }, { new: true }).select('-_id -__v -by_user');
    if (device == null) {
        throw new Error('Device not found');
    }
    return {
        status: device.status,
    };
});
exports.updateStateDevice = updateStateDevice;
//# sourceMappingURL=device.js.map