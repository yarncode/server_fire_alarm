/* node_module import */
import { Logger } from 'sitka';
import { RedisClientType, createClient } from 'redis';
import { PayloadRocket } from '../Constant/interface'

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
		const pay: PayloadRocket = JSON.parse(payload);
		logger.info(`Received payload: ${pay}`);
	}

	sendMessage(to: string, payload: PayloadRocket): Promise<any> {
		return this.client.publish(to, JSON.stringify(payload));
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
		logger.info(`Starting RocketService on [${this._SERVICE_NAME.toLocaleUpperCase()}] instance`);
		this.client.subscribe(this._SERVICE_NAME, this.onReceiveMessage.bind(this));
		this.client.on('connect', this.onConnect.bind(this));
		this.client.on('disconnect', this.onDisconnect.bind(this));
		this.client.on('error', this.onError.bind(this));
		this.client.on('reconnect', this.onReconnect.bind(this));
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
