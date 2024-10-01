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
exports.MQTT_SERVICE_NAME = void 0;
/* node_module import */
var sitka_1 = require("sitka");
var net_1 = __importDefault(require("net"));
var aedes_1 = __importDefault(require("aedes"));
var ManageService_1 = require("../ManageService");
var devices_1 = require("../DatabaseService/models/devices");
var logger = sitka_1.Logger.getLogger({ name: 'MQTT' });
exports.MQTT_SERVICE_NAME = 'mqtt-service';
var MqttInstance = /** @class */ (function (_super) {
    __extends(MqttInstance, _super);
    function MqttInstance(port) {
        var _this = _super.call(this, exports.MQTT_SERVICE_NAME) || this;
        _this.cacheInfoDevice = {};
        _this.port = port;
        _this.aedes = new aedes_1.default();
        _this.server = net_1.default.createServer(_this.aedes.handle);
        return _this;
    }
    MqttInstance.prototype.handleSensor = function (clientId, payload) {
        if (!clientId) {
            logger.error('Client id is not found');
        }
        var userId = this.cacheInfoDevice[clientId].userId;
        if (userId) {
            /* push message to user client */
            // logger.info(`Pushing to user: ${userId} - payload: ${payload}`);
            var data = {
                service: 'mqtt-service',
                payload: {
                    action: ['NOTIFY'],
                    mac: this.cacheInfoDevice[clientId].mac,
                    userId: this.cacheInfoDevice[clientId].userId,
                    topic: '/sensor',
                    emitEvent: 'sensor',
                    data: payload,
                },
            };
            this.sendMessage('socket-io-service', data);
        }
    };
    MqttInstance.prototype.onReceiveMessage = function (payload) {
        logger.info("Received payload: ".concat(payload));
    };
    MqttInstance.prototype.onConnected = function (client) {
        logger.info('Client connected => ', client.id);
    };
    MqttInstance.prototype.onDisconnected = function (client) {
        logger.info('Client disconnected => ', client.id);
    };
    MqttInstance.prototype.onPing = function (packet, client) {
        logger.info("Client id: ".concat(client.id, " - Ping"));
    };
    MqttInstance.prototype.onPublished = function (packet, client) {
        var _a;
        if (client) {
            logger.info("Client id: ".concat(client === null || client === void 0 ? void 0 : client.id, " - Published topic: ").concat(packet.topic, " length: ").concat(packet.payload.length));
            if (packet.topic === '/sensor') {
                this.handleSensor((_a = client === null || client === void 0 ? void 0 : client.id) !== null && _a !== void 0 ? _a : '', packet.payload.toString());
            }
        }
    };
    MqttInstance.prototype.onAuthentication = function (client, username, password, done) {
        return __awaiter(this, void 0, void 0, function () {
            var decodePassword, device;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        decodePassword = (_a = password === null || password === void 0 ? void 0 : password.toString()) !== null && _a !== void 0 ? _a : '';
                        return [4 /*yield*/, devices_1.DeviceMD.findOne({
                                auth: { username: username, password: decodePassword },
                            })];
                    case 1:
                        device = _b.sent();
                        if (device == null) {
                            done({
                                returnCode: 4 /* AuthErrorCode.BAD_USERNAME_OR_PASSWORD */,
                                name: 'Authentication',
                                message: 'Bad username or password',
                            }, false);
                        }
                        else {
                            this.cacheInfoDevice[client.id] = {
                                userId: device.by_user.toString(),
                                mac: device.mac,
                            };
                            done(null, true);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    MqttInstance.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                // logger.info('Starting MQTT instance');
                this.aedes.authenticate = this.onAuthentication.bind(this);
                this.aedes.on('client', this.onConnected.bind(this));
                this.aedes.on('clientDisconnect', this.onDisconnected.bind(this));
                this.aedes.on('publish', this.onPublished.bind(this));
                this.aedes.on('ping', this.onPing.bind(this));
                /* start listen server on port */
                this.server.listen(this.port, function () {
                    logger.info("MQTT server listening on port: {".concat(_this.port, "}"));
                });
                return [2 /*return*/];
            });
        });
    };
    MqttInstance.prototype.stop = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                logger.info('Stopping MQTT instance');
                /* stop listen server on port */
                this.server.close(function () {
                    logger.info('MQTT server stopped');
                });
                return [2 /*return*/];
            });
        });
    };
    return MqttInstance;
}(ManageService_1.RocketService));
exports.default = new MqttInstance(parseInt(process.env.PORT_SOCKET_MQTT || '1883'));
//# sourceMappingURL=index.js.map