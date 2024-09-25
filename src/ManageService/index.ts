/* node_module import */
import { Logger } from 'sitka';
import { RedisClientType, createClient } from 'redis';
import { PayloadService } from '../Constant/interface'

/* local import */
// import { LIST_OF_SERVICES } from '../Constant'

const logger = Logger.getLogger({ name: 'ROCKET' });

class RocketService {
	constructor(serviceName: string) {
		this.client = createClient();
		this._SERVICE_NAME = serviceName;
		this.startRocket();
	}

	onReceiveMessage(payload: string): void {
		const pay: PayloadService = JSON.parse(payload);
		logger.info(`Received payload: ${pay}`);
	}

	onConnect(): void {
		logger.info(`${this._SERVICE_NAME} Connected`);
	}

	onDisconnect(): void {
		logger.info(`${this._SERVICE_NAME} Disconnecting...`);
	}

	onError(err: any): void {
		// logger.error(err);
	}

	onReconnect(): void {
		logger.info(`${this._SERVICE_NAME} Reconnecting...`);
	}

	startRocket(): void {
		logger.info(`Starting RocketService on [${this._SERVICE_NAME.toLocaleUpperCase()}] instance`);
		this.client.subscribe(this._SERVICE_NAME, this.onReceiveMessage);
		this.client.on('connect', this.onConnect);
		this.client.on('disconnect', this.onDisconnect);
		this.client.on('error', this.onError);
		this.client.on('reconnect', this.onReconnect);
		this.client.connect();
	}

	stopRocket(): void {
		logger.info('Stopping RocketService instance');
		this.client.unsubscribe(this._SERVICE_NAME);
		this.client.quit();
	}

	client: RedisClientType;
	_SERVICE_NAME: string;
}

export {
	RocketService
};
