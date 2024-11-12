"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* node_module import */
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
/* my import */
const account_1 = __importDefault(require("../controller/account"));
const app_auth_1 = require("../middleware/app-auth");
router.get('/info', app_auth_1.main_auth.validate_token, account_1.default.info);
router.post('/login', account_1.default.login);
router.post('/register', account_1.default.register);
router.post('/logout', account_1.default.logout);
router.post('/refresh-token', app_auth_1.main_auth.validate_token, account_1.default.refreshToken);
router.post('/change-password', app_auth_1.main_auth.validate_token, account_1.default.changePassword);
exports.default = router;
//# sourceMappingURL=account.js.map