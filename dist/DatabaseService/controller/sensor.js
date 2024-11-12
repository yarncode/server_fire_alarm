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
exports.updateSensor = void 0;
const sensor_1 = require("../models/sensor");
const updateSensor = (sensor) => __awaiter(void 0, void 0, void 0, function* () {
    const { deviceId, data } = sensor;
    const { humidity, smoke, temperature } = data;
    /* generate date */
    const date = new Date();
    /* check sensor is exist */
    const sensorExist = yield sensor_1.SensorMD.findOne({ by_device: deviceId });
    if (sensorExist) {
        /* update sensor */
        yield sensor_1.SensorMD.updateOne({ by_device: deviceId }, {
            $push: {
                smoke: { value: smoke, update_at: date },
                'env.temperature': { value: temperature, update_at: date },
                'env.humidity': { value: humidity, update_at: date },
            },
        }).exec();
        return {
            smoke: { value: smoke, time_at: date },
            env: {
                humidity: { value: humidity, time_at: date },
                temperature: { value: temperature, time_at: date },
            },
        };
    }
    else {
        /* create sensor */
        const newSensor = new sensor_1.SensorMD({
            by_device: deviceId,
            env: {
                humidity: humidity ? [{ value: humidity, update_at: date }] : [],
                temperature: temperature
                    ? [{ value: temperature, update_at: date }]
                    : [],
            },
            smoke: smoke ? [{ value: smoke, update_at: date }] : [],
        });
        yield newSensor.save();
        return {
            smoke: { value: smoke, time_at: date },
            env: {
                humidity: { value: humidity, time_at: date },
                temperature: { value: temperature, time_at: date },
            },
        };
    }
});
exports.updateSensor = updateSensor;
//# sourceMappingURL=sensor.js.map