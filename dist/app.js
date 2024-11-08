'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var MqttService_1 = __importDefault(require("./MqttService"));
var APIService_1 = __importDefault(require("./APIService"));
var DatabaseService_1 = __importDefault(require("./DatabaseService"));
var SocketIOService_1 = __importDefault(require("./SocketIOService"));
DatabaseService_1.default.start();
APIService_1.default.start();
MqttService_1.default.start();
SocketIOService_1.default.start();
//# sourceMappingURL=app.js.map