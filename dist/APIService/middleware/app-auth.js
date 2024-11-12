"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main_auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/* my import */
const account_1 = require("../controller/account");
exports.main_auth = {
    validate_token: (req, res, next) => {
        var _a;
        const token = (_a = req.headers['_token']) === null || _a === void 0 ? void 0 : _a.toString();
        if (!token) {
            return res.status(400).json({ code: '108015', message: account_1.ACCOUNT_MESSAGE['108015'] });
        }
        /* verify token */
        try {
            const decoded = jsonwebtoken_1.default.verify(token, (process.env.JWT_SIGNATURE_SECRET || 'secret'));
            // console.log(decoded);
            req.body['email'] = decoded['email']; // set email
            next();
            return;
        }
        catch (error) {
            /* token invalid */
            return res.status(400).json({ code: '108010', message: account_1.ACCOUNT_MESSAGE['108010'] });
        }
    },
};
//# sourceMappingURL=app-auth.js.map