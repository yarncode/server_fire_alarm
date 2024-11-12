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
exports.MQTT_SERVICE_NAME = void 0;
/* node_module import */
const sitka_1 = require("sitka");
const net_1 = __importDefault(require("net"));
const aedes_1 = __importDefault(require("aedes"));
const Constant_1 = require("../Constant");
const ManageService_1 = require("../ManageService");
const devices_1 = require("../DatabaseService/models/devices");
const logger = sitka_1.Logger.getLogger({ name: 'MQTT' });
exports.MQTT_SERVICE_NAME = 'mqtt-service';
class MqttInstance extends ManageService_1.RocketService {
    constructor(port) {
        super(exports.MQTT_SERVICE_NAME);
        this.cacheInfoClient = {};
        this.cacheLinkDevice = {};
        this.port = port;
        this.aedes = new aedes_1.default();
        this.server = net_1.default.createServer(this.aedes.handle);
    }
    handleDeviceActive(clientId, payload) {
        const userId = this.cacheInfoClient[clientId].userId;
        const deviceId = this.cacheInfoClient[clientId].deviceId;
        const mac = this.cacheInfoClient[clientId].mac;
        if (userId && deviceId && mac) {
            /* push message to user client */
            // logger.info(`Pushing to user: ${userId} - payload: ${payload}`);
            const data = {
                service: 'mqtt-service',
                action: 'NOTIFY',
                code: Constant_1.CODE_EVENT_ACTIVE_DEVICE,
                payload: {
                    mac,
                    userId,
                    deviceId,
                    topic: '/active',
                    data: payload,
                },
            };
            this.sendMessage('socket-io-service', data);
        }
    }
    handleSensor(clientId, payload) {
        const userId = this.cacheInfoClient[clientId].userId;
        const deviceId = this.cacheInfoClient[clientId].deviceId;
        const mac = this.cacheInfoClient[clientId].mac;
        if (userId && deviceId && mac) {
            /* push message to user client */
            // logger.info(`Pushing to user: ${userId} - payload: ${payload}`);
            const data = {
                service: 'mqtt-service',
                action: 'SET',
                code: Constant_1.CODE_EVENT_UPDATE_SENSOR,
                payload: {
                    mac,
                    userId,
                    deviceId,
                    topic: '/sensor',
                    data: payload,
                },
            };
            /* set data into database */
            this.sendMessage('db-service', data);
        }
    }
    handleNotify(clientId, payload) {
        var _a, _b;
        try {
            const userId = this.cacheInfoClient[clientId].userId;
            const deviceId = this.cacheInfoClient[clientId].deviceId;
            const mac = this.cacheInfoClient[clientId].mac;
            const _payload = JSON.parse(payload);
            if (userId && deviceId && mac) {
                const data = {
                    service: 'mqtt-service',
                    action: 'SET',
                    code: (_b = (_a = _payload._type) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : Constant_1.CODE_EVENT_UNKNOWN,
                    payload: {
                        mac,
                        userId,
                        deviceId,
                        topic: '/notify',
                        data: payload,
                    },
                };
                /* set data into database */
                this.sendMessage('db-service', data);
            }
        }
        catch (error) {
            logger.error(error);
        }
    }
    handleIoOutput(clientId, payload) {
        const userId = this.cacheInfoClient[clientId].userId;
        const deviceId = this.cacheInfoClient[clientId].deviceId;
        const mac = this.cacheInfoClient[clientId].mac;
        if (userId && deviceId && mac) {
            /* push message to user client */
            // logger.info(`Pushing to user: ${userId} - payload: ${payload}`);
            const data = {
                service: 'mqtt-service',
                action: 'SET',
                code: Constant_1.CODE_EVENT_UPDATE_OUTPUT,
                payload: {
                    mac,
                    userId,
                    deviceId,
                    topic: '/output',
                    data: payload,
                },
            };
            /* set data into database */
            this.sendMessage('db-service', data);
        }
    }
    handleIoInput(clientId, payload) {
        const userId = this.cacheInfoClient[clientId].userId;
        const deviceId = this.cacheInfoClient[clientId].deviceId;
        const mac = this.cacheInfoClient[clientId].mac;
        if (userId && deviceId && mac) {
            /* push message to user client */
            // logger.info(`Pushing to user: ${userId} - payload: ${payload}`);
            const data = {
                service: 'mqtt-service',
                action: 'SET',
                code: Constant_1.CODE_EVENT_UPDATE_INPUT,
                payload: {
                    mac,
                    userId,
                    deviceId,
                    topic: '/input',
                    data: payload,
                },
            };
            /* set data into database */
            this.sendMessage('db-service', data);
        }
    }
    handleStateDevice(clientId, status) {
        const data = {
            service: 'mqtt-service',
            action: 'SET',
            code: Constant_1.CODE_EVENT_UPDATE_STATE_DEVICE,
            payload: {
                mac: this.cacheInfoClient[clientId].mac,
                userId: this.cacheInfoClient[clientId].userId,
                deviceId: this.cacheInfoClient[clientId].deviceId,
                topic: '/sensor',
                data: {
                    status,
                },
            },
        };
        /* set data into database */
        this.sendMessage('db-service', data);
    }
    handleDataSocketIo(payload, action, code) {
        // const userId = payload.userId;
        const deviceId = payload.deviceId;
        // const mac = payload.mac;
        if (action === 'CONTROL') {
            if (code === Constant_1.CODE_EVENT_UPDATE_OUTPUT) {
                this.sendPayload(deviceId, '/control', JSON.stringify(payload.data));
            }
        }
    }
    handleDataApi(payload, action, code) {
        // const userId = payload.userId;
        const deviceId = payload.deviceId;
        // const mac = payload.mac;
        if (action === 'CONFIG') {
            if (code === Constant_1.CODE_EVENT_SYNC_THRESHOLD) {
                this.sendPayload(deviceId, '/config', JSON.stringify(payload.data));
            }
        }
    }
    onReceiveMessage(payload) {
        // logger.info(`Received payload: ${payload}`);
        const pay = JSON.parse(payload);
        if (pay.service === 'socket-io-service') {
            this.handleDataSocketIo(pay.payload, pay.action, pay.code);
        }
        else if (pay.service === 'api-service') {
            this.handleDataApi(pay.payload, pay.action, pay.code);
        }
    }
    onConnected(client) {
        logger.info('Client connected => ', client.id);
        this.handleStateDevice(client.id, 'ONLINE');
    }
    onDisconnected(client) {
        logger.info('Client disconnected => ', client.id);
        /* remove client when disconnect */
        this.handleStateDevice(client.id, 'OFFLINE');
        // this.removeCacheByClientId(client.id);
    }
    onPing(packet, client) {
        logger.info(`Client id: ${client.id} - Ping`);
    }
    onPublished(packet, client) {
        if (client) {
            logger.info(`Client id: ${client === null || client === void 0 ? void 0 : client.id} - Published topic: ${packet.topic} length: ${packet.payload.length}`);
            if (!(client === null || client === void 0 ? void 0 : client.id)) {
                logger.error('Client id is not found');
                return;
            }
            if (packet.payload.length < 0) {
                logger.error('Payload is empty');
                return;
            }
            if (packet.topic === '/sensor') {
                this.handleSensor(client.id, packet.payload.toString());
            }
            else if (packet.topic === '/output-io') {
                this.handleIoOutput(client.id, packet.payload.toString());
            }
            else if (packet.topic === '/input-io') {
                this.handleIoInput(client.id, packet.payload.toString());
            }
            else if (packet.topic === '/active') {
                this.handleDeviceActive(client.id, packet.payload.toString());
            }
            else if (packet.topic === '/notify') {
                this.handleNotify(client.id, packet.payload.toString());
            }
        }
    }
    onAuthentication(client, username, password, done) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const decodePassword = (_a = password === null || password === void 0 ? void 0 : password.toString()) !== null && _a !== void 0 ? _a : '';
            /* logger.info(
              'Client authenticated => ',
              client.id,
              ' - username: ',
              username,
              ' - password: ',
              decodePassword
              ); */
            /* get device in database */
            const device = yield devices_1.DeviceMD.findOne({
                auth: { username: username, password: decodePassword },
            });
            logger.info('Client authenticated => ', client.id, ' - deviceId: ', device === null || device === void 0 ? void 0 : device._id.toString());
            if (device == null) {
                done({
                    returnCode: 4 /* AuthErrorCode.BAD_USERNAME_OR_PASSWORD */,
                    name: 'Authentication',
                    message: 'Bad username or password',
                }, false);
            }
            else {
                // this.cacheInfoClient[client.id] = {
                //   userId: device.by_user.toString(),
                //   deviceId: device._id.toString(),
                //   mac: device.mac,
                // };
                this.setClientCache(client, device._id.toString(), device.by_user.toString(), device.mac);
                done(null, true);
            }
        });
    }
    sendPayload(id, topic, msg) {
        var _a;
        console.log('Send to device: ', id, 'clienId: ', (_a = this.getClientByDeviceId(id)) === null || _a === void 0 ? void 0 : _a.id);
        const _ctx = this.getClientByDeviceId(id);
        if (_ctx) {
            console.log('Publish to device: ', id, ' - topic: ', topic, ' - msg: ', msg);
            _ctx.publish({
                cmd: 'publish',
                topic,
                payload: msg,
                dup: false,
                retain: false,
                qos: 1,
            }, (err) => {
                if (err) {
                    logger.error('Publish error: ', err);
                }
            });
        }
    }
    setClientCache(client, deviceId, userId, mac) {
        this.cacheInfoClient[client.id] = {
            userId,
            deviceId,
            mac,
        };
        this.cacheLinkDevice[deviceId] = {
            ctx: client,
        };
    }
    getClientByDeviceId(deviceId) {
        return deviceId in this.cacheLinkDevice
            ? this.cacheLinkDevice[deviceId].ctx
            : undefined;
    }
    getClientByClientId(clientId) {
        return this.cacheInfoClient[clientId].deviceId
            ? this.cacheLinkDevice[this.cacheInfoClient[clientId].deviceId].ctx
            : undefined;
    }
    removeCacheByDeviceId(deviceId) {
        const _clientId = this.cacheLinkDevice[deviceId].ctx.id;
        const _deviceId = deviceId;
        delete this.cacheInfoClient[_clientId];
        if (this.cacheLinkDevice[_deviceId].ctx.closed) {
            delete this.cacheLinkDevice[_deviceId];
        }
    }
    removeCacheByClientId(clientId) {
        const _deviceId = this.cacheInfoClient[clientId].deviceId;
        const _clientId = clientId;
        delete this.cacheInfoClient[_clientId];
        delete this.cacheLinkDevice[_deviceId];
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            // logger.info('Starting MQTT instance');
            this.aedes.authenticate = this.onAuthentication.bind(this);
            this.aedes.on('client', this.onConnected.bind(this));
            this.aedes.on('clientDisconnect', this.onDisconnected.bind(this));
            this.aedes.on('publish', this.onPublished.bind(this));
            this.aedes.on('ping', this.onPing.bind(this));
            /* start listen server on port */
            this.server.listen(this.port, () => {
                logger.info(`MQTT server listening on port: {${this.port}}`);
            });
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info('Stopping MQTT instance');
            /* stop listen server on port */
            this.server.close(() => {
                logger.info('MQTT server stopped');
            });
        });
    }
}
exports.default = new MqttInstance(parseInt(process.env.PORT_SOCKET_MQTT || '1883'));
//# sourceMappingURL=index.js.map