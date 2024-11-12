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
exports.SOCKET_IO_SERVICE_NAME = void 0;
/* node_module import */
const sitka_1 = require("sitka");
const socket_io_1 = require("socket.io");
/* my import */
const ManageService_1 = require("../ManageService");
const Constant_1 = require("../Constant");
const account_1 = require("../DatabaseService/models/account");
const devices_1 = require("../DatabaseService/models/devices");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const account_2 = require("../APIService/controller/account");
const logger = sitka_1.Logger.getLogger({ name: 'SOCKET_IO' });
exports.SOCKET_IO_SERVICE_NAME = 'socket-io-service';
class SocketIOInstance extends ManageService_1.RocketService {
    constructor(port) {
        super(exports.SOCKET_IO_SERVICE_NAME);
        this.cacheClientLinkDevice = {};
        this.cacheDeviceLinkClient = {};
        this.port = port;
        // this.server = createServer();
        this.io = new socket_io_1.Server({ cors: { origin: '*' } });
    }
    handleDataMqtt(payload, action, code) {
        const userId = payload.userId;
        if (action == 'NOTIFY') {
            if (code === Constant_1.CODE_EVENT_ACTIVE_DEVICE) {
                /* [PATH: '{userId}/device/active'] */
                if (payload.topic === '/active') {
                    this.io.emit(`${userId}/device/active`, JSON.parse(payload.data));
                }
            }
        }
    }
    handleFromDatabase(payload, action, code) {
        const userId = payload.userId;
        const deviceId = payload.deviceId;
        if (action == 'NOTIFY') {
            if (code === Constant_1.CODE_EVENT_UPDATE_SENSOR) {
                /* [PATH: '{userId}/{deviceId}/sensor'] */
                this.io.emit(`${userId}/${deviceId}/sensor`, payload.data);
            }
            else if (code === Constant_1.CODE_EVENT_UPDATE_STATE_DEVICE) {
                /* [PATH: '{userId}/{deviceId}/status'] */
                this.io.emit(`${userId}/${deviceId}/status`, payload.data);
            }
            else if (code === Constant_1.CODE_EVENT_UPDATE_OUTPUT) {
                this.deviceBoardcastMsg(deviceId, `device/${deviceId}/output-io`, payload.data);
                // this.io.emit(`${userId}/device/output-io`, payload.data);
            }
            else if (code === Constant_1.CODE_EVENT_UPDATE_INPUT) {
                this.deviceBoardcastMsg(deviceId, `device/${deviceId}/input-io`, payload.data);
                // this.io.emit(`${userId}/device/input-io`, payload.data);
            }
            else if (code === Constant_1.CODE_EVENT_SYNC_GPIO) {
                this.deviceBoardcastMsg(deviceId, `device/${deviceId}/sync-io`, payload.data);
                // this.io.emit(`${userId}/device/sync-io`, payload.data);
            }
        }
    }
    deviceBoardcastMsg(deviceId, eventName, msg) {
        if (this.cacheDeviceLinkClient[deviceId]) {
            this.cacheDeviceLinkClient[deviceId].forEach((sockId) => {
                const _sock = this.io.sockets.sockets.get(sockId);
                if (_sock) {
                    _sock.emit(eventName, msg);
                }
            });
        }
    }
    onReceiveMessage(payload) {
        const pay = JSON.parse(payload);
        logger.info(`received message form ${pay.service} => ${payload.length}`);
        if (pay.service === 'mqtt-service') {
            this.handleDataMqtt(pay.payload, pay.action, pay.code);
        }
        else if (pay.service === 'db-service') {
            this.handleFromDatabase(pay.payload, pay.action, pay.code);
        }
    }
    onConnected(socket) {
        logger.info(`Client connected => ${socket.id}`);
    }
    onDisconnected(socket, reason) {
        logger.info('Client disconnected => ', socket.id, 'reason: ', reason);
        /* remove client when disconnect */
        this.removeCacheBySocketId(socket.id);
        // delete this.cacheClientLinkDevice[socket.id];
    }
    onControl(socket, data) {
        logger.info('Client control => ', socket.id);
        const _data = {
            service: 'socket-io-service',
            action: 'CONTROL',
            code: Constant_1.CODE_EVENT_UPDATE_OUTPUT,
            payload: {
                mac: data.mac,
                userId: data.userId,
                deviceId: data.deviceId,
                data: data.data,
            },
        };
        this.sendMessage('mqtt-service', _data);
    }
    removeCacheBySocketId(socketId) {
        /* get list device Id in cache */
        const deviceIds = this.cacheClientLinkDevice[socketId].devices.map((_) => _.id);
        for (const deviceId of deviceIds) {
            this.cacheDeviceLinkClient[deviceId] = this.cacheDeviceLinkClient[deviceId].filter((_) => _ !== socketId);
        }
        delete this.cacheClientLinkDevice[socketId];
    }
    validateBasePayload(payload) {
        return (payload === null || payload === void 0 ? void 0 : payload.deviceId) ? true : false;
    }
    onConnection(socket) {
        this.onConnected(socket);
        socket.on('control_io', (_) => {
            if (this.validateBasePayload(_)) {
                this.onControl(socket, _);
            }
        });
        socket.on('disconnect', (reason) => this.onDisconnected(socket, reason));
    }
    validateAuthentication(socket, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = socket.handshake.auth['token'];
            if (!token) {
                return next(new Error(JSON.stringify({ code: '108015', message: account_2.ACCOUNT_MESSAGE['108015'] })));
            }
            try {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SIGNATURE_SECRET || 'secret');
                if (decoded.email) {
                    /* check user exist */
                    const user = yield account_1.UserMD.findOne({ email: decoded.email });
                    if (user === null) {
                        return next(new Error(JSON.stringify({
                            code: '108001',
                            message: account_2.ACCOUNT_MESSAGE['108001'],
                        })));
                    }
                    const _devices = yield devices_1.DeviceMD.find({
                        by_user: user._id,
                        state: 'active',
                    })
                        .select('_id')
                        .exec();
                    logger.info('Client authenticated => ', socket.id, ' - userId: ', user._id.toString(), ' - devices: ', _devices.length);
                    this.cacheClientLinkDevice[socket.id] = {
                        userId: user._id.toString(),
                        devices: _devices.map((d) => {
                            if (typeof this.cacheDeviceLinkClient[d._id.toString()] ===
                                'undefined') {
                                this.cacheDeviceLinkClient[d._id.toString()] = [socket.id];
                            }
                            else {
                                this.cacheDeviceLinkClient[d._id.toString()].push(socket.id);
                            }
                            return {
                                id: d._id.toString(),
                                mac: d.mac,
                            };
                        }),
                    };
                }
                return next();
            }
            catch (error) {
                return next(new Error(JSON.stringify({ code: '108010', message: account_2.ACCOUNT_MESSAGE['108010'] })));
            }
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            // logger.info('Starting SocketIO instance');
            this.io.use(this.validateAuthentication.bind(this));
            this.io.on('connection', this.onConnection.bind(this));
            /* start listen socket-io on port */
            this.io.listen(this.port);
            logger.info(`SocketIO server listening on port: {${this.port}}`);
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            // logger.info('Stopping SocketIO instance');
            /* stop listen socket-io on port */
            this.io.close();
        });
    }
}
exports.default = new SocketIOInstance(parseInt(process.env.PORT_SOCKET_IO || '3000'));
//# sourceMappingURL=index.js.map