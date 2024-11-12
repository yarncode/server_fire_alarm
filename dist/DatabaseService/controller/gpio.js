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
exports.updateGpio = exports.createGpio = void 0;
const gpio_1 = require("../models/gpio");
const createGpio = (info) => __awaiter(void 0, void 0, void 0, function* () {
    const { deviceId, data } = info;
    const { input, output } = data;
    try {
        const ioExist = yield gpio_1.IoMD.findOne({ by_device: deviceId });
        /* update io */
        if (ioExist) {
            yield gpio_1.IoMD.updateOne({ by_device: deviceId }, {
                $set: {
                    input: input.map((_, i) => ({ value: _, update_at: new Date() })),
                    output: output.map((_, i) => ({ value: _, update_at: new Date() })),
                },
            }).exec();
        }
        else {
            const newIo = new gpio_1.IoMD({
                by_device: deviceId,
                input: input.map((_, i) => ({ value: _, update_at: new Date() })),
                output: output.map((_, i) => ({ value: _, update_at: new Date() })),
            });
            yield newIo.save();
        }
    }
    catch (error) {
        console.log(error);
    }
    return {
        deviceId,
        data: {
            input,
            output,
        },
    };
});
exports.createGpio = createGpio;
const updateGpio = (info) => __awaiter(void 0, void 0, void 0, function* () {
    const { deviceId, data } = info;
    const { state, pos, type, mode } = data;
    if (['input', 'output'].includes(type) === false) {
        return { deviceId, data };
    }
    try {
        const ioExist = yield gpio_1.IoMD.findOne({ by_device: deviceId });
        if (ioExist) {
            if (mode === 'single') {
                if (pos === undefined) {
                    return { deviceId, data };
                }
                /* check pos exist in field output start from 0 to length -1 */
                if (pos < 0 || pos >= ioExist.output.length) {
                    return { deviceId, data };
                }
                yield gpio_1.IoMD.updateOne({ by_device: deviceId }, {
                    $set: {
                        [`${type}.${pos}`]: {
                            value: state,
                            update_at: new Date(),
                        },
                    },
                }).exec();
            }
            else if (mode === 'all') {
                yield gpio_1.IoMD.updateOne({ by_device: deviceId }, {
                    $set: {
                        [`${type}`]: Array.from({ length: ioExist.output.length }, (_, i) => ({
                            value: state,
                            update_at: new Date(),
                        })),
                    },
                }).exec();
            }
        }
    }
    catch (error) {
        console.log(error);
    }
    return { deviceId, data };
});
exports.updateGpio = updateGpio;
//# sourceMappingURL=gpio.js.map