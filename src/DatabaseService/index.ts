/* node_module import */
import { Logger } from 'sitka';
import mongoose from 'mongoose';
import msgQueue from 'bull';

/* my import */
import { RocketService } from '../ManageService';
import { DataMqtt } from '../MqttService';
import { DataSocket } from '../SocketIOService';
import { DataRocketDynamic, ActionPayload } from '../Constant/interface';
import {
  CODE_EVENT_UPDATE_SENSOR,
  CODE_EVENT_UPDATE_STATE_DEVICE,
} from '../Constant';
import { updateSensor, ResponseDataSensor } from './controller/sensor';
import { updateStateDevice } from './controller/device';
import { DataSensor } from './models/sensor';
import { DataStateDevice } from './models/devices';

const logger = Logger.getLogger({ name: 'DATABASE' });

export interface DeviceInfo {
  userId: string;
  deviceId: string;
  mac: string;
}

export interface InfoSensor extends DeviceInfo {
  data: DataSensor;
}

export interface InfoStateDevice extends DeviceInfo {
  data: DataStateDevice;
}

export const DATABASE_SERVICE_NAME = 'db-service';

class DatabaseInstance extends RocketService {
  constructor(port: number) {
    super(DATABASE_SERVICE_NAME);
    this.port = port;
    this.queueSensor = new msgQueue('sensor');
    this.queueStateDevice = new msgQueue('state-device');
  }

  private handleDataMqtt(
    payload: DataMqtt,
    action: ActionPayload,
    code: string
  ): void {
    const userId = payload.userId;
    const deviceId = payload.deviceId;
    const mac = payload.mac;

    if (
      code === CODE_EVENT_UPDATE_SENSOR &&
      action == 'SET' &&
      typeof payload.data === 'string'
    ) {
      /* push message to user client */

      /* [PATH: '{userId}/{deviceId}/sensor'] */
      const sensorPayload: DataSensor = JSON.parse(payload.data);
      const data: InfoSensor = {
        userId,
        deviceId,
        mac,
        data: sensorPayload,
      };
      this.queueSensor.add(data);
    } else if (code === CODE_EVENT_UPDATE_STATE_DEVICE && action == 'SET') {
      const statePayload: DataStateDevice = payload.data;
      const data: InfoStateDevice = {
        userId,
        deviceId,
        mac,
        data: statePayload,
      };
      this.queueStateDevice.add(data);
    }
  }

  private async handleUpdateSensor(
    job: msgQueue.Job<InfoSensor>,
    done: msgQueue.DoneCallback
  ): Promise<void> {
    try {
      const res: ResponseDataSensor = await updateSensor(job.data);
      done(null, res); // done handle save data sensor
    } catch (error) {
      done(error as Error, null);
    }
    /* handler job */
  }

  private async handleUpdateStateDevice(
    job: msgQueue.Job<InfoStateDevice>,
    done: msgQueue.DoneCallback
  ): Promise<void> {
    /* handler job */
    try {
      const res: DataStateDevice = await updateStateDevice(job.data);
      done(null, res); // done handle save state device
    } catch (error) {
      done(error as Error, null);
    }
  }

  private onHandleUpdateStateDeviceCompleted(
    job: msgQueue.Job<InfoStateDevice>,
    result: DataStateDevice
  ): void {
    const data: DataRocketDynamic<DataSocket> = {
      service: 'db-service',
      action: 'NOTIFY',
      code: CODE_EVENT_UPDATE_STATE_DEVICE,
      payload: {
        mac: job.data.mac,
        userId: job.data.userId,
        deviceId: job.data.deviceId,
        data: result,
      },
    };

    this.sendMessage('socket-io-service', data);
  }

  private onHandleUpdateSensorCompleted(
    job: msgQueue.Job<InfoSensor>,
    result: ResponseDataSensor
  ): void {
    const data: DataRocketDynamic<DataSocket> = {
      service: 'db-service',
      action: 'NOTIFY',
      code: CODE_EVENT_UPDATE_SENSOR,
      payload: {
        mac: job.data.mac,
        userId: job.data.userId,
        deviceId: job.data.deviceId,
        data: result,
      },
    };

    this.sendMessage('socket-io-service', data);
  }

  override onReceiveMessage(payload: string): void {
    const pay: DataRocketDynamic = JSON.parse(payload);
    logger.info(`received message form ${pay.service}`);

    if (pay.service === 'mqtt-service') {
      this.handleDataMqtt(pay.payload as DataMqtt, pay.action, pay.code);
    }
  }

  onMongoConnected(): void {
    logger.info(`MongoDB connected on port: {${this.port}}`);
  }

  onMongoFailure(): void {
    logger.info('MongoDB failed :(');
  }

  start(): void {
    // logger.info('Starting API instance');
    this.queueSensor.process(this.handleUpdateSensor.bind(this));
    this.queueSensor.on(
      'completed',
      this.onHandleUpdateSensorCompleted.bind(this)
    );
    this.queueStateDevice.process(this.handleUpdateStateDevice.bind(this));
    this.queueStateDevice.on(
      'completed',
      this.onHandleUpdateStateDeviceCompleted.bind(this)
    );

    mongoose
      .connect(`mongodb://localhost:${this.port}/fire-alarm`)
      .then(this.onMongoConnected.bind(this))
      .catch(this.onMongoFailure.bind(this));
  }

  stop(): void {
    // logger.info('Stopping API instance');
    mongoose.disconnect();
  }

  port: number;
  queueSensor: msgQueue.Queue<InfoSensor>;
  queueStateDevice: msgQueue.Queue<InfoStateDevice>;
}

export default new DatabaseInstance(
  parseInt(process.env.PORT_DATABASE || '27017')
);
