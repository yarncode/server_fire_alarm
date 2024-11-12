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
exports.DATABASE_SERVICE_NAME = void 0;
/* node_module import */
const sitka_1 = require("sitka");
const mongoose_1 = __importDefault(require("mongoose"));
const bull_1 = __importDefault(require("bull"));
/* my import */
const ManageService_1 = require("../ManageService");
const Constant_1 = require("../Constant");
const sensor_1 = require("./controller/sensor");
const device_1 = require("./controller/device");
const gpio_1 = require("./controller/gpio");
const logger = sitka_1.Logger.getLogger({ name: 'DATABASE' });
exports.DATABASE_SERVICE_NAME = 'db-service';
class DatabaseInstance extends ManageService_1.RocketService {
    constructor(port) {
        super(exports.DATABASE_SERVICE_NAME);
        this.port = port;
        this.queueSensor = new bull_1.default('sensor');
        this.queueStateDevice = new bull_1.default('state-device');
        this.queueStateIO = new bull_1.default('state-io');
        this.queueSyncIo = new bull_1.default('sync-io');
    }
    handleDataMqtt(payload, action, code) {
        const userId = payload.userId;
        const deviceId = payload.deviceId;
        const mac = payload.mac;
        /* check data action  */
        if (action === 'SET') {
            /* check data type  */
            if (typeof payload.data === 'string') {
                /* check code data */
                if (code === Constant_1.CODE_EVENT_UPDATE_SENSOR) {
                    /* push message to user client */
                    /* [PATH: '{userId}/{deviceId}/sensor'] */
                    const sensorPayload = JSON.parse(payload.data);
                    const data = {
                        userId,
                        deviceId,
                        mac,
                        data: sensorPayload,
                    };
                    this.queueSensor.add(data);
                }
                else if (code === Constant_1.CODE_EVENT_UPDATE_OUTPUT) {
                    /* [PATH: '{userId}/{deviceId}/output'] */
                    const gpioPayload = JSON.parse(payload.data);
                    const data = {
                        userId,
                        deviceId,
                        mac,
                        data: gpioPayload,
                    };
                    this.queueStateIO.add(data);
                }
                else if (code === Constant_1.CODE_EVENT_UPDATE_INPUT) {
                    /* [PATH: '{userId}/{deviceId}/input'] */
                    const gpioPayload = JSON.parse(payload.data);
                    const data = {
                        userId,
                        deviceId,
                        mac,
                        data: gpioPayload,
                    };
                    this.queueStateIO.add(data);
                }
                else if (code === Constant_1.CODE_EVENT_SYNC_GPIO) {
                    const gpioInfo = JSON.parse(payload.data);
                    /* check is array */
                    if (typeof gpioInfo.input !== 'object' ||
                        typeof gpioInfo.output !== 'object') {
                        logger.error('input & output must be array.');
                        return;
                    }
                    const data = {
                        userId,
                        deviceId,
                        mac,
                        data: {
                            input: gpioInfo.input,
                            output: gpioInfo.output,
                        },
                    };
                    this.queueSyncIo.add(data);
                }
            }
            else {
                if (code === Constant_1.CODE_EVENT_UPDATE_STATE_DEVICE) {
                    const statePayload = payload.data;
                    const data = {
                        userId,
                        deviceId,
                        mac,
                        data: statePayload,
                    };
                    this.queueStateDevice.add(data);
                }
            }
        }
    }
    handleUpdateSensor(job, done) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield (0, sensor_1.updateSensor)(job.data);
                done(null, res); // done handle save data sensor
            }
            catch (error) {
                done(error, null);
            }
            /* handler job */
        });
    }
    handleUpdateIo(job, done) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield (0, gpio_1.updateGpio)(job.data);
                done(null, res); // done handle save data sensor
            }
            catch (error) {
                done(error, null);
            }
        });
    }
    handleUpdateStateDevice(job, done) {
        return __awaiter(this, void 0, void 0, function* () {
            /* handler job */
            try {
                const res = yield (0, device_1.updateStateDevice)(job.data);
                done(null, res); // done handle save state device
            }
            catch (error) {
                done(error, null);
            }
        });
    }
    handleSyncIo(job, done) {
        return __awaiter(this, void 0, void 0, function* () {
            /* handler job */
            try {
                const res = yield (0, gpio_1.createGpio)(job.data);
                done(null, res); // done handle save state device
            }
            catch (error) {
                done(error, null);
            }
        });
    }
    onHandleUpdateStateDeviceCompleted(job, result) {
        const data = {
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
    }
    onHandleSyncIoCompleted(job, result) {
        const data = {
            service: 'db-service',
            action: 'NOTIFY',
            code: Constant_1.CODE_EVENT_SYNC_GPIO,
            payload: {
                mac: job.data.mac,
                userId: job.data.userId,
                deviceId: job.data.deviceId,
                data: result,
            },
        };
        this.sendMessage('socket-io-service', data);
    }
    onHandleUpdateSensorCompleted(job, result) {
        const data = {
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
    }
    onHandleUpdateIoCompleted(job, result) {
        const data = {
            service: 'db-service',
            action: 'NOTIFY',
            code: Constant_1.CODE_EVENT_UPDATE_OUTPUT,
            payload: {
                mac: job.data.mac,
                userId: job.data.userId,
                deviceId: job.data.deviceId,
                data: result,
            },
        };
        this.sendMessage('socket-io-service', data);
    }
    onReceiveMessage(payload) {
        const pay = JSON.parse(payload);
        logger.info(`received message form ${pay.service}`);
        if (pay.service === 'mqtt-service') {
            this.handleDataMqtt(pay.payload, pay.action, pay.code);
        }
    }
    onMongoConnected() {
        logger.info(`MongoDB connected on port: {${this.port}}`);
    }
    onMongoFailure() {
        logger.info('MongoDB failed :(');
    }
    start() {
        // logger.info('Starting API instance');
        this.queueSensor.process(this.handleUpdateSensor.bind(this));
        this.queueSensor.on('completed', this.onHandleUpdateSensorCompleted.bind(this));
        this.queueStateIO.process(this.handleUpdateIo.bind(this));
        this.queueStateIO.on('completed', this.onHandleUpdateIoCompleted.bind(this));
        this.queueStateDevice.process(this.handleUpdateStateDevice.bind(this));
        this.queueStateDevice.on('completed', this.onHandleUpdateStateDeviceCompleted.bind(this));
        this.queueSyncIo.process(this.handleSyncIo.bind(this));
        this.queueSyncIo.on('completed', this.onHandleSyncIoCompleted.bind(this));
        mongoose_1.default
            .connect(`mongodb://localhost:${this.port}/fire-alarm`)
            .then(this.onMongoConnected.bind(this))
            .catch(this.onMongoFailure.bind(this));
    }
    stop() {
        // logger.info('Stopping API instance');
        mongoose_1.default.disconnect();
    }
}
exports.default = new DatabaseInstance(parseInt(process.env.PORT_DATABASE || '27017'));
//# sourceMappingURL=index.js.map