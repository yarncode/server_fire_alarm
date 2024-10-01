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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_SERVICE_NAME = void 0;
/* node_module import */
var sitka_1 = require("sitka");
var ManageService_1 = require("../ManageService");
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
/* my import */
var center_1 = __importDefault(require("./router/center"));
var logger = sitka_1.Logger.getLogger({ name: 'API' });
exports.API_SERVICE_NAME = 'api-service';
var APIInstance = /** @class */ (function (_super) {
    __extends(APIInstance, _super);
    function APIInstance(port) {
        var _this = _super.call(this, exports.API_SERVICE_NAME) || this;
        _this.port = port;
        _this.app = (0, express_1.default)();
        return _this;
    }
    APIInstance.prototype.onReceiveMessage = function (payload) {
        logger.info("Received payload: ".concat(payload));
    };
    APIInstance.prototype.onListen = function () {
        logger.info("API server listening on port: {".concat(this.port, "}"));
    };
    APIInstance.prototype.start = function () {
        /* setup body parser */
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)());
        (0, center_1.default)(this.app);
        this.app.listen(this.port, this.onListen.bind(this));
    };
    APIInstance.prototype.stop = function () {
        logger.info('Stopping API instance');
    };
    return APIInstance;
}(ManageService_1.RocketService));
exports.default = new APIInstance(parseInt(process.env.PORT_SERVER_API || '3300'));
//# sourceMappingURL=index.js.map