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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACCOUNT_MESSAGE = void 0;
const sensor_1 = require("../../DatabaseService/models/sensor");
const mongoose_1 = __importDefault(require("mongoose"));
exports.ACCOUNT_MESSAGE = {
    '109000': 'None',
    '109001': 'Device id not found',
    '109002': 'Device not found',
    '109003': 'Unknown error',
};
class Sensor {
    constructor() {
        this.info = this.info.bind(this);
    }
    genObjectQuerySensor(field, time) {
        return {
            $let: {
                vars: {
                    firstItem: {
                        $arrayElemAt: [field, -1],
                    },
                },
                in: {
                    $filter: {
                        input: field,
                        as: 'item',
                        cond: {
                            $gt: [
                                '$$item.update_at',
                                {
                                    $subtract: ['$$firstItem.update_at', time],
                                },
                            ],
                        },
                    },
                },
            },
        };
    }
    info(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { id_device } = req.params;
                const { time } = req.query;
                const millisecond = parseInt((_a = time) !== null && _a !== void 0 ? _a : '3600') * 1000; // default 1 hour
                if (!id_device) {
                    return res.status(400).json({
                        code: '109001',
                        message: exports.ACCOUNT_MESSAGE['109001'],
                    });
                }
                const sensor = yield sensor_1.SensorMD.aggregate([
                    {
                        $match: {
                            by_device: new mongoose_1.default.Types.ObjectId(id_device),
                        },
                    },
                    {
                        $project: {
                            humidity: this.genObjectQuerySensor('$env.humidity', millisecond),
                            temperature: this.genObjectQuerySensor('$env.temperature', millisecond),
                            smoke: this.genObjectQuerySensor('$smoke', millisecond),
                        },
                    },
                ]);
                return res.status(200).json({
                    code: '109000',
                    message: exports.ACCOUNT_MESSAGE['109000'],
                    info: sensor[0] ? sensor[0] : [],
                });
            }
            catch (error) {
                console.log(error);
                return res.status(400).json({
                    code: '109003',
                    message: exports.ACCOUNT_MESSAGE['109003'],
                });
            }
        });
    }
}
exports.default = new Sensor();
//# sourceMappingURL=sensor.js.map