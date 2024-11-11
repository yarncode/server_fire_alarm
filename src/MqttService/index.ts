/* node_module import */
import { Logger } from 'sitka';
import server, { Server } from 'net';
import Aedes, {
  Client,
  AedesPublishPacket,
  PingreqPacket,
  AuthenticateError,
  AuthErrorCode,
} from 'aedes';

/* my import */
import { DataRocketDynamic, ActionPayload } from '../Constant/interface';
import {
  CODE_EVENT_UPDATE_SENSOR,
  CODE_EVENT_ACTIVE_DEVICE,
  CODE_EVENT_UPDATE_STATE_DEVICE,
  CODE_EVENT_UPDATE_OUTPUT,
  CODE_EVENT_UPDATE_INPUT,
  CODE_EVENT_SYNC_THRESHOLD,
  CODE_EVENT_UNKNOWN,
} from '../Constant';
import { DataApi } from '../APIService';
import { DataSocket } from '../SocketIOService';
import { RocketService } from '../ManageService';
import {
  DeviceMD,
  NodeStateType,
  DataStateDevice,
} from '../DatabaseService/models/devices';

const logger = Logger.getLogger({ name: 'MQTT' });

export interface DataMqtt {
  topic: string;
  mac: string;
  userId: string;
  deviceId: string;
  data: any;
}

export const MQTT_SERVICE_NAME = 'mqtt-service';

interface InfoClientMQTTCache {
  [clientId: string]: {
    userId: string;
    deviceId: string;
    mac: string;
  };
}

interface LinkDeviceCache {
  [deviceId: string]: {
    ctx: Client;
  };
}

export interface NotifyPayload {
  timestamp?: number;
  _type?: string;
}

export interface NotifyIoPayload extends NotifyPayload {
  input?: boolean[];
  output?: boolean[];
}

class MqttInstance extends RocketService {
  constructor(port: number) {
    super(MQTT_SERVICE_NAME);
    this.cacheInfoClient = {};
    this.cacheLinkDevice = {};
    this.port = port;
    this.aedes = new Aedes();
    this.server = server.createServer(this.aedes.handle);
  }

  private handleDeviceActive(clientId: string, payload: string) {
    const userId = this.cacheInfoClient[clientId].userId;
    const deviceId = this.cacheInfoClient[clientId].deviceId;
    const mac = this.cacheInfoClient[clientId].mac;

    if (userId && deviceId && mac) {
      /* push message to user client */
      // logger.info(`Pushing to user: ${userId} - payload: ${payload}`);

      const data: DataRocketDynamic<DataMqtt> = {
        service: 'mqtt-service',
        action: 'NOTIFY',
        code: CODE_EVENT_ACTIVE_DEVICE,
        payload: {
          mac,
          userId,
          deviceId,
          topic: '/active',
          data: payload,
        },
      };

      this.sendMessage('socket-io-service', data);
    }
  }

  private handleSensor(clientId: string, payload: string): void {
    const userId = this.cacheInfoClient[clientId].userId;
    const deviceId = this.cacheInfoClient[clientId].deviceId;
    const mac = this.cacheInfoClient[clientId].mac;

    if (userId && deviceId && mac) {
      /* push message to user client */
      // logger.info(`Pushing to user: ${userId} - payload: ${payload}`);

      const data: DataRocketDynamic<DataMqtt> = {
        service: 'mqtt-service',
        action: 'SET',
        code: CODE_EVENT_UPDATE_SENSOR,
        payload: {
          mac,
          userId,
          deviceId,
          topic: '/sensor',
          data: payload,
        },
      };

      /* set data into database */
      this.sendMessage('db-service', data);
    }
  }

  private handleNotify(clientId: string, payload: string): void {
    try {
      const userId = this.cacheInfoClient[clientId].userId;
      const deviceId = this.cacheInfoClient[clientId].deviceId;
      const mac = this.cacheInfoClient[clientId].mac;

      const _payload: NotifyPayload = JSON.parse(payload);

      if (userId && deviceId && mac) {
        const data: DataRocketDynamic<DataMqtt> = {
          service: 'mqtt-service',
          action: 'SET',
          code: _payload._type?.toUpperCase() ?? CODE_EVENT_UNKNOWN,
          payload: {
            mac,
            userId,
            deviceId,
            topic: '/notify',
            data: payload,
          },
        };

        /* set data into database */
        this.sendMessage('db-service', data);
      }
    } catch (error) {
      logger.error(error);
    }
  }

  private handleIoOutput(clientId: string, payload: string): void {
    const userId = this.cacheInfoClient[clientId].userId;
    const deviceId = this.cacheInfoClient[clientId].deviceId;
    const mac = this.cacheInfoClient[clientId].mac;

    if (userId && deviceId && mac) {
      /* push message to user client */
      // logger.info(`Pushing to user: ${userId} - payload: ${payload}`);

      const data: DataRocketDynamic<DataMqtt> = {
        service: 'mqtt-service',
        action: 'SET',
        code: CODE_EVENT_UPDATE_OUTPUT,
        payload: {
          mac,
          userId,
          deviceId,
          topic: '/output',
          data: payload,
        },
      };

      /* set data into database */
      this.sendMessage('db-service', data);
    }
  }

  private handleIoInput(clientId: string, payload: string): void {
    const userId = this.cacheInfoClient[clientId].userId;
    const deviceId = this.cacheInfoClient[clientId].deviceId;
    const mac = this.cacheInfoClient[clientId].mac;

    if (userId && deviceId && mac) {
      /* push message to user client */
      // logger.info(`Pushing to user: ${userId} - payload: ${payload}`);

      const data: DataRocketDynamic<DataMqtt> = {
        service: 'mqtt-service',
        action: 'SET',
        code: CODE_EVENT_UPDATE_INPUT,
        payload: {
          mac,
          userId,
          deviceId,
          topic: '/input',
          data: payload,
        },
      };

      /* set data into database */
      this.sendMessage('db-service', data);
    }
  }

  private handleStateDevice(clientId: string, status: NodeStateType) {
    const data: DataRocketDynamic<DataMqtt> = {
      service: 'mqtt-service',
      action: 'SET',
      code: CODE_EVENT_UPDATE_STATE_DEVICE,
      payload: {
        mac: this.cacheInfoClient[clientId].mac,
        userId: this.cacheInfoClient[clientId].userId,
        deviceId: this.cacheInfoClient[clientId].deviceId,
        topic: '/sensor',
        data: {
          status,
        } as DataStateDevice,
      },
    };

    /* set data into database */
    this.sendMessage('db-service', data);
  }

  private handleDataSocketIo(
    payload: DataSocket,
    action: ActionPayload,
    code: string
  ): void {
    // const userId = payload.userId;
    const deviceId = payload.deviceId;
    // const mac = payload.mac;

    if (action === 'CONTROL') {
      if (code === CODE_EVENT_UPDATE_OUTPUT) {
        this.sendPayload(deviceId, '/control', JSON.stringify(payload.data));
      }
    }
  }

  private handleDataApi(
    payload: DataApi,
    action: ActionPayload,
    code: string
  ): void {
    // const userId = payload.userId;
    const deviceId = payload.deviceId;
    // const mac = payload.mac;

    if (action === 'CONFIG') {
      if (code === CODE_EVENT_SYNC_THRESHOLD) {
        this.sendPayload(deviceId, '/config', JSON.stringify(payload.data));
      }
    }
  }

  override onReceiveMessage(payload: string): void {
    // logger.info(`Received payload: ${payload}`);

    const pay: DataRocketDynamic = JSON.parse(payload);

    if (pay.service === 'socket-io-service') {
      this.handleDataSocketIo(pay.payload as DataSocket, pay.action, pay.code);
    } else if (pay.service === 'api-service') {
      this.handleDataApi(pay.payload as DataApi, pay.action, pay.code);
    }
  }

  onConnected(client: Client): void {
    logger.info('Client connected => ', client.id);

    this.handleStateDevice(client.id, 'ONLINE');
  }

  onDisconnected(client: Client): void {
    logger.info('Client disconnected => ', client.id);

    /* remove client when disconnect */
    this.handleStateDevice(client.id, 'OFFLINE');
    // this.removeCacheByClientId(client.id);
  }

  onPing(packet: PingreqPacket, client: Client): void {
    logger.info(`Client id: ${client.id} - Ping`);
  }

  onPublished(packet: AedesPublishPacket, client: Client | null): void {
    if (client) {
      logger.info(
        `Client id: ${client?.id} - Published topic: ${packet.topic} length: ${packet.payload.length}`
      );

      if (!client?.id) {
        logger.error('Client id is not found');
        return;
      }

      if (packet.payload.length < 0) {
        logger.error('Payload is empty');
        return;
      }

      if (packet.topic === '/sensor') {
        this.handleSensor(client.id, packet.payload.toString());
      } else if (packet.topic === '/output-io') {
        this.handleIoOutput(client.id, packet.payload.toString());
      } else if (packet.topic === '/input-io') {
        this.handleIoInput(client.id, packet.payload.toString());
      } else if (packet.topic === '/active') {
        this.handleDeviceActive(client.id, packet.payload.toString());
      } else if (packet.topic === '/notify') {
        this.handleNotify(client.id, packet.payload.toString());
      }
    }
  }

  async onAuthentication(
    client: Client,
    username: Readonly<string | undefined>,
    password: Readonly<Buffer | undefined>,
    done: (error: AuthenticateError | null, success: boolean | null) => void
  ): Promise<void> {
    const decodePassword = password?.toString() ?? '';

    /* logger.info(
      'Client authenticated => ',
      client.id,
      ' - username: ',
      username,
      ' - password: ',
      decodePassword
      ); */

    /* get device in database */
    const device = await DeviceMD.findOne({
      auth: { username: username, password: decodePassword },
    });

    logger.info(
      'Client authenticated => ',
      client.id,
      ' - deviceId: ',
      device?._id.toString(),
    );

    if (device == null) {
      done(
        {
          returnCode: AuthErrorCode.BAD_USERNAME_OR_PASSWORD,
          name: 'Authentication',
          message: 'Bad username or password',
        },
        false
      );
    } else {
      // this.cacheInfoClient[client.id] = {
      //   userId: device.by_user.toString(),
      //   deviceId: device._id.toString(),
      //   mac: device.mac,
      // };
      this.setClientCache(
        client,
        device._id.toString(),
        device.by_user.toString(),
        device.mac
      );
      done(null, true);
    }
  }

  sendPayload(id: string, topic: string, msg: string) {
    console.log(
      'Send to device: ',
      id,
      'clienId: ',
      this.getClientByDeviceId(id)?.id
    );

    const _ctx: Client | undefined = this.getClientByDeviceId(id);
    if (_ctx) {
      console.log(
        'Publish to device: ',
        id,
        ' - topic: ',
        topic,
        ' - msg: ',
        msg
      );

      _ctx.publish(
        {
          cmd: 'publish',
          topic,
          payload: msg,
          dup: false,
          retain: false,
          qos: 1,
        },
        (err) => {
          if (err) {
            logger.error('Publish error: ', err);
          }
        }
      );
    }
  }

  setClientCache(
    client: Client,
    deviceId: string,
    userId: string,
    mac: string
  ) {
    this.cacheInfoClient[client.id] = {
      userId,
      deviceId,
      mac,
    };
    this.cacheLinkDevice[deviceId] = {
      ctx: client,
    };
  }

  getClientByDeviceId(deviceId: string): Client | undefined {
    return deviceId in this.cacheLinkDevice
      ? this.cacheLinkDevice[deviceId].ctx
      : undefined;
  }

  getClientByClientId(clientId: string): Client | undefined {
    return this.cacheInfoClient[clientId].deviceId
      ? this.cacheLinkDevice[this.cacheInfoClient[clientId].deviceId].ctx
      : undefined;
  }

  removeCacheByDeviceId(deviceId: string) {
    const _clientId = this.cacheLinkDevice[deviceId].ctx.id;
    const _deviceId = deviceId;

    delete this.cacheInfoClient[_clientId];
    if (this.cacheLinkDevice[_deviceId].ctx.closed) {
      delete this.cacheLinkDevice[_deviceId];
    }
  }

  removeCacheByClientId(clientId: string) {
    const _deviceId = this.cacheInfoClient[clientId].deviceId;
    const _clientId = clientId;

    delete this.cacheInfoClient[_clientId];
    delete this.cacheLinkDevice[_deviceId];
  }

  async start() {
    // logger.info('Starting MQTT instance');
    this.aedes.authenticate = this.onAuthentication.bind(this);
    this.aedes.on('client', this.onConnected.bind(this));
    this.aedes.on('clientDisconnect', this.onDisconnected.bind(this));
    this.aedes.on('publish', this.onPublished.bind(this));
    this.aedes.on('ping', this.onPing.bind(this));

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
  cacheInfoClient: InfoClientMQTTCache;
  cacheLinkDevice: LinkDeviceCache;
}

export default new MqttInstance(
  parseInt(process.env.PORT_SOCKET_MQTT || '1883')
);
