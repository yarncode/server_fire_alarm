import { Logger } from 'sitka';

import server, { Server } from 'net'
import Aedes, { Client, AedesPublishPacket, PingreqPacket } from 'aedes'

const logger = Logger.getLogger({ name: 'MQTT' });

class MqttInstance {

	constructor(port: number) {
		this.port = port;
		this.aedes = new Aedes();
		this.server = server.createServer(this.aedes.handle);
	}

	onConnected(client: Client): void {
		logger.info('Client connected => ', client.id);
	}
	onDisconnected(client: Client): void {
		logger.info('Client disconnected => ', client.id);
	}

	onPing(packet: PingreqPacket, client: Client): void {
		logger.info(`Client id: ${client.id} - Ping`);
	}

	onPublished(packet: AedesPublishPacket, client: Client | null): void {
		if (client) {
			logger.info(`Client id: ${client?.id} - Published topic: ${packet.topic} length: ${packet.payload.length}`);
		}
	}

	async start() {
		logger.info('Starting MQTT instance');

		this.aedes.on('client', this.onConnected);
		this.aedes.on('clientDisconnect', this.onDisconnected);
		this.aedes.on('publish', this.onPublished);
		this.aedes.on('ping', this.onPing);

		/* start listen server on port */
		this.server.listen(this.port, () => {
			logger.info(`MQTT server listening on port: {${this.port}}`);
		});
	}

	async stop() {
		logger.info('Stopping MQTT instance');

		/* stop listen server on port */
		this.server.close(() => {
			logger.info('MQTT server stopped');
		});
	}

	port: number;
	aedes: Aedes;
	server: Server;
}

export default new MqttInstance(1883);