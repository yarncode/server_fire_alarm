/* node_module import */
import express from 'express';

/* my import */
import routerAccount from './account';
import routerDevice from './devices';
import routerSensor from './sensor';

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

export default (app: express.Application) => {
    /* welcome server */
    app.get('/', (req, res) => res.send(teencode))
    app.use('/api/v1/account', routerAccount);
    app.use('/api/v1/device', routerDevice);
    app.use('/api/v1/sensor', routerSensor);
}