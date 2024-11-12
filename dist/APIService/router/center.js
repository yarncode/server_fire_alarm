"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* my import */
const account_1 = __importDefault(require("./account"));
const devices_1 = __importDefault(require("./devices"));
const sensor_1 = __importDefault(require("./sensor"));
const teencode = `
<pre>
      ╔═════════════════════╦═════════════╗         
      ║ © Copyright by Miru ║  27/09/2024 ║         
      ╚═════════════════════╩═════════════╝         
   ▄▄   ▄▄ ▄▄▄ ▄▄▄▄▄▄   ▄▄   ▄▄         ▄▄   ▄▄ ▄▄▄ ▄▄  
  █  █▄█  █   █   ▄  █ █  █ █  █       █  █ █  █   █  █ 
  █       █   █  █ █ █ █  █ █  █       █  █▄█  █   █  █ 
  █       █   █   █▄▄█▄█  █▄█  █       █       █   █  █ 
  █       █   █    ▄▄  █       █▄▄▄    █   ▄   █   █▄▄█ 
  █ ██▄██ █   █   █  █ █       █▄  █   █  █ █  █   █▄▄  
  █▄█   █▄█▄▄▄█▄▄▄█  █▄█▄▄▄▄▄▄▄█ █▄█   █▄▄█ █▄▄█▄▄▄█▄▄█
</pre>
`;
exports.default = (app) => {
    /* welcome server */
    app.get('/', (req, res) => res.send(teencode));
    app.use('/api/v1/account', account_1.default);
    app.use('/api/v1/device', devices_1.default);
    app.use('/api/v1/sensor', sensor_1.default);
};
//# sourceMappingURL=center.js.map