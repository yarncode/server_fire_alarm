/* node_module import */
import { Logger } from 'sitka';
import mongoose from 'mongoose';

/* my import */
import { RocketService } from '../ManageService'

const logger = Logger.getLogger({ name: 'DATABASE' });

export const DATABASE_SERVICE_NAME = 'db-service';

class DatabaseInstance extends RocketService {
  constructor(port: number) {
    super(DATABASE_SERVICE_NAME);
    this.port = port;
  }

  override onReceiveMessage(payload: string): void {
    logger.info(`Received payload: ${payload}`);
  }

  onMongoConnected(): void {
    logger.info(`MongoDB connected on port: {${this.port}}`);
  }

  onMongoFailure(): void {
    logger.info('MongoDB failed :(');
  }

  start(): void {
    // logger.info('Starting API instance');
    mongoose.connect(`mongodb://localhost:${this.port}/fire-alarm`)
    .then(this.onMongoConnected.bind(this))
    .catch(this.onMongoFailure.bind(this));
  }

  stop(): void {
    // logger.info('Stopping API instance');
    mongoose.disconnect();
  }

  port: number;
}

export default new DatabaseInstance(parseInt(process.env.PORT_DATABASE || '27017'));
