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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/* my import */
const account_1 = require("../../DatabaseService/models/account");
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
class Account {
    constructor() {
        this.register = this.register.bind(this); // oke now method can access {this}
        this.login = this.login.bind(this); // oke now method can access {this}
        this.refreshToken = this.refreshToken.bind(this); // oke now method can access {this}
        this.changePassword = this.changePassword.bind(this); // oke now method can access {this}
        this.info = this.info.bind(this); // oke now method can access {this}
    }
    emailValidate(email) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    }
    /* password more than 8 & less than 32 */
    passwordValidate(password) {
        return password.length > 8 && password.length < 32;
    }
    validateAccount(email, password) {
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
    }
    generateToken(payload) {
        return jsonwebtoken_1.default.sign(payload, (process.env.JWT_SIGNATURE_SECRET || 'secret'));
    }
    generateRuntimeToken(payload) {
        return jsonwebtoken_1.default.sign(payload, (process.env.JWT_SIGNATURE_SECRET || 'secret'), { expiresIn: 2 * 60 });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                /* validate account */
                const { code } = this.validateAccount(email, password);
                if (code !== '108000') {
                    return res.status(400).json({ code, message: exports.ACCOUNT_MESSAGE[code] });
                }
                /* get user from email */
                const user = yield account_1.UserMD.findOne({ email });
                if (user === null) {
                    return res.status(400).json({ code: '108001', message: exports.ACCOUNT_MESSAGE['108001'] });
                }
                /* verify password */
                const match = yield bcrypt_1.default.compare(password, user.hash);
                if (match === false) {
                    return res.status(400).json({ code: '108001', message: exports.ACCOUNT_MESSAGE['108001'] });
                }
                /* response runtime token */
                res.status(200).json({ code: '108009', message: exports.ACCOUNT_MESSAGE['108009'], runtime_token: this.generateRuntimeToken({ email }), refresh_token: user.token });
            }
            catch (error) {
                return res.status(500).json({ code: '108007', message: exports.ACCOUNT_MESSAGE['108007'] });
            }
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                /* validate account */
                const { code } = this.validateAccount(email, password);
                if (code !== '108000') {
                    return res.status(400).json({ code, message: exports.ACCOUNT_MESSAGE[code] });
                }
                /* hash password */
                const hash = yield bcrypt_1.default.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS || '10'));
                /* generate token */
                const token = this.generateToken({ email });
                const runtimeToken = this.generateRuntimeToken({ email });
                /* create account */
                const user = new account_1.UserMD({
                    email,
                    hash,
                    token,
                    desc: 'Unknown',
                    state: 'active',
                    name: 'Unknown',
                    username: 'Unknown'
                });
                yield user.save();
                res.status(200).json({ code: '108008', message: exports.ACCOUNT_MESSAGE['108008'], runtime_token: runtimeToken, refresh_token: token });
            }
            catch (error) { /* check account already exists */
                if ((error === null || error === void 0 ? void 0 : error.code) === 11000) {
                    return res.status(400).json({ code: '108002', message: exports.ACCOUNT_MESSAGE['108002'] });
                }
                return res.status(500).json({ code: '108007', message: exports.ACCOUNT_MESSAGE['108007'] });
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(200).json({});
        });
    }
    info(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                /* get user from email */
                const user = yield account_1.UserMD.findOne({ email });
                if (user === null) {
                    return res.status(400).json({ code: '108001', message: exports.ACCOUNT_MESSAGE['108001'] });
                }
                return res.status(200).json({ code: '108000', message: exports.ACCOUNT_MESSAGE['108000'], info: {
                        id: user._id,
                        email: user.email,
                        name: user.name,
                        username: user.username,
                        desc: user.desc,
                        avatar_url: user.avatar_url,
                    } });
            }
            catch (error) {
                return res.status(500).json({ code: '108007', message: exports.ACCOUNT_MESSAGE['108007'] });
            }
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                /* get user from email */
                const user = yield account_1.UserMD.findOne({ email });
                if (user === null) {
                    return res.status(400).json({ code: '108001', message: exports.ACCOUNT_MESSAGE['108001'] });
                }
                /* check token */
                if (user.token !== req.headers['_token']) {
                    return res.status(400).json({ code: '108010', message: exports.ACCOUNT_MESSAGE['108010'] });
                }
                res.status(200).json({ code: '108011', message: exports.ACCOUNT_MESSAGE['108011'], runtime_token: this.generateRuntimeToken({ email }) });
            }
            catch (error) {
                return res.status(500).json({ code: '108007', message: exports.ACCOUNT_MESSAGE['108007'] });
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, new_password } = req.body;
                /* validate new password */
                if (!this.passwordValidate(new_password)) {
                    return res.status(400).json({ code: '108013', message: exports.ACCOUNT_MESSAGE['108013'] });
                }
                /* get user from email */
                const user = yield account_1.UserMD.findOne({ email });
                if (user === null) {
                    return res.status(400).json({ code: '108001', message: exports.ACCOUNT_MESSAGE['108001'] });
                }
                /* verify password */
                const match = yield bcrypt_1.default.compare(password, user.hash);
                if (match === false) {
                    return res.status(400).json({ code: '108001', message: exports.ACCOUNT_MESSAGE['108001'] });
                }
                /* new password mest be different from old */
                if (new_password === password) {
                    return res.status(400).json({ code: '108012', message: exports.ACCOUNT_MESSAGE['108012'] });
                }
                /* hash password */
                const hash = yield bcrypt_1.default.hash(new_password, parseInt(process.env.BCRYPT_SALT_ROUNDS || '10'));
                /* update password */
                yield account_1.UserMD.updateOne({ email }, { hash });
                res.status(200).json({ code: '108014', message: exports.ACCOUNT_MESSAGE['108014'] });
            }
            catch (error) {
                return res.status(500).json({ code: '108007', message: exports.ACCOUNT_MESSAGE['108007'] });
            }
        });
    }
}
exports.default = new Account();
//# sourceMappingURL=account.js.map