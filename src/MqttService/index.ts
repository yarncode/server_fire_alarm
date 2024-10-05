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
import { DataRocketDynamic } from '../Constant/interface';
import {
  CODE_EVENT_UPDATE_SENSOR,
  CODE_EVENT_ACTIVE_DEVICE,
  CODE_EVENT_UPDATE_STATE_DEVICE,
} from '../Constant';
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

class MqttInstance extends RocketService {
  constructor(port: number) {
    super(MQTT_SERVICE_NAME);
    this.cacheInfoDevice = {};
    this.port = port;
    this.aedes = new Aedes();
    this.server = server.createServer(this.aedes.handle);
  }

  private handleDeviceActive(clientId: string, payload: string) {
    const userId = this.cacheInfoDevice[clientId].userId;
    const deviceId = this.cacheInfoDevice[clientId].deviceId;
    const mac = this.cacheInfoDevice[clientId].mac;

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
    const userId = this.cacheInfoDevice[clientId].userId;
    const deviceId = this.cacheInfoDevice[clientId].deviceId;
    const mac = this.cacheInfoDevice[clientId].mac;

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

  private handleStateDevice(clientId: string, status: NodeStateType) {
    const data: DataRocketDynamic<DataMqtt> = {
      service: 'mqtt-service',
      action: 'SET',
      code: CODE_EVENT_UPDATE_STATE_DEVICE,
      payload: {
        mac: this.cacheInfoDevice[clientId].mac,
        userId: this.cacheInfoDevice[clientId].userId,
        deviceId: this.cacheInfoDevice[clientId].deviceId,
        topic: '/sensor',
        data: {
          status,
        } as DataStateDevice,
      },
    };

    /* set data into database */
    this.sendMessage('db-service', data);
  }

  override onReceiveMessage(payload: string): void {
    logger.info(`Received payload: ${payload}`);
  }

  onConnected(client: Client): void {
    logger.info('Client connected => ', client.id);

    this.handleStateDevice(client.id, 'ONLINE');
  }

  onDisconnected(client: Client): void {
    logger.info('Client disconnected => ', client.id);

    /* remove client when disconnect */
    // delete this.cacheInfoDevice[client.id];
    this.handleStateDevice(client.id, 'OFFLINE');
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

      if (packet.topic === '/sensor') {
        this.handleSensor(client.id, packet.payload.toString());
      } else if (packet.topic === '/active') {
        this.handleDeviceActive(client.id, packet.payload.toString());
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
      this.cacheInfoDevice[client.id] = {
        userId: device.by_user.toString(),
        deviceId: device._id.toString(),
        mac: device.mac,
      };
      done(null, true);
    }
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
  cacheInfoDevice: InfoClientMQTTCache;
}

export default new MqttInstance(
  parseInt(process.env.PORT_SOCKET_MQTT || '1883')
);
