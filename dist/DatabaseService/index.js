"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.DATABASE_SERVICE_NAME = void 0;
/* node_module import */
var sitka_1 = require("sitka");
var mongoose_1 = __importDefault(require("mongoose"));
var bull_1 = __importDefault(require("bull"));
/* my import */
var ManageService_1 = require("../ManageService");
var Constant_1 = require("../Constant");
var sensor_1 = require("./controller/sensor");
var device_1 = require("./controller/device");
var logger = sitka_1.Logger.getLogger({ name: 'DATABASE' });
exports.DATABASE_SERVICE_NAME = 'db-service';
var DatabaseInstance = /** @class */ (function (_super) {
    __extends(DatabaseInstance, _super);
    function DatabaseInstance(port) {
        var _this = _super.call(this, exports.DATABASE_SERVICE_NAME) || this;
        _this.port = port;
        _this.queueSensor = new bull_1.default('sensor');
        _this.queueStateDevice = new bull_1.default('state-device');
        return _this;
    }
    DatabaseInstance.prototype.handleDataMqtt = function (payload, action, code) {
        var userId = payload.userId;
        var deviceId = payload.deviceId;
        var mac = payload.mac;
        if (code === Constant_1.CODE_EVENT_UPDATE_SENSOR &&
            action == 'SET' &&
            typeof payload.data === 'string') {
            /* push message to user client */
            /* [PATH: '{userId}/{deviceId}/sensor'] */
            var sensorPayload = JSON.parse(payload.data);
            var data = {
                userId: userId,
                deviceId: deviceId,
                mac: mac,
                data: sensorPayload,
            };
            this.queueSensor.add(data);
        }
        else if (code === Constant_1.CODE_EVENT_UPDATE_STATE_DEVICE && action == 'SET') {
            var statePayload = payload.data;
            var data = {
                userId: userId,
                deviceId: deviceId,
                mac: mac,
                data: statePayload,
            };
            this.queueStateDevice.add(data);
        }
    };
    DatabaseInstance.prototype.handleUpdateSensor = function (job, done) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, sensor_1.updateSensor)(job.data)];
                    case 1:
                        res = _a.sent();
                        done(null, res); // done handle save data sensor
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        done(error_1, null);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseInstance.prototype.handleUpdateStateDevice = function (job, done) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, device_1.updateStateDevice)(job.data)];
                    case 1:
                        res = _a.sent();
                        done(null, res); // done handle save state device
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        done(error_2, null);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseInstance.prototype.onHandleUpdateStateDeviceCompleted = function (job, result) {
        var data = {
            service: 'db-service',
            action: 'NOTIFY',
            code: Constant_1.CODE_EVENT_UPDATE_STATE_DEVICE,
            payload: {
                mac: job.data.mac,
                userId: job.data.userId,
                deviceId: job.data.deviceId,
                data: result,
            },
        };
        this.sendMessage('socket-io-service', data);
    };
    DatabaseInstance.prototype.onHandleUpdateSensorCompleted = function (job, result) {
        var data = {
            service: 'db-service',
            action: 'NOTIFY',
            code: Constant_1.CODE_EVENT_UPDATE_SENSOR,
            payload: {
                mac: job.data.mac,
                userId: job.data.userId,
                deviceId: job.data.deviceId,
                data: result,
            },
        };
        this.sendMessage('socket-io-service', data);
    };
    DatabaseInstance.prototype.onReceiveMessage = function (payload) {
        var pay = JSON.parse(payload);
        logger.info("received message form ".concat(pay.service));
        if (pay.service === 'mqtt-service') {
            this.handleDataMqtt(pay.payload, pay.action, pay.code);
        }
    };
    DatabaseInstance.prototype.onMongoConnected = function () {
        logger.info("MongoDB connected on port: {".concat(this.port, "}"));
    };
    DatabaseInstance.prototype.onMongoFailure = function () {
        logger.info('MongoDB failed :(');
    };
    DatabaseInstance.prototype.start = function () {
        // logger.info('Starting API instance');
        this.queueSensor.process(this.handleUpdateSensor.bind(this));
        this.queueSensor.on('completed', this.onHandleUpdateSensorCompleted.bind(this));
        this.queueStateDevice.process(this.handleUpdateStateDevice.bind(this));
        this.queueStateDevice.on('completed', this.onHandleUpdateStateDeviceCompleted.bind(this));
        mongoose_1.default
            .connect("mongodb://localhost:".concat(this.port, "/fire-alarm"))
            .then(this.onMongoConnected.bind(this))
            .catch(this.onMongoFailure.bind(this));
    };
    DatabaseInstance.prototype.stop = function () {
        // logger.info('Stopping API instance');
        mongoose_1.default.disconnect();
    };
    return DatabaseInstance;
}(ManageService_1.RocketService));
exports.default = new DatabaseInstance(parseInt(process.env.PORT_DATABASE || '27017'));
//# sourceMappingURL=index.js.map