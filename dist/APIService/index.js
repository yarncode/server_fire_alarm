"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_SERVICE_NAME = void 0;
/* node_module import */
const sitka_1 = require("sitka");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
/* my import */
const ManageService_1 = require("../ManageService");
const center_1 = __importDefault(require("./router/center"));
const logger = sitka_1.Logger.getLogger({ name: 'API' });
exports.API_SERVICE_NAME = 'api-service';
class APIInstance extends ManageService_1.RocketService {
    constructor(port) {
        super(exports.API_SERVICE_NAME);
        this.port = port;
        this.app = (0, express_1.default)();
    }
    onReceiveMessage(payload) {
        logger.info(`Received payload: ${payload}`);
    }
    onListen() {
        logger.info(`API server listening on port: {${this.port}}`);
    }
    start() {
        /* setup body parser */
        this.app.locals['_ctx'] = this;
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use(express_1.default.json());
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use((0, cors_1.default)({
            origin: '*',
        }));
        (0, center_1.default)(this.app);
        this.app.listen(this.port, this.onListen.bind(this));
    }
    stop() {
        logger.info('Stopping API instance');
    }
}
exports.default = new APIInstance(parseInt(process.env.PORT_SERVER_API || '3300'));
//# sourceMappingURL=index.js.map