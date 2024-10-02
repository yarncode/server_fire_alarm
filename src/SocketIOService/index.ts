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

  private handleDataMqtt(payload: DataMqtt): void {
    const userId = payload.userId;
    const deviceId = payload.deviceId;
    const mac = payload.mac;
    const whereEmit = payload.emitEvent;
    const action = payload.action;

    if (userId && mac && whereEmit && action == 'NOTIFY') {
      /* push message to user client */

      /* [PATH: '{userId}/device/active'] */
      if (whereEmit === 'active') {
        this.io.emit(`${userId}/device/active`, JSON.parse(payload.data));
      } else if (whereEmit === 'sensor') {
        /* [PATH: '{userId}/{deviceId}/sensor'] */
        this.io.emit(`${userId}/${deviceId}/sensor`, JSON.parse(payload.data));
      }
    }
  }

  override onReceiveMessage(payload: string): void {
    const pay: DataRocketDynamic = JSON.parse(payload);
    logger.info(`received message form ${pay.service}`);

    if (pay.service === 'mqtt-service') {
      this.handleDataMqtt(pay.payload as DataMqtt);
    }
  }

  onConnected(socket: Socket): void {
    logger.info(`Client connected => ${socket.id}`);
  }

  onDisconnected(socket: Socket, reason: string): void {
    logger.info('Client disconnected => ', socket.id, 'reason: ', reason);

    /* remove client when disconnect */
    delete this.cacheInfoUser[socket.id];
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

        DeviceMD.find({
          by_user: user._id,
          state: 'active',
        })
          .select('_id')
          .exec()
          .then((_devices) => {
            this.cacheInfoUser[socket.id] = {
              userId: user._id.toString(),
              devices: _devices.map((d) => d._id.toString()),
            };
          })
          .catch((err) => {
            logger.error(err);
          });
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
