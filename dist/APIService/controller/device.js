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
exports.DEVICE_MESSAGE = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const common_1 = require("./common");
const account_1 = require("../../DatabaseService/models/account");
const gpio_1 = require("../../DatabaseService/models/gpio");
const devices_1 = require("../../DatabaseService/models/devices");
const Constant_1 = require("../../Constant");
exports.DEVICE_MESSAGE = {
    '107000': 'None',
    '107001': 'Device not found',
    '107002': 'Device already exists',
    '107003': 'Unknown error',
    '107004': 'Token is not valid',
    '107005': 'Token is not found',
    '107006': 'User is not found',
    '107007': 'MAC is not found',
    '107008': 'Node type is not found',
    '107009': 'Node type is not valid',
    '107010': 'Device created successfully',
    '107011': 'Device get successfully',
    '107012': 'Device update successfully',
    '107013': 'Device remove successfully',
    '107014': 'Device not owned by user',
    '107015': 'Device not found setting',
    '107016': 'Missing field',
    '107017': 'Setting saved successfully',
};
class Device {
    constructor() {
        this.create_device = this.create_device.bind(this); // oke now method can access {this}
    }
    generateToken(payload) {
        return jsonwebtoken_1.default.sign(payload, process.env.JWT_SIGNATURE_SECRET || 'secret');
    }
    /* {for user}: [GET] /device/info/list */
    device_list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                /* get user from email */
                const user = yield account_1.UserMD.findOne({ email });
                if (user === null) {
                    return res
                        .status(400)
                        .json({ code: '107006', message: exports.DEVICE_MESSAGE['107006'] });
                }
                const devices = yield devices_1.DeviceMD.find({
                    by_user: user._id,
                    state: 'active',
                }).select(['-__v', '-by_user', '-token', '-auth']);
                if (devices === null) {
                    return res
                        .status(400)
                        .json({ code: '107001', message: exports.DEVICE_MESSAGE['107001'] });
                }
                return res.status(200).json({
                    code: '107002',
                    message: exports.DEVICE_MESSAGE['107002'],
                    info: devices.map((device) => (Object.assign(Object.assign({}, device.toObject()), { id: device._id }))),
                });
            }
            catch (error) {
                return res
                    .status(500)
                    .json({ code: '107011', message: exports.DEVICE_MESSAGE['107011'] });
            }
        });
    }
    /* {for user}: [GET] /device/info */
    device_info(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                /* get device if found */
                const device = yield devices_1.DeviceMD.findOne({
                    _id: id,
                    state: 'active',
                }).select(['-_id', '-__v', '-by_user']);
                if (device === null) {
                    return res
                        .status(400)
                        .json({ code: '107001', message: exports.DEVICE_MESSAGE['107001'] });
                }
                return res.status(200).json({
                    code: '107002',
                    message: exports.DEVICE_MESSAGE['107002'],
                    info: device.toObject(),
                });
            }
            catch (error) {
                return res
                    .status(500)
                    .json({ code: '107011', message: exports.DEVICE_MESSAGE['107011'] });
            }
        });
    }
    /* {for user}: [GET] /device/info */
    io_info(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                /* get device if found */
                const io = yield gpio_1.IoMD.findOne({
                    by_device: id,
                }).select(['-_id', '-__v', '-by_user', '-by_device']);
                if (io === null) {
                    return res
                        .status(400)
                        .json({ code: '107001', message: exports.DEVICE_MESSAGE['107001'] });
                }
                return res.status(200).json({
                    code: '107002',
                    message: exports.DEVICE_MESSAGE['107002'],
                    info: io.toObject(),
                });
            }
            catch (error) {
                return res
                    .status(500)
                    .json({ code: '107011', message: exports.DEVICE_MESSAGE['107011'] });
            }
        });
    }
    /* {for user}: [POST] /device/setting */
    save_device_setting(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, desc, threshold: { temperature, humidity, smoke }, } = req.body;
                const { id } = req.query;
                let fix_device = false;
                const device = yield devices_1.DeviceMD.findOne({ _id: id });
                if (device === null) {
                    return res
                        .status(400)
                        .json({ code: '107001', message: exports.DEVICE_MESSAGE['107001'] });
                }
                if (name) {
                    device.$set('name', name);
                    fix_device = true;
                }
                if (desc) {
                    device.$set('desc', desc);
                    fix_device = true;
                }
                if (fix_device) {
                    yield device.save();
                }
                /* find setting */
                const _setting = yield devices_1.DeviceSettingMD.findOne({ by_device: id });
                /* create new if not found */
                if (!_setting) {
                    const newSetting = new devices_1.DeviceSettingMD({
                        by_device: id,
                        threshold: {
                            temperature: {
                                start: (temperature === null || temperature === void 0 ? void 0 : temperature.start) || 0,
                                end: (temperature === null || temperature === void 0 ? void 0 : temperature.end) || 0,
                            },
                            humidity: {
                                start: (humidity === null || humidity === void 0 ? void 0 : humidity.start) || 0,
                                end: (humidity === null || humidity === void 0 ? void 0 : humidity.end) || 0,
                            },
                            smoke: {
                                start: (smoke === null || smoke === void 0 ? void 0 : smoke.start) || 0,
                                end: (smoke === null || smoke === void 0 ? void 0 : smoke.end) || 0,
                            },
                        },
                    });
                    /* save new setting */
                    yield newSetting.save();
                    common_1.controller.sendMessage(req.app.locals['_ctx'], () => {
                        const _data = {
                            service: 'api-service',
                            action: 'CONFIG',
                            code: Constant_1.CODE_EVENT_SYNC_THRESHOLD,
                            payload: {
                                mac: req.body['_mac'],
                                deviceId: req.body['_device_id'],
                                userId: req.body['_user_id'],
                                data: {
                                    threshold: newSetting.threshold,
                                },
                            },
                        };
                        return _data;
                    });
                    return res.status(200).json({
                        code: '107017',
                        message: exports.DEVICE_MESSAGE['107017'],
                    });
                }
                /* update setting */
                if (temperature === null || temperature === void 0 ? void 0 : temperature.start) {
                    _setting.$set('threshold.temperature.start', temperature.start);
                }
                if (temperature === null || temperature === void 0 ? void 0 : temperature.end) {
                    _setting.$set('threshold.temperature.end', temperature.end);
                }
                if (humidity === null || humidity === void 0 ? void 0 : humidity.start) {
                    _setting.$set('threshold.humidity.start', humidity.start);
                }
                if (humidity === null || humidity === void 0 ? void 0 : humidity.end) {
                    _setting.$set('threshold.humidity.end', humidity.end);
                }
                if (smoke === null || smoke === void 0 ? void 0 : smoke.start) {
                    _setting.$set('threshold.smoke.start', smoke.start);
                }
                if (smoke === null || smoke === void 0 ? void 0 : smoke.end) {
                    _setting.$set('threshold.smoke.end', smoke.end);
                }
                /* save setting */
                yield _setting.save();
                common_1.controller.sendMessage(req.app.locals['_ctx'], () => {
                    const _data = {
                        service: 'api-service',
                        action: 'CONFIG',
                        code: Constant_1.CODE_EVENT_SYNC_THRESHOLD,
                        payload: {
                            mac: req.body['_mac'],
                            deviceId: req.body['_device_id'],
                            userId: req.body['_user_id'],
                            data: {
                                threshold: _setting.threshold,
                            },
                        },
                    };
                    return _data;
                });
                return res.status(200).json({
                    code: '107017',
                    message: exports.DEVICE_MESSAGE['107017'],
                });
            }
            catch (error) {
                console.log(error);
                return res
                    .status(500)
                    .json({ code: '107003', message: exports.DEVICE_MESSAGE['107003'] });
            }
        });
    }
    /* {for user}: [GET] /device/setting */
    device_setting(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                const setting = yield devices_1.DeviceSettingMD.findOne({
                    by_device: id,
                }).select(['-_id', '-__v', '-by_device']);
                if (setting === null) {
                    return res
                        .status(400)
                        .json({ code: '107015', message: exports.DEVICE_MESSAGE['107015'] });
                }
                return res.status(200).json({
                    code: '107000',
                    message: exports.DEVICE_MESSAGE['107000'],
                    info: setting.toObject(),
                });
            }
            catch (error) {
                return res
                    .status(500)
                    .json({ code: '107011', message: exports.DEVICE_MESSAGE['107011'] });
            }
        });
    }
    /* {for device}: [POST] /device/new */
    create_device(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            try {
                const { email, mac, type_node } = req.body;
                if (!mac) {
                    return res
                        .status(400)
                        .json({ code: '107007', message: exports.DEVICE_MESSAGE['107007'] });
                }
                if (!type_node) {
                    return res
                        .status(400)
                        .json({ code: '107008', message: exports.DEVICE_MESSAGE['107008'] });
                }
                if (devices_1.NodeTypeList.includes(type_node) === false) {
                    return res
                        .status(400)
                        .json({ code: '107009', message: exports.DEVICE_MESSAGE['107009'] });
                }
                /* get info account */
                const user = yield account_1.UserMD.findOne({ email });
                if (user === null) {
                    return res
                        .status(400)
                        .json({ code: '107006', message: exports.DEVICE_MESSAGE['107006'] });
                }
                /* get device if found */
                const device = yield devices_1.DeviceMD.findOne({ mac });
                if (device !== null) {
                    /* device already exists => goto update */
                    yield device
                        .updateOne({ type: type_node, by_user: user._id, state: 'active' })
                        .exec();
                    return res.status(200).json({
                        code: '107012',
                        message: exports.DEVICE_MESSAGE['107012'],
                        auth: {
                            username: (_b = (_a = device.auth) === null || _a === void 0 ? void 0 : _a.username) !== null && _b !== void 0 ? _b : 'Unknown',
                            password: (_d = (_c = device.auth) === null || _c === void 0 ? void 0 : _c.password) !== null && _d !== void 0 ? _d : 'Unknown',
                            token: device.token,
                        },
                    });
                }
                else {
                    /* device not found => goto create new */
                    /* create auth username & password */
                    const username = (0, uuid_1.v4)();
                    const password = (0, uuid_1.v4)();
                    /* create new device */
                    const device = new devices_1.DeviceMD({
                        mac,
                        by_user: user._id,
                        desc: 'Unknown',
                        layer: 0,
                        name: 'Unknown',
                        state: 'active',
                        type: type_node,
                        ram_size: 0,
                        status: 'OFFLINE',
                        token: this.generateToken({ mac }),
                        auth: {
                            username,
                            password,
                        },
                    });
                    yield device.save();
                    return res.status(200).json({
                        code: '107010',
                        message: exports.DEVICE_MESSAGE['107010'],
                        auth: {
                            username: (_f = (_e = device.auth) === null || _e === void 0 ? void 0 : _e.username) !== null && _f !== void 0 ? _f : 'Unknown',
                            password: (_h = (_g = device.auth) === null || _g === void 0 ? void 0 : _g.password) !== null && _h !== void 0 ? _h : 'Unknown',
                            token: device.token,
                        },
                    });
                }
            }
            catch (error) {
                console.log(error);
                return res
                    .status(500)
                    .json({ code: '107003', message: exports.DEVICE_MESSAGE['107003'] });
            }
        });
    }
    /* {for user}: [POST] /device/info/update */
    update_device(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, desc } = req.body;
                const { id } = req.query;
                /* get device if found */
                const device = yield devices_1.DeviceMD.findOne({ _id: id });
                if (device === null) {
                    return res
                        .status(400)
                        .json({ code: '107001', message: exports.DEVICE_MESSAGE['107001'] });
                }
                /* update device */
                yield device.updateOne({ name, desc }).exec();
                return res
                    .status(200)
                    .json({ code: '107012', message: exports.DEVICE_MESSAGE['107012'] });
            }
            catch (error) {
                return res
                    .status(500)
                    .json({ code: '107003', message: exports.DEVICE_MESSAGE['107003'] });
            }
        });
    }
    /* {for user}: [POST] /device/remove */
    remove_device(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                /* get device if found */
                const device = yield devices_1.DeviceMD.findOne({ _id: id });
                if (device === null) {
                    return res
                        .status(400)
                        .json({ code: '107001', message: exports.DEVICE_MESSAGE['107001'] });
                }
                /* update state device */
                yield device.updateOne({ state: 'removed' }).exec();
                return res
                    .status(200)
                    .json({ code: '107013', message: exports.DEVICE_MESSAGE['107013'] });
            }
            catch (error) {
                return res
                    .status(500)
                    .json({ code: '107003', message: exports.DEVICE_MESSAGE['107003'] });
            }
        });
    }
}
exports.default = new Device();
//# sourceMappingURL=device.js.map