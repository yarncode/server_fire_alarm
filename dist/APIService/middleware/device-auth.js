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
exports.main_auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/* my import */
const device_1 = require("../controller/device");
const account_1 = require("../../DatabaseService/models/account");
const devices_1 = require("../../DatabaseService/models/devices");
exports.main_auth = {
    validate_token: (req, res, next) => {
        var _a;
        const token = (_a = req.headers['_token']) === null || _a === void 0 ? void 0 : _a.toString();
        if (!token) {
            return res.status(400).json({
                code: '107005',
                message: device_1.DEVICE_MESSAGE['107005'],
            });
        }
        /* verify token */
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SIGNATURE_SECRET || 'secret');
            // console.log(decoded);
            req.body['mac'] = decoded['mac']; // set mac
            next();
            return;
        }
        catch (error) {
            /* token invalid */
            return res.status(400).json({
                code: '107004',
                message: device_1.DEVICE_MESSAGE['107004'],
            });
        }
    },
    validate_owner: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            const { id } = req.query;
            const user = yield account_1.UserMD.findOne({ email });
            if (user === null) {
                return res.status(400).json({
                    code: '107006',
                    message: device_1.DEVICE_MESSAGE['107006'],
                });
            }
            const device = yield devices_1.DeviceMD.findOne({ _id: id });
            if (device === null) {
                return res.status(400).json({
                    code: '107014',
                    message: device_1.DEVICE_MESSAGE['107014'],
                });
            }
            req.body['_user_id'] = user._id;
            req.body['_mac'] = device.mac;
            req.body['_device_id'] = device._id;
            next();
            return;
        }
        catch (error) {
            return res.status(400).json({
                code: '107003',
                message: device_1.DEVICE_MESSAGE['107003'],
            });
        }
    }),
};
//# sourceMappingURL=device-auth.js.map