/* node_module import */
import { Logger } from 'sitka';
import { Server as SocketIOServer, Socket } from 'socket.io';

/* my import */
import { RocketService } from '../ManageService';
import { DataMqtt } from '../MqttService';
import { DataRocketDynamic } from '../Constant/interface';
import { UserMD } from '../DatabaseService/models/account';
import { DeviceMD } from '../DatabaseService/models/devices';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ACCOUNT_MESSAGE } from '../APIService/controller/account';

const logger = Logger.getLogger({ name: 'SOCKET_IO' });

export const SOCKET_IO_SERVICE_NAME = 'socket-io-service';

interface InfoClientSocketCache {
  [clientId: string]: {
    userId: string;
    devices: string[];
  };
}

interface PayloadDecodeRuntimeToken extends JwtPayload {
  email: string;
}

class SocketIOInstance extends RocketService {
  constructor(port: number) {
    super(SOCKET_IO_SERVICE_NAME);
    this.cacheInfoUser = {};
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
      const deviceId = childPayload.deviceId;
      const mac = childPayload.mac;
      const whereEmit = childPayload.emitEvent;
      const action = childPayload.action;

      if (userId && mac && whereEmit && action.includes('NOTIFY')) {
        /* push message to user client */
        this.io.emit(`${userId}/${deviceId}/${whereEmit}`, childPayload.data);
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

  async validateAuthentication(
    socket: Socket,
    next: (err?: Error) => void
  ): Promise<void> {
    const token = socket.handshake.auth['token'] as string;

    if (!token) {
      return next(
        new Error(
          JSON.stringify({ code: '108015', message: ACCOUNT_MESSAGE['108015'] })
        )
      );
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SIGNATURE_SECRET || 'secret'
      ) as PayloadDecodeRuntimeToken;

      if (decoded.email) {
        /* check user exist */
        const user = await UserMD.findOne({ email: decoded.email });

        if (user === null) {
          return next(
            new Error(
              JSON.stringify({
                code: '108001',
                message: ACCOUNT_MESSAGE['108001'],
              })
            )
          );
        }

        const devices = await DeviceMD.find({
          by_user: user._id,
          state: 'active',
        }).select('_id');

        this.cacheInfoUser[socket.id] = {
          userId: user._id.toString(),
          devices: devices.map((d) => d._id.toString()),
        };
      }

      return next();
    } catch (error) {
      return next(
        new Error(
          JSON.stringify({ code: '108010', message: ACCOUNT_MESSAGE['108010'] })
        )
      );
    }
  }

  async start() {
    // logger.info('Starting SocketIO instance');
    this.io.use(this.validateAuthentication.bind(this));
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
  cacheInfoUser: InfoClientSocketCache;
}

export default new SocketIOInstance(
  parseInt(process.env.PORT_SOCKET_IO || '3000')
);
