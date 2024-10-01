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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main_auth = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/* my import */
var device_1 = require("../controller/device");
var account_1 = require("../../DatabaseService/models/account");
var devices_1 = require("../../DatabaseService/models/devices");
exports.main_auth = {
    validate_token: function (req, res, next) {
        var _a;
        var token = (_a = req.headers['_token']) === null || _a === void 0 ? void 0 : _a.toString();
        if (!token) {
            return res.status(400).json({
                code: '107005',
                message: device_1.DEVICE_MESSAGE['107005'],
            });
        }
        /* verify token */
        try {
            var decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SIGNATURE_SECRET || 'secret');
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
    validate_owner: function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, mac, email, user, device, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    _a = req.body, mac = _a.mac, email = _a.email;
                    return [4 /*yield*/, account_1.UserMD.findOne({ email: email })];
                case 1:
                    user = _b.sent();
                    if (user === null) {
                        return [2 /*return*/, res.status(400).json({
                                code: '107006',
                                message: device_1.DEVICE_MESSAGE['107006'],
                            })];
                    }
                    return [4 /*yield*/, devices_1.DeviceMD.findOne({ by_user: user._id, mac: mac })];
                case 2:
                    device = _b.sent();
                    if (device === null) {
                        return [2 /*return*/, res.status(400).json({
                                code: '107014',
                                message: device_1.DEVICE_MESSAGE['107014'],
                            })];
                    }
                    req.body['user_id'] = user._id;
                    next();
                    return [2 /*return*/];
                case 3:
                    error_1 = _b.sent();
                    return [2 /*return*/, res.status(400).json({
                            code: '107003',
                            message: device_1.DEVICE_MESSAGE['107003'],
                        })];
                case 4: return [2 /*return*/];
            }
        });
    }); },
};
//# sourceMappingURL=device-auth.js.map