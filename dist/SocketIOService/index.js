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
exports.SOCKET_IO_SERVICE_NAME = void 0;
/* node_module import */
var sitka_1 = require("sitka");
var socket_io_1 = require("socket.io");
/* my import */
var ManageService_1 = require("../ManageService");
var Constant_1 = require("../Constant");
var account_1 = require("../DatabaseService/models/account");
var devices_1 = require("../DatabaseService/models/devices");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var account_2 = require("../APIService/controller/account");
var logger = sitka_1.Logger.getLogger({ name: 'SOCKET_IO' });
exports.SOCKET_IO_SERVICE_NAME = 'socket-io-service';
var SocketIOInstance = /** @class */ (function (_super) {
    __extends(SocketIOInstance, _super);
    function SocketIOInstance(port) {
        var _this = _super.call(this, exports.SOCKET_IO_SERVICE_NAME) || this;
        _this.cacheInfoUser = {};
        _this.port = port;
        // this.server = createServer();
        _this.io = new socket_io_1.Server({ cors: { origin: '*' } });
        return _this;
    }
    SocketIOInstance.prototype.handleDataMqtt = function (payload, action, code) {
        var userId = payload.userId;
        if (code === Constant_1.CODE_EVENT_ACTIVE_DEVICE && action == 'NOTIFY') {
            /* [PATH: '{userId}/device/active'] */
            if (payload.topic === '/active') {
                this.io.emit("".concat(userId, "/device/active"), JSON.parse(payload.data));
            }
        }
    };
    SocketIOInstance.prototype.handleFromDatabase = function (payload, action, code) {
        var userId = payload.userId;
        var deviceId = payload.deviceId;
        if (code === Constant_1.CODE_EVENT_UPDATE_SENSOR && action == 'NOTIFY') {
            /* [PATH: '{userId}/{deviceId}/sensor'] */
            this.io.emit("".concat(userId, "/").concat(deviceId, "/sensor"), payload.data);
        }
        else if (code === Constant_1.CODE_EVENT_UPDATE_STATE_DEVICE && action == 'NOTIFY') {
            /* [PATH: '{userId}/{deviceId}/state'] */
            this.io.emit("".concat(userId, "/").concat(deviceId, "/status"), payload.data);
        }
    };
    SocketIOInstance.prototype.onReceiveMessage = function (payload) {
        var pay = JSON.parse(payload);
        logger.info("received message form ".concat(pay.service));
        if (pay.service === 'mqtt-service') {
            this.handleDataMqtt(pay.payload, pay.action, pay.code);
        }
        else if (pay.service === 'db-service') {
            this.handleFromDatabase(pay.payload, pay.action, pay.code);
        }
    };
    SocketIOInstance.prototype.onConnected = function (socket) {
        logger.info("Client connected => ".concat(socket.id));
    };
    SocketIOInstance.prototype.onDisconnected = function (socket, reason) {
        logger.info('Client disconnected => ', socket.id, 'reason: ', reason);
        /* remove client when disconnect */
        delete this.cacheInfoUser[socket.id];
    };
    SocketIOInstance.prototype.onConnection = function (socket) {
        var _this = this;
        this.onConnected(socket);
        socket.on('disconnect', function (reason) {
            return _this.onDisconnected(socket, reason);
        });
    };
    SocketIOInstance.prototype.validateAuthentication = function (socket, next) {
        return __awaiter(this, void 0, void 0, function () {
            var token, decoded, user_1, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        token = socket.handshake.auth['token'];
                        if (!token) {
                            return [2 /*return*/, next(new Error(JSON.stringify({ code: '108015', message: account_2.ACCOUNT_MESSAGE['108015'] })))];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SIGNATURE_SECRET || 'secret');
                        if (!decoded.email) return [3 /*break*/, 3];
                        return [4 /*yield*/, account_1.UserMD.findOne({ email: decoded.email })];
                    case 2:
                        user_1 = _a.sent();
                        if (user_1 === null) {
                            return [2 /*return*/, next(new Error(JSON.stringify({
                                    code: '108001',
                                    message: account_2.ACCOUNT_MESSAGE['108001'],
                                })))];
                        }
                        devices_1.DeviceMD.find({
                            by_user: user_1._id,
                            state: 'active',
                        })
                            .select('_id')
                            .exec()
                            .then(function (_devices) {
                            _this.cacheInfoUser[socket.id] = {
                                userId: user_1._id.toString(),
                                devices: _devices.map(function (d) { return d._id.toString(); }),
                            };
                        })
                            .catch(function (err) {
                            logger.error(err);
                        });
                        _a.label = 3;
                    case 3: return [2 /*return*/, next()];
                    case 4:
                        error_1 = _a.sent();
                        return [2 /*return*/, next(new Error(JSON.stringify({ code: '108010', message: account_2.ACCOUNT_MESSAGE['108010'] })))];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SocketIOInstance.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // logger.info('Starting SocketIO instance');
                this.io.use(this.validateAuthentication.bind(this));
                this.io.on('connection', this.onConnection.bind(this));
                /* start listen socket-io on port */
                this.io.listen(this.port);
                logger.info("SocketIO server listening on port: {".concat(this.port, "}"));
                return [2 /*return*/];
            });
        });
    };
    SocketIOInstance.prototype.stop = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // logger.info('Stopping SocketIO instance');
                /* stop listen socket-io on port */
                this.io.close();
                return [2 /*return*/];
            });
        });
    };
    return SocketIOInstance;
}(ManageService_1.RocketService));
exports.default = new SocketIOInstance(parseInt(process.env.PORT_SOCKET_IO || '3000'));
//# sourceMappingURL=index.js.map