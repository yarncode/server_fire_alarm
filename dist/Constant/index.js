"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CODE_EVENT_UPDATE_STATE_DEVICE = exports.CODE_EVENT_SYNC_GPIO = exports.CODE_EVENT_SYNC_THRESHOLD = exports.CODE_EVENT_UPDATE_OUTPUT = exports.CODE_EVENT_UPDATE_INPUT = exports.CODE_EVENT_UPDATE_SENSOR = exports.CODE_EVENT_ACTIVE_DEVICE = exports.CODE_EVENT_UNKNOWN = exports.LIST_OF_SERVICES = void 0;
const APIService_1 = require("../APIService");
const DatabaseService_1 = require("../DatabaseService");
const MqttService_1 = require("../MqttService");
exports.LIST_OF_SERVICES = [
    APIService_1.API_SERVICE_NAME,
    DatabaseService_1.DATABASE_SERVICE_NAME,
    MqttService_1.MQTT_SERVICE_NAME
];
exports.CODE_EVENT_UNKNOWN = 'UNKNOWN';
exports.CODE_EVENT_ACTIVE_DEVICE = 'ACTIVE_DEVICE';
exports.CODE_EVENT_UPDATE_SENSOR = 'UPDATE_SENSOR';
exports.CODE_EVENT_UPDATE_INPUT = 'UPDATE_INPUT';
exports.CODE_EVENT_UPDATE_OUTPUT = 'UPDATE_OUTPUT';
exports.CODE_EVENT_SYNC_THRESHOLD = 'SYNC_THRESHOLD';
exports.CODE_EVENT_SYNC_GPIO = 'SYNC_GPIO';
exports.CODE_EVENT_UPDATE_STATE_DEVICE = 'UPDATE_STATE_DEVICE';
//# sourceMappingURL=index.js.map