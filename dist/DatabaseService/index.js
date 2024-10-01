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
exports.DATABASE_SERVICE_NAME = void 0;
/* node_module import */
var sitka_1 = require("sitka");
var mongoose_1 = __importDefault(require("mongoose"));
/* my import */
var ManageService_1 = require("../ManageService");
var logger = sitka_1.Logger.getLogger({ name: 'DATABASE' });
exports.DATABASE_SERVICE_NAME = 'db-service';
var DatabaseInstance = /** @class */ (function (_super) {
    __extends(DatabaseInstance, _super);
    function DatabaseInstance(port) {
        var _this = _super.call(this, exports.DATABASE_SERVICE_NAME) || this;
        _this.port = port;
        return _this;
    }
    DatabaseInstance.prototype.onReceiveMessage = function (payload) {
        logger.info("Received payload: ".concat(payload));
    };
    DatabaseInstance.prototype.onMongoConnected = function () {
        logger.info("MongoDB connected on port: {".concat(this.port, "}"));
    };
    DatabaseInstance.prototype.onMongoFailure = function () {
        logger.info('MongoDB failed :(');
    };
    DatabaseInstance.prototype.start = function () {
        // logger.info('Starting API instance');
        mongoose_1.default.connect("mongodb://localhost:".concat(this.port, "/fire-alarm"))
            .then(this.onMongoConnected.bind(this))
            .catch(this.onMongoFailure.bind(this));
    };
    DatabaseInstance.prototype.stop = function () {
        // logger.info('Stopping API instance');
        mongoose_1.default.disconnect();
    };
    return DatabaseInstance;
}(ManageService_1.RocketService));
exports.default = new DatabaseInstance(parseInt(process.env.PORT_DATABASE || '27017'));
//# sourceMappingURL=index.js.map