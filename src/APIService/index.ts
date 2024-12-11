/* node_module import */
// import { Logger } from 'sitka';
import Logger from 'node-color-log';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

/* my import */
import { RocketService } from '../ManageService';
import routerSetup from './router/center';

export interface DataApi {
  mac: string;
  userId: string;
  deviceId: string;
  data: any;
}


const logger = Logger.createNamedLogger('API');
logger.setDate(() => new Date().toLocaleString());

export const API_SERVICE_NAME = 'api-service';

class APIInstance extends RocketService {
  constructor(port: number) {
    super(API_SERVICE_NAME);
    this.port = port;
    this.app = express();
  }

  override onReceiveMessage(payload: string): void {
    logger.info(`Received payload: ${payload}`);
  }

  onListen(): void {
    logger.info(`API server listening on port: {${this.port}}`);
  }

  start(): void {
    /* setup body parser */
    this.app.locals['_ctx'] = this;
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(morgan('dev'));
    this.app.use(
      cors({
        origin: '*',
      })
    );
    routerSetup(this.app);
    this.app.listen(this.port, this.onListen.bind(this));
  }

  stop(): void {
    logger.info('Stopping API instance');
  }

  port: number;
  app: express.Application;
}

export default new APIInstance(parseInt(process.env.PORT_SERVER_API || '3300'));
