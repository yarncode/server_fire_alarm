/* node_module import */
import { Logger } from 'sitka';
import { Server as SocketIOServer, Socket } from 'socket.io';

/* my import */
import { RocketService } from '../ManageService';
import { DataMqtt } from '../MqttService';
import { DataRocketDynamic, ActionPayload } from '../Constant/interface';
import {
  CODE_EVENT_ACTIVE_DEVICE,
  CODE_EVENT_UPDATE_SENSOR,
  CODE_EVENT_UPDATE_STATE_DEVICE,
  CODE_EVENT_UPDATE_OUTPUT,
  CODE_EVENT_UPDATE_INPUT,
  CODE_EVENT_SYNC_GPIO,
} from '../Constant';
import { UserMD } from '../DatabaseService/models/account';
import { DeviceMD } from '../DatabaseService/models/devices';
import { GpioState } from '../DatabaseService/models/gpio';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ACCOUNT_MESSAGE } from '../APIService/controller/account';

const logger = Logger.getLogger({ name: 'SOCKET_IO' });

export const SOCKET_IO_SERVICE_NAME = 'socket-io-service';

export interface DataSocket {
  mac: string;
  userId: string;
  deviceId: string;
  data: any;
}

interface InfoClientSocketCache {
  [clientId: string]: {
    userId: string;
    devices: {
      id: string;
      mac: string;
    }[];
  };
}

interface InfoDeviceLinkClient {
  [deviceId: string]: string[];
}

interface PayloadDecodeRuntimeToken extends JwtPayload {
  email: string;
}

interface BasePayload<T> {
  mac: string;
  userId: string;
  deviceId: string;
  data: T;
}

class SocketIOInstance extends RocketService {
  constructor(port: number) {
    super(SOCKET_IO_SERVICE_NAME);
    this.cacheClientLinkDevice = {};
    this.cacheDeviceLinkClient = {};
    this.port = port;
    // this.server = createServer();
    this.io = new SocketIOServer({ cors: { origin: '*' } });
  }

  private handleDataMqtt(
    payload: DataMqtt,
    action: ActionPayload,
    code: string
  ): void {
    const userId = payload.userId;

    if (action == 'NOTIFY') {
      if (code === CODE_EVENT_ACTIVE_DEVICE) {
        /* [PATH: '{userId}/device/active'] */
        if (payload.topic === '/active') {
          this.io.emit(`${userId}/device/active`, JSON.parse(payload.data));
        }
      }
    }
  }

  private handleFromDatabase(
    payload: DataSocket,
    action: ActionPayload,
    code: string
  ): void {
    const userId = payload.userId;
    const deviceId = payload.deviceId;

    if (action == 'NOTIFY') {
      if (code === CODE_EVENT_UPDATE_SENSOR) {
        /* [PATH: '{userId}/{deviceId}/sensor'] */
        this.io.emit(`${userId}/${deviceId}/sensor`, payload.data);
      } else if (code === CODE_EVENT_UPDATE_STATE_DEVICE) {
        /* [PATH: '{userId}/{deviceId}/status'] */
        this.io.emit(`${userId}/${deviceId}/status`, payload.data);
      } else if (code === CODE_EVENT_UPDATE_OUTPUT) {
        this.deviceBoardcastMsg(deviceId, 'device/output-io', payload.data);
        // this.io.emit(`${userId}/device/output-io`, payload.data);
      } else if (code === CODE_EVENT_UPDATE_INPUT) {
        this.io.emit(`${userId}/device/input-io`, payload.data);
      } else if (code === CODE_EVENT_SYNC_GPIO) {
        this.io.emit(`${userId}/device/sync-io`, payload.data);
      }
    }
  }

  private deviceBoardcastMsg(
    deviceId: string,
    eventName: string,
    msg: string
  ): void {
    this.cacheDeviceLinkClient[deviceId].forEach((sockId) => {
      const _sock = this.io.sockets.sockets.get(sockId);
      if (_sock) {
        _sock.emit(eventName, msg);
      }
    });
  }

  override onReceiveMessage(payload: string): void {
    const pay: DataRocketDynamic = JSON.parse(payload);
    logger.info(`received message form ${pay.service} => ${payload.length}`);

    if (pay.service === 'mqtt-service') {
      this.handleDataMqtt(pay.payload as DataMqtt, pay.action, pay.code);
    } else if (pay.service === 'db-service') {
      this.handleFromDatabase(pay.payload as DataSocket, pay.action, pay.code);
    }
  }

  onConnected(socket: Socket): void {
    logger.info(`Client connected => ${socket.id}`);
  }

  onDisconnected(socket: Socket, reason: string): void {
    logger.info('Client disconnected => ', socket.id, 'reason: ', reason);

    /* remove client when disconnect */
    this.removeCacheBySocketId(socket.id);
    // delete this.cacheClientLinkDevice[socket.id];
  }

  onControl(socket: Socket, data: BasePayload<GpioState>): void {
    logger.info('Client control => ', socket.id);

    const _data: DataRocketDynamic<DataSocket> = {
      service: 'socket-io-service',
      action: 'CONTROL',
      code: CODE_EVENT_UPDATE_OUTPUT,
      payload: {
        mac: data.mac,
        userId: data.userId,
        deviceId: data.deviceId,
        data: data.data,
      },
    };

    this.sendMessage('mqtt-service', _data);
  }

  removeCacheBySocketId(socketId: string): void {
    /* get list device Id in cache */
    const deviceIds: string[] = this.cacheClientLinkDevice[
      socketId
    ].devices.map((_) => _.id);

    for (const deviceId of deviceIds) {
      this.cacheDeviceLinkClient[deviceId] = this.cacheDeviceLinkClient[
        deviceId
      ].filter((_) => _ !== socketId);
    }
    delete this.cacheClientLinkDevice[socketId];
  }

  validateBasePayload(payload: BasePayload<GpioState>): boolean {
    return payload?.mac && payload?.userId && payload?.deviceId ? true : false;
  }

  onConnection(socket: Socket): void {
    this.onConnected(socket);
    socket.on('control_io', (_: BasePayload<GpioState>) => {
      if (this.validateBasePayload(_)) {
        this.onControl(socket, _);
      }
    });
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

        const _devices = await DeviceMD.find({
          by_user: user._id,
          state: 'active',
        })
          .select('_id')
          .exec();

        logger.info(
          'Client authenticated => ',
          socket.id,
          ' - userId: ',
          user._id.toString(),
          ' - devices: ',
          _devices.length
        );

        this.cacheClientLinkDevice[socket.id] = {
          userId: user._id.toString(),
          devices: _devices.map((d) => {
            if (
              typeof this.cacheDeviceLinkClient[d._id.toString()] ===
              'undefined'
            ) {
              this.cacheDeviceLinkClient[d._id.toString()] = [socket.id];
            } else {
              this.cacheDeviceLinkClient[d._id.toString()].push(socket.id);
            }
            return {
              id: d._id.toString(),
              mac: d.mac,
            };
          }),
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
  cacheClientLinkDevice: InfoClientSocketCache;
  cacheDeviceLinkClient: InfoDeviceLinkClient;
}

export default new SocketIOInstance(
  parseInt(process.env.PORT_SOCKET_IO || '3000')
);
