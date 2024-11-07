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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSensor = void 0;
var sensor_1 = require("../models/sensor");
var updateSensor = function (sensor) { return __awaiter(void 0, void 0, void 0, function () {
    var deviceId, data, humidity, smoke, temperature, date, sensorExist, newSensor;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                deviceId = sensor.deviceId, data = sensor.data;
                humidity = data.humidity, smoke = data.smoke, temperature = data.temperature;
                date = new Date();
                return [4 /*yield*/, sensor_1.SensorMD.findOne({ by_device: deviceId })];
            case 1:
                sensorExist = _a.sent();
                if (!sensorExist) return [3 /*break*/, 3];
                /* update sensor */
                return [4 /*yield*/, sensor_1.SensorMD.updateOne({ by_device: deviceId }, {
                        $push: {
                            smoke: { value: smoke, update_at: date },
                            'env.temperature': { value: temperature, update_at: date },
                            'env.humidity': { value: humidity, update_at: date },
                        },
                    }).exec()];
            case 2:
                /* update sensor */
                _a.sent();
                return [2 /*return*/, {
                        smoke: { value: smoke, time_at: date },
                        env: {
                            humidity: { value: humidity, time_at: date },
                            temperature: { value: temperature, time_at: date },
                        },
                    }];
            case 3:
                newSensor = new sensor_1.SensorMD({
                    by_device: deviceId,
                    env: {
                        humidity: humidity ? [{ value: humidity, update_at: date }] : [],
                        temperature: temperature
                            ? [{ value: temperature, update_at: date }]
                            : [],
                    },
                    smoke: smoke ? [{ value: smoke, update_at: date }] : [],
                });
                return [4 /*yield*/, newSensor.save()];
            case 4:
                _a.sent();
                return [2 /*return*/, {
                        smoke: { value: smoke, time_at: date },
                        env: {
                            humidity: { value: humidity, time_at: date },
                            temperature: { value: temperature, time_at: date },
                        },
                    }];
        }
    });
}); };
exports.updateSensor = updateSensor;
//# sourceMappingURL=sensor.js.map