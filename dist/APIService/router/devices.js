"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* node_module import */
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
/* my import */
var device_1 = __importDefault(require("../controller/device"));
var device_auth_1 = require("../middleware/device-auth");
var app_auth_1 = require("../middleware/app-auth");
router.get('/info', app_auth_1.main_auth.validate_token, device_auth_1.main_auth.validate_owner, device_1.default.device_info);
router.get('/setting', app_auth_1.main_auth.validate_token, device_auth_1.main_auth.validate_owner, device_1.default.device_setting);
router.post('/setting', app_auth_1.main_auth.validate_token, device_auth_1.main_auth.validate_owner, device_1.default.save_device_setting);
router.get('/info/list', app_auth_1.main_auth.validate_token, device_1.default.device_list);
router.post('/new', app_auth_1.main_auth.validate_token, device_1.default.create_device); /* {JUST FOR DEVICE CALL} */
router.post('/info/update', app_auth_1.main_auth.validate_token, device_auth_1.main_auth.validate_owner, device_1.default.update_device);
router.post('/remove', app_auth_1.main_auth.validate_token, device_auth_1.main_auth.validate_owner, device_1.default.remove_device);
exports.default = router;
//# sourceMappingURL=devices.js.map