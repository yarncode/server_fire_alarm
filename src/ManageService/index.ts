/* node_module import */
import { Logger } from 'sitka';
import { RedisClientType, createClient } from 'redis';
import { DataRocketDynamic, ServiceType } from '../Constant/interface';

/* local import */
// import { LIST_OF_SERVICES } from '../Constant'

const logger = Logger.getLogger({ name: 'ROCKET' });

class RocketService {
  constructor(serviceName: string) {
    this.subscriber = createClient();
    this.publisher = createClient();
    this._SERVICE_NAME = serviceName;
    this.startRocket();
  }

  onReceiveMessage(payload: string): void {
    /*  */
  }

  async sendMessage(
    to: ServiceType,
    payload: DataRocketDynamic
  ): Promise<void> {
    try {
      await this.publisher.publish(to, JSON.stringify(payload));
    } catch (error) {
      console.log(error);
    }
  }

  onConnect(): void {
    logger.info(`${this._SERVICE_NAME} linked`);
  }

  onDisconnect(): void {
    logger.info(`${this._SERVICE_NAME} unlinked`);
  }

  onError(err: any): void {
    logger.error(`${this._SERVICE_NAME} error: ${err?.message}`);
  }

  onReconnect(): void {
    logger.info(`${this._SERVICE_NAME} Reconnecting...`);
  }

  startRocket(): void {
    logger.info(
      `Starting RocketService on [${this._SERVICE_NAME.toLocaleUpperCase()}] instance`
    );
    this.subscriber.subscribe(
      this._SERVICE_NAME,
      this.onReceiveMessage.bind(this)
    );
    this.subscriber.on('connect', this.onConnect.bind(this));
    this.subscriber.on('disconnect', this.onDisconnect.bind(this));
    this.subscriber.on('error', this.onError.bind(this));
    this.subscriber.on('reconnect', this.onReconnect.bind(this));
    this.subscriber.connect();
    this.publisher.connect();
  }

  stopRocket(): void {
    logger.info('Stopping RocketService instance');
    this.subscriber.unsubscribe(this._SERVICE_NAME);
    this.subscriber.quit();
  }

  subscriber: RedisClientType;
  publisher: RedisClientType;
  _SERVICE_NAME: string;
}

export { RocketService };
