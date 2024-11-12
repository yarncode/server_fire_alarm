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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RocketService = void 0;
/* node_module import */
const sitka_1 = require("sitka");
const redis_1 = require("redis");
/* local import */
// import { LIST_OF_SERVICES } from '../Constant'
const logger = sitka_1.Logger.getLogger({ name: 'ROCKET' });
class RocketService {
    constructor(serviceName) {
        this.subscriber = (0, redis_1.createClient)();
        this.publisher = (0, redis_1.createClient)();
        this._SERVICE_NAME = serviceName;
        this.startRocket();
    }
    onReceiveMessage(payload) {
        /*  */
    }
    sendMessage(to, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.publisher.publish(to, JSON.stringify(payload));
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    onConnect() {
        logger.info(`${this._SERVICE_NAME} linked`);
    }
    onDisconnect() {
        logger.info(`${this._SERVICE_NAME} unlinked`);
    }
    onError(err) {
        logger.error(`${this._SERVICE_NAME} error: ${err === null || err === void 0 ? void 0 : err.message}`);
    }
    onReconnect() {
        logger.info(`${this._SERVICE_NAME} Reconnecting...`);
    }
    startRocket() {
        logger.info(`Starting RocketService on [${this._SERVICE_NAME.toLocaleUpperCase()}] instance`);
        this.subscriber.subscribe(this._SERVICE_NAME, this.onReceiveMessage.bind(this));
        this.subscriber.on('connect', this.onConnect.bind(this));
        this.subscriber.on('disconnect', this.onDisconnect.bind(this));
        this.subscriber.on('error', this.onError.bind(this));
        this.subscriber.on('reconnect', this.onReconnect.bind(this));
        this.subscriber.connect();
        this.publisher.connect();
    }
    stopRocket() {
        logger.info('Stopping RocketService instance');
        this.subscriber.unsubscribe(this._SERVICE_NAME);
        this.subscriber.quit();
    }
}
exports.RocketService = RocketService;
//# sourceMappingURL=index.js.map