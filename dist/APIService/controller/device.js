"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEVICE_MESSAGE = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var uuid_1 = require("uuid");
/* my import */
var account_1 = require("../../DatabaseService/models/account");
var devices_1 = require("../../DatabaseService/models/devices");
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
var Device = /** @class */ (function () {
    function Device() {
        this.create_device = this.create_device.bind(this); // oke now method can access {this}
    }
    Device.prototype.generateToken = function (payload) {
        return jsonwebtoken_1.default.sign(payload, process.env.JWT_SIGNATURE_SECRET || 'secret');
    };
    /* {for user}: [GET] /device/info/list */
    Device.prototype.device_list = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var email, user, devices, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        email = req.body.email;
                        return [4 /*yield*/, account_1.UserMD.findOne({ email: email })];
                    case 1:
                        user = _a.sent();
                        if (user === null) {
                            return [2 /*return*/, res
                                    .status(400)
                                    .json({ code: '107006', message: exports.DEVICE_MESSAGE['107006'] })];
                        }
                        return [4 /*yield*/, devices_1.DeviceMD.find({
                                by_user: user._id,
                                state: 'active',
                            }).select(['-__v', '-by_user', '-token', '-auth'])];
                    case 2:
                        devices = _a.sent();
                        if (devices === null) {
                            return [2 /*return*/, res
                                    .status(400)
                                    .json({ code: '107001', message: exports.DEVICE_MESSAGE['107001'] })];
                        }
                        return [2 /*return*/, res.status(200).json({
                                code: '107002',
                                message: exports.DEVICE_MESSAGE['107002'],
                                info: devices.map(function (device) { return (__assign(__assign({}, device.toObject()), { id: device._id })); }),
                            })];
                    case 3:
                        error_1 = _a.sent();
                        return [2 /*return*/, res
                                .status(500)
                                .json({ code: '107011', message: exports.DEVICE_MESSAGE['107011'] })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /* {for user}: [GET] /device/info */
    Device.prototype.device_info = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, device, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.query.id;
                        return [4 /*yield*/, devices_1.DeviceMD.findOne({
                                _id: id,
                                state: 'active',
                            }).select(['-_id', '-__v', '-by_user'])];
                    case 1:
                        device = _a.sent();
                        if (device === null) {
                            return [2 /*return*/, res
                                    .status(400)
                                    .json({ code: '107001', message: exports.DEVICE_MESSAGE['107001'] })];
                        }
                        return [2 /*return*/, res.status(200).json({
                                code: '107002',
                                message: exports.DEVICE_MESSAGE['107002'],
                                info: device.toObject(),
                            })];
                    case 2:
                        error_2 = _a.sent();
                        return [2 /*return*/, res
                                .status(500)
                                .json({ code: '107011', message: exports.DEVICE_MESSAGE['107011'] })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /* {for user}: [POST] /device/setting */
    Device.prototype.save_device_setting = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, temperature, humidity, smoke, id, _setting, newSetting, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        _a = req.body.threshold, temperature = _a.temperature, humidity = _a.humidity, smoke = _a.smoke;
                        id = req.query.id;
                        return [4 /*yield*/, devices_1.DeviceSettingMD.findOne({ deviceId: id })];
                    case 1:
                        _setting = _b.sent();
                        if (!!_setting) return [3 /*break*/, 3];
                        newSetting = new devices_1.DeviceSettingMD({
                            deviceId: id,
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
                        return [4 /*yield*/, newSetting.save()];
                    case 2:
                        /* save new setting */
                        _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                code: '107017',
                                message: exports.DEVICE_MESSAGE['107017'],
                            })];
                    case 3:
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
                        return [4 /*yield*/, _setting.save()];
                    case 4:
                        /* save setting */
                        _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                code: '107017',
                                message: exports.DEVICE_MESSAGE['107017'],
                            })];
                    case 5:
                        error_3 = _b.sent();
                        console.log(error_3);
                        return [2 /*return*/, res
                                .status(500)
                                .json({ code: '107003', message: exports.DEVICE_MESSAGE['107003'] })];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /* {for user}: [GET] /device/setting */
    Device.prototype.device_setting = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, setting, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.query.id;
                        return [4 /*yield*/, devices_1.DeviceSettingMD.findOne({
                                device: id,
                            }).select(['-_id', '-__v'])];
                    case 1:
                        setting = _a.sent();
                        if (setting === null) {
                            return [2 /*return*/, res
                                    .status(400)
                                    .json({ code: '107015', message: exports.DEVICE_MESSAGE['107015'] })];
                        }
                        return [2 /*return*/, res.status(200).json({
                                code: '107000',
                                message: exports.DEVICE_MESSAGE['107000'],
                                info: setting.toObject(),
                            })];
                    case 2:
                        error_4 = _a.sent();
                        return [2 /*return*/, res
                                .status(500)
                                .json({ code: '107011', message: exports.DEVICE_MESSAGE['107011'] })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /* {for device}: [POST] /device/new */
    Device.prototype.create_device = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, mac, type_node, user, device, username, password, device_1, error_5;
            var _b, _c, _d, _e, _f, _g, _h, _j;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        _k.trys.push([0, 7, , 8]);
                        _a = req.body, email = _a.email, mac = _a.mac, type_node = _a.type_node;
                        if (!mac) {
                            return [2 /*return*/, res
                                    .status(400)
                                    .json({ code: '107007', message: exports.DEVICE_MESSAGE['107007'] })];
                        }
                        if (!type_node) {
                            return [2 /*return*/, res
                                    .status(400)
                                    .json({ code: '107008', message: exports.DEVICE_MESSAGE['107008'] })];
                        }
                        if (devices_1.NodeTypeList.includes(type_node) === false) {
                            return [2 /*return*/, res
                                    .status(400)
                                    .json({ code: '107009', message: exports.DEVICE_MESSAGE['107009'] })];
                        }
                        return [4 /*yield*/, account_1.UserMD.findOne({ email: email })];
                    case 1:
                        user = _k.sent();
                        if (user === null) {
                            return [2 /*return*/, res
                                    .status(400)
                                    .json({ code: '107006', message: exports.DEVICE_MESSAGE['107006'] })];
                        }
                        return [4 /*yield*/, devices_1.DeviceMD.findOne({ mac: mac })];
                    case 2:
                        device = _k.sent();
                        if (!(device !== null)) return [3 /*break*/, 4];
                        /* device already exists => goto update */
                        return [4 /*yield*/, device
                                .updateOne({ type: type_node, by_user: user._id, state: 'active' })
                                .exec()];
                    case 3:
                        /* device already exists => goto update */
                        _k.sent();
                        return [2 /*return*/, res.status(200).json({
                                code: '107012',
                                message: exports.DEVICE_MESSAGE['107012'],
                                auth: {
                                    username: (_c = (_b = device.auth) === null || _b === void 0 ? void 0 : _b.username) !== null && _c !== void 0 ? _c : 'Unknown',
                                    password: (_e = (_d = device.auth) === null || _d === void 0 ? void 0 : _d.password) !== null && _e !== void 0 ? _e : 'Unknown',
                                    token: device.token,
                                },
                            })];
                    case 4:
                        username = (0, uuid_1.v4)();
                        password = (0, uuid_1.v4)();
                        device_1 = new devices_1.DeviceMD({
                            mac: mac,
                            by_user: user._id,
                            desc: 'Unknown',
                            layer: 0,
                            name: 'Unknown',
                            state: 'active',
                            type: type_node,
                            ram_size: 0,
                            status: 'OFFLINE',
                            token: this.generateToken({ mac: mac }),
                            auth: {
                                username: username,
                                password: password,
                            },
                        });
                        return [4 /*yield*/, device_1.save()];
                    case 5:
                        _k.sent();
                        return [2 /*return*/, res.status(200).json({
                                code: '107010',
                                message: exports.DEVICE_MESSAGE['107010'],
                                auth: {
                                    username: (_g = (_f = device_1.auth) === null || _f === void 0 ? void 0 : _f.username) !== null && _g !== void 0 ? _g : 'Unknown',
                                    password: (_j = (_h = device_1.auth) === null || _h === void 0 ? void 0 : _h.password) !== null && _j !== void 0 ? _j : 'Unknown',
                                    token: device_1.token,
                                },
                            })];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_5 = _k.sent();
                        console.log(error_5);
                        return [2 /*return*/, res
                                .status(500)
                                .json({ code: '107003', message: exports.DEVICE_MESSAGE['107003'] })];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /* {for user}: [POST] /device/info/update */
    Device.prototype.update_device = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, name, desc, id, device, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = req.body, name = _a.name, desc = _a.desc;
                        id = req.query.id;
                        return [4 /*yield*/, devices_1.DeviceMD.findOne({ _id: id })];
                    case 1:
                        device = _b.sent();
                        if (device === null) {
                            return [2 /*return*/, res
                                    .status(400)
                                    .json({ code: '107001', message: exports.DEVICE_MESSAGE['107001'] })];
                        }
                        /* update device */
                        return [4 /*yield*/, device.updateOne({ name: name, desc: desc }).exec()];
                    case 2:
                        /* update device */
                        _b.sent();
                        return [2 /*return*/, res
                                .status(200)
                                .json({ code: '107012', message: exports.DEVICE_MESSAGE['107012'] })];
                    case 3:
                        error_6 = _b.sent();
                        return [2 /*return*/, res
                                .status(500)
                                .json({ code: '107003', message: exports.DEVICE_MESSAGE['107003'] })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /* {for user}: [POST] /device/remove */
    Device.prototype.remove_device = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, device, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        id = req.query.id;
                        return [4 /*yield*/, devices_1.DeviceMD.findOne({ _id: id })];
                    case 1:
                        device = _a.sent();
                        if (device === null) {
                            return [2 /*return*/, res
                                    .status(400)
                                    .json({ code: '107001', message: exports.DEVICE_MESSAGE['107001'] })];
                        }
                        /* update state device */
                        return [4 /*yield*/, device.updateOne({ state: 'removed' }).exec()];
                    case 2:
                        /* update state device */
                        _a.sent();
                        return [2 /*return*/, res
                                .status(200)
                                .json({ code: '107013', message: exports.DEVICE_MESSAGE['107013'] })];
                    case 3:
                        error_7 = _a.sent();
                        return [2 /*return*/, res
                                .status(500)
                                .json({ code: '107003', message: exports.DEVICE_MESSAGE['107003'] })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return Device;
}());
exports.default = new Device();
//# sourceMappingURL=device.js.map