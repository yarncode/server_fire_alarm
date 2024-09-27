/* node_module import */
import { Logger } from 'sitka';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { createServer, Server } from 'http';

/* my import */
import { RocketService } from '../ManageService';

const logger = Logger.getLogger({ name: 'SOCKET_IO' });

export const SOCKET_IO_SERVICE_NAME = 'socket-io-service';

class SocketIOInstance extends RocketService {
  constructor(port: number) {
    super(SOCKET_IO_SERVICE_NAME);
    this.port = port;
    this.server = createServer();
    this.io = new SocketIOServer(this.server);
  }

  override onReceiveMessage(payload: string): void {
    logger.info(`Received payload: ${payload}`);
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

    this.server.on('connection', this.onConnection.bind(this));
    // this.server.on('clientError', );

    /* start listen socket-io on port */
    this.server.listen(this.port, () => {
      logger.info(`SocketIO server listening on port: {${this.port}}`);
    });
  }

  async stop() {
    // logger.info('Stopping SocketIO instance');
    /* stop listen socket-io on port */
    this.server.close((err?: Error) => {
      if (err) {
        logger.error(err.message);
      } else {
        logger.info('SocketIO server stopped');
      }
    });
  }

  port: number;
  server: Server;
  io: SocketIOServer;
}

export default new SocketIOInstance(8088);
