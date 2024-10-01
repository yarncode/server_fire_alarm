/* node_module import */
import { Logger } from 'sitka';
import { Server as SocketIOServer, Socket } from 'socket.io';

/* my import */
import { RocketService } from '../ManageService';
import { main_auth } from './middleware';
import { DataMqtt } from '../MqttService';
import { DataRocketDynamic } from '../Constant/interface';

const logger = Logger.getLogger({ name: 'SOCKET_IO' });

export const SOCKET_IO_SERVICE_NAME = 'socket-io-service';

class SocketIOInstance extends RocketService {
  constructor(port: number) {
    super(SOCKET_IO_SERVICE_NAME);
    this.port = port;
    // this.server = createServer();
    this.io = new SocketIOServer({ cors: { origin: '*' } });
  }

  override onReceiveMessage(payload: string): void {
    const pay: DataRocketDynamic = JSON.parse(payload);
    logger.info(`received message form ${pay.service}`);

    if (pay.service === 'mqtt-service') {
      const childPayload = pay.payload as DataMqtt;

      const userId = childPayload.userId;
      const mac = childPayload.mac;
      const whereEmit = childPayload.emitEvent;
      const action = childPayload.action;

      if (userId && mac && whereEmit && action.includes('NOTIFY')) {
        /* push message to user client */
        this.io.emit(`${userId}/${mac}/${whereEmit}`, childPayload.data);
      }
    }
  }

  onConnected(socket: Socket): void {
    logger.info(`Client connected => ${socket.id}`);
  }

  onDisconnected(socket: Socket, reason: string): void {
    logger.info('Client disconnected => ', socket.id, 'reason: ', reason);
  }

  onConnection(socket: Socket): void {
    this.onConnected(socket);
    socket.on('disconnect', (reason: string) =>
      this.onDisconnected(socket, reason)
    );
  }

  async start() {
    // logger.info('Starting SocketIO instance');
    this.io.use(main_auth.validate_token);
    this.io.on('connection', this.onConnection.bind(this));

    /* start listen socket-io on port */
    this.io.listen(this.port);
    logger.info(`SocketIO server listening on port: {${this.port}}`);
  }

  async stop() {
    // logger.info('Stopping SocketIO instance');
    /* stop listen socket-io on port */
    this.io.close();
  }

  port: number;
  //   server: Server;
  io: SocketIOServer;
}

export default new SocketIOInstance(
  parseInt(process.env.PORT_SOCKET_IO || '3000')
);
