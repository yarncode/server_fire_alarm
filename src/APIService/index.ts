/* node_module import */
import { Logger } from 'sitka';
import { RocketService } from '../ManageService'
import express from 'express'

/* my import */
import routerSetup from './router/center'

const logger = Logger.getLogger({ name: 'API' });

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
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    routerSetup(this.app);
    this.app.listen(this.port, this.onListen.bind(this));
  }

  stop(): void {
    logger.info('Stopping API instance');
  }

  port: number;
  app: express.Application;
}

export default new APIInstance(3300);
