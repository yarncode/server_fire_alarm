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
exports.ACCOUNT_MESSAGE = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/* my import */
var account_1 = require("../../DatabaseService/models/account");
exports.ACCOUNT_MESSAGE = {
    '108000': 'None',
    '108001': 'Account not found',
    '108002': 'Account already exists',
    '108003': 'Email is not valid',
    '108004': 'Password is not valid',
    '108005': 'Email field is required',
    '108006': 'Password field is required',
    '108007': 'Unknown error',
    '108008': 'Account register successfully',
    '108009': 'Account login successfully',
    '108010': 'Token is not valid',
    '108011': 'Refresh token successfully',
    '108012': 'New password is like old password',
    '108013': 'New password is not valid',
    '108014': 'New password is updated',
    '108015': 'Token is not found',
};
var Account = /** @class */ (function () {
    function Account() {
        this.register = this.register.bind(this); // oke now method can access {this}
        this.login = this.login.bind(this); // oke now method can access {this}
        this.refreshToken = this.refreshToken.bind(this); // oke now method can access {this}
        this.changePassword = this.changePassword.bind(this); // oke now method can access {this}
        this.info = this.info.bind(this); // oke now method can access {this}
    }
    Account.prototype.emailValidate = function (email) {
        var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    };
    /* password more than 8 & less than 32 */
    Account.prototype.passwordValidate = function (password) {
        return password.length > 8 && password.length < 32;
    };
    Account.prototype.validateAccount = function (email, password) {
        if (email === undefined) {
            return { code: '108005', message: exports.ACCOUNT_MESSAGE['108005'] };
        }
        if (password === undefined) {
            return { code: '108006', message: exports.ACCOUNT_MESSAGE['108006'] };
        }
        if (!this.emailValidate(email)) {
            return { code: '108003', message: exports.ACCOUNT_MESSAGE['108003'] };
        }
        if (!this.passwordValidate(password)) {
            return { code: '108004', message: exports.ACCOUNT_MESSAGE['108004'] };
        }
        return { code: '108000', message: exports.ACCOUNT_MESSAGE['108000'] };
    };
    Account.prototype.generateToken = function (payload) {
        return jsonwebtoken_1.default.sign(payload, (process.env.JWT_SIGNATURE_SECRET || 'secret'));
    };
    Account.prototype.generateRuntimeToken = function (payload) {
        return jsonwebtoken_1.default.sign(payload, (process.env.JWT_SIGNATURE_SECRET || 'secret'), { expiresIn: 2 * 60 });
    };
    Account.prototype.login = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, password, code, user, match, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = req.body, email = _a.email, password = _a.password;
                        code = this.validateAccount(email, password).code;
                        if (code !== '108000') {
                            return [2 /*return*/, res.status(400).json({ code: code, message: exports.ACCOUNT_MESSAGE[code] })];
                        }
                        return [4 /*yield*/, account_1.UserMD.findOne({ email: email })];
                    case 1:
                        user = _b.sent();
                        if (user === null) {
                            return [2 /*return*/, res.status(400).json({ code: '108001', message: exports.ACCOUNT_MESSAGE['108001'] })];
                        }
                        return [4 /*yield*/, bcrypt_1.default.compare(password, user.hash)];
                    case 2:
                        match = _b.sent();
                        if (match === false) {
                            return [2 /*return*/, res.status(400).json({ code: '108001', message: exports.ACCOUNT_MESSAGE['108001'] })];
                        }
                        /* response runtime token */
                        res.status(200).json({ code: '108009', message: exports.ACCOUNT_MESSAGE['108009'], runtime_token: this.generateRuntimeToken({ email: email }), refresh_token: user.token });
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        return [2 /*return*/, res.status(500).json({ code: '108007', message: exports.ACCOUNT_MESSAGE['108007'] })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Account.prototype.register = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, password, code, hash, token, runtimeToken, user, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = req.body, email = _a.email, password = _a.password;
                        code = this.validateAccount(email, password).code;
                        if (code !== '108000') {
                            return [2 /*return*/, res.status(400).json({ code: code, message: exports.ACCOUNT_MESSAGE[code] })];
                        }
                        return [4 /*yield*/, bcrypt_1.default.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS || '10'))];
                    case 1:
                        hash = _b.sent();
                        token = this.generateToken({ email: email });
                        runtimeToken = this.generateRuntimeToken({ email: email });
                        user = new account_1.UserMD({
                            email: email,
                            hash: hash,
                            token: token,
                            desc: 'Unknown',
                            state: 'active',
                            name: 'Unknown',
                            username: 'Unknown'
                        });
                        return [4 /*yield*/, user.save()];
                    case 2:
                        _b.sent();
                        res.status(200).json({ code: '108008', message: exports.ACCOUNT_MESSAGE['108008'], runtime_token: runtimeToken, refresh_token: token });
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _b.sent();
                        if ((error_2 === null || error_2 === void 0 ? void 0 : error_2.code) === 11000) {
                            return [2 /*return*/, res.status(400).json({ code: '108002', message: exports.ACCOUNT_MESSAGE['108002'] })];
                        }
                        return [2 /*return*/, res.status(500).json({ code: '108007', message: exports.ACCOUNT_MESSAGE['108007'] })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Account.prototype.logout = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.status(200).json({});
                return [2 /*return*/];
            });
        });
    };
    Account.prototype.info = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var email, user, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        email = req.body.email;
                        return [4 /*yield*/, account_1.UserMD.findOne({ email: email })];
                    case 1:
                        user = _a.sent();
                        if (user === null) {
                            return [2 /*return*/, res.status(400).json({ code: '108001', message: exports.ACCOUNT_MESSAGE['108001'] })];
                        }
                        return [2 /*return*/, res.status(200).json({ code: '108000', message: exports.ACCOUNT_MESSAGE['108000'], info: {
                                    id: user._id,
                                    email: user.email,
                                    name: user.name,
                                    username: user.username,
                                    desc: user.desc,
                                    avatar_url: user.avatar_url,
                                } })];
                    case 2:
                        error_3 = _a.sent();
                        return [2 /*return*/, res.status(500).json({ code: '108007', message: exports.ACCOUNT_MESSAGE['108007'] })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Account.prototype.refreshToken = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var email, user, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        email = req.body.email;
                        return [4 /*yield*/, account_1.UserMD.findOne({ email: email })];
                    case 1:
                        user = _a.sent();
                        if (user === null) {
                            return [2 /*return*/, res.status(400).json({ code: '108001', message: exports.ACCOUNT_MESSAGE['108001'] })];
                        }
                        /* check token */
                        if (user.token !== req.headers['_token']) {
                            return [2 /*return*/, res.status(400).json({ code: '108010', message: exports.ACCOUNT_MESSAGE['108010'] })];
                        }
                        res.status(200).json({ code: '108011', message: exports.ACCOUNT_MESSAGE['108011'], runtime_token: this.generateRuntimeToken({ email: email }) });
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        return [2 /*return*/, res.status(500).json({ code: '108007', message: exports.ACCOUNT_MESSAGE['108007'] })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Account.prototype.changePassword = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, password, new_password, user, match, hash, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        _a = req.body, email = _a.email, password = _a.password, new_password = _a.new_password;
                        /* validate new password */
                        if (!this.passwordValidate(new_password)) {
                            return [2 /*return*/, res.status(400).json({ code: '108013', message: exports.ACCOUNT_MESSAGE['108013'] })];
                        }
                        return [4 /*yield*/, account_1.UserMD.findOne({ email: email })];
                    case 1:
                        user = _b.sent();
                        if (user === null) {
                            return [2 /*return*/, res.status(400).json({ code: '108001', message: exports.ACCOUNT_MESSAGE['108001'] })];
                        }
                        return [4 /*yield*/, bcrypt_1.default.compare(password, user.hash)];
                    case 2:
                        match = _b.sent();
                        if (match === false) {
                            return [2 /*return*/, res.status(400).json({ code: '108001', message: exports.ACCOUNT_MESSAGE['108001'] })];
                        }
                        /* new password mest be different from old */
                        if (new_password === password) {
                            return [2 /*return*/, res.status(400).json({ code: '108012', message: exports.ACCOUNT_MESSAGE['108012'] })];
                        }
                        return [4 /*yield*/, bcrypt_1.default.hash(new_password, parseInt(process.env.BCRYPT_SALT_ROUNDS || '10'))];
                    case 3:
                        hash = _b.sent();
                        /* update password */
                        return [4 /*yield*/, account_1.UserMD.updateOne({ email: email }, { hash: hash })];
                    case 4:
                        /* update password */
                        _b.sent();
                        res.status(200).json({ code: '108014', message: exports.ACCOUNT_MESSAGE['108014'] });
                        return [3 /*break*/, 6];
                    case 5:
                        error_5 = _b.sent();
                        return [2 /*return*/, res.status(500).json({ code: '108007', message: exports.ACCOUNT_MESSAGE['108007'] })];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return Account;
}());
exports.default = new Account();
//# sourceMappingURL=account.js.map