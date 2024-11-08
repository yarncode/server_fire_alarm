"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* node_module import */
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
/* my import */
var sensor_1 = __importDefault(require("../controller/sensor"));
var app_auth_1 = require("../middleware/app-auth");
router.get('/info/:id_device', app_auth_1.main_auth.validate_token, sensor_1.default.info);
exports.default = router;
//# sourceMappingURL=sensor.js.map