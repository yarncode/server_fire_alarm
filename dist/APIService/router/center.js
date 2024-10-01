"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* my import */
var account_1 = __importDefault(require("./account"));
var devices_1 = __importDefault(require("./devices"));
var teencode = "\n<pre>\n      \u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2566\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557         \n      \u2551 \u00A9 Copyright by Miru \u2551  27/09/2024 \u2551         \n      \u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2569\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D         \n   \u2584\u2584   \u2584\u2584 \u2584\u2584\u2584 \u2584\u2584\u2584\u2584\u2584\u2584   \u2584\u2584   \u2584\u2584         \u2584\u2584   \u2584\u2584 \u2584\u2584\u2584 \u2584\u2584  \n  \u2588  \u2588\u2584\u2588  \u2588   \u2588   \u2584  \u2588 \u2588  \u2588 \u2588  \u2588       \u2588  \u2588 \u2588  \u2588   \u2588  \u2588 \n  \u2588       \u2588   \u2588  \u2588 \u2588 \u2588 \u2588  \u2588 \u2588  \u2588       \u2588  \u2588\u2584\u2588  \u2588   \u2588  \u2588 \n  \u2588       \u2588   \u2588   \u2588\u2584\u2584\u2588\u2584\u2588  \u2588\u2584\u2588  \u2588       \u2588       \u2588   \u2588  \u2588 \n  \u2588       \u2588   \u2588    \u2584\u2584  \u2588       \u2588\u2584\u2584\u2584    \u2588   \u2584   \u2588   \u2588\u2584\u2584\u2588 \n  \u2588 \u2588\u2588\u2584\u2588\u2588 \u2588   \u2588   \u2588  \u2588 \u2588       \u2588\u2584  \u2588   \u2588  \u2588 \u2588  \u2588   \u2588\u2584\u2584  \n  \u2588\u2584\u2588   \u2588\u2584\u2588\u2584\u2584\u2584\u2588\u2584\u2584\u2584\u2588  \u2588\u2584\u2588\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2588 \u2588\u2584\u2588   \u2588\u2584\u2584\u2588 \u2588\u2584\u2584\u2588\u2584\u2584\u2584\u2588\u2584\u2584\u2588\n</pre>\n";
exports.default = (function (app) {
    /* welcome server */
    app.get('/', function (req, res) { return res.send(teencode); });
    app.use('/api/v1/account', account_1.default);
    app.use('/api/v1/device', devices_1.default);
});
//# sourceMappingURL=center.js.map