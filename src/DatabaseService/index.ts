/* node_module import */
// import { Logger } from 'sitka';
import Logger from 'node-color-log';
import mongoose from 'mongoose';
import msgQueue from 'bull';

/* my import */
import { RocketService } from '../ManageService';
import { DataMqtt, NotifyIoPayload } from '../MqttService';
import { DataSocket } from '../SocketIOService';
import { DataRocketDynamic, ActionPayload } from '../Constant/interface';
import {
  CODE_EVENT_UPDATE_INPUT,
  CODE_EVENT_UPDATE_OUTPUT,
  CODE_EVENT_UPDATE_SENSOR,
  CODE_EVENT_UPDATE_STATE_DEVICE,
  CODE_EVENT_SYNC_GPIO,
} from '../Constant';
import {
  QueuePayloadRequest,
  QueuePayloadResponse,
  TDataMqtt,
} from '../Constant/interface';
import { updateSensor, ResponseDataSensor } from './controller/sensor';
import { updateStateDevice } from './controller/device';
import {
  updateGpio,
  createGpio,
  ResponseGpioState,
  ResponseInfoIo,
} from './controller/gpio';

import { DataSensor } from './models/sensor';
import { DataStateDevice } from './models/devices';
import { DataStateInfoIO, GpioState } from './models/gpio';

const logger = Logger.createNamedLogger('DATABASE');
logger.setDate(() => new Date().toLocaleString());

export interface DeviceInfo {
  userId: string;
  deviceId: string;
  mac: string;
}

export interface IoState extends DeviceInfo {
  data: GpioState;
}

export interface InfoIo extends DeviceInfo {
  data: DataStateInfoIO;
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

    this.queueDeviceMqtt = new msgQueue<QueuePayloadRequest<DataMqtt>>(
      'device-mqtt-msg'
    );
  }

  override onReceiveMessage(payload: string): void {
    const pay: DataRocketDynamic = JSON.parse(payload);
    logger.info(`received message form ${pay.service}`);

    if (pay.service === 'mqtt-service') {
      // this.handleDataMqtt(pay.payload as DataMqtt, pay.action, pay.code);
      // this.queueDeviceMqtt.add({
      //   action: pay.action,
      //   code: pay.code,
      //   payload: pay.payload,
      // });
      this.handleMqttPayload({
        action: pay.action,
        code: pay.code,
        payload: pay.payload,
      } as QueuePayloadRequest<DataMqtt>);
    }
  }

  private async handleMqttPayload(
    payload: QueuePayloadRequest<DataMqtt>
  ): Promise<void> {
    const _action: ActionPayload = payload.action;
    const _code: string = payload.code;
    let _data: TDataMqtt = payload.payload.data;

    /* validate payload */
    if (typeof _data === 'string') {
      _data = JSON.parse(_data);
    }

    if (payload.payload === null || payload.payload === undefined) {
      logger.error('Payload not found');
      return;
    }

    try {
      if (_action === 'SET') {
        /* check code data */
        if (_code === CODE_EVENT_UPDATE_SENSOR) {
          const res: ResponseDataSensor = await updateSensor({
            mac: payload.payload.mac,
            userId: payload.payload.userId,
            deviceId: payload.payload.deviceId,
            data: _data,
          } as InfoSensor);

          this.sendMessage('socket-io-service', {
            service: 'db-service',
            action: 'NOTIFY',
            code: CODE_EVENT_UPDATE_SENSOR,
            payload: {
              mac: payload.payload.mac,
              userId: payload.payload.userId,
              deviceId: payload.payload.deviceId,
              data: res,
            },
          });
          // done(null, { code, data: res } as QueuePayloadResponse); // done handle save data sensor
          // this.queueSensor.add(data);
        } else if (
          _code === CODE_EVENT_UPDATE_OUTPUT ||
          _code === CODE_EVENT_UPDATE_INPUT
        ) {
          const res: ResponseGpioState = await updateGpio({
            mac: payload.payload.mac,
            userId: payload.payload.userId,
            deviceId: payload.payload.deviceId,
            data: _data,
          } as IoState);

          this.sendMessage('socket-io-service', {
            service: 'db-service',
            action: 'NOTIFY',
            code: _code,
            payload: {
              mac: payload.payload.mac,
              userId: payload.payload.userId,
              deviceId: payload.payload.deviceId,
              data: res,
            },
          });
          // done(null, { code, data: res } as QueuePayloadResponse); // done handle save data sensor
          // this.queueStateIO.add(data);
        } else if (_code === CODE_EVENT_SYNC_GPIO) {
          const res: ResponseInfoIo = await createGpio({
            mac: payload.payload.mac,
            userId: payload.payload.userId,
            deviceId: payload.payload.deviceId,
            data: _data,
          } as InfoIo);

          this.sendMessage('socket-io-service', {
            service: 'db-service',
            action: 'NOTIFY',
            code: CODE_EVENT_SYNC_GPIO,
            payload: {
              mac: payload.payload.mac,
              userId: payload.payload.userId,
              deviceId: payload.payload.deviceId,
              data: res,
            },
          });
          // done(null, { code, data: res } as QueuePayloadResponse); // done handle save state device
          // this.queueSyncIo.add(data);
        } else if (_code === CODE_EVENT_UPDATE_STATE_DEVICE) {

          logger.info('update state device');

          // this.queueStateDevice.add(data);
          const res: DataStateDevice = await updateStateDevice({
            mac: payload.payload.mac,
            userId: payload.payload.userId,
            deviceId: payload.payload.deviceId,
            data: _data,
          } as InfoStateDevice);

          this.sendMessage('socket-io-service', {
            service: 'db-service',
            action: 'NOTIFY',
            code: _code,
            payload: {
              mac: payload.payload.mac,
              userId: payload.payload.userId,
              deviceId: payload.payload.deviceId,
              data: res,
            },
          });
        }
      }
    } catch (error) {
      logger.error((error as Error)?.message);
      return;
    }
  }

  private async onDataDeviceMqttRequest(
    job: msgQueue.Job<QueuePayloadRequest<DataMqtt>>,
    done: msgQueue.DoneCallback
  ): Promise<any> {
    const action: ActionPayload = job.data.action;
    const code: string = job.data.code;
    let payload: TDataMqtt = job.data.payload.data;

    /* validate payload */
    if (typeof payload === 'string') {
      payload = JSON.parse(payload);
    }

    if (job.data.payload === null || job.data.payload === undefined) {
      return done(new Error('Payload not found'), null);
    }

    try {
      if (action === 'SET') {
        /* check code data */
        if (code === CODE_EVENT_UPDATE_SENSOR) {
          const res: ResponseDataSensor = await updateSensor({
            mac: job.data.payload.mac,
            userId: job.data.payload.userId,
            deviceId: job.data.payload.deviceId,
            data: payload,
          } as InfoSensor);
          done(null, { code, data: res } as QueuePayloadResponse); // done handle save data sensor
          // this.queueSensor.add(data);
        } else if (
          code === CODE_EVENT_UPDATE_OUTPUT ||
          code === CODE_EVENT_UPDATE_INPUT
        ) {
          const res: ResponseGpioState = await updateGpio({
            mac: job.data.payload.mac,
            userId: job.data.payload.userId,
            deviceId: job.data.payload.deviceId,
            data: payload,
          } as IoState);
          done(null, { code, data: res } as QueuePayloadResponse); // done handle save data sensor
          // this.queueStateIO.add(data);
        } else if (code === CODE_EVENT_SYNC_GPIO) {
          const res: ResponseInfoIo = await createGpio({
            mac: job.data.payload.mac,
            userId: job.data.payload.userId,
            deviceId: job.data.payload.deviceId,
            data: payload,
          } as InfoIo);
          done(null, { code, data: res } as QueuePayloadResponse); // done handle save state device
          // this.queueSyncIo.add(data);
        } else if (code === CODE_EVENT_UPDATE_STATE_DEVICE) {
          // this.queueStateDevice.add(data);
          const res: DataStateDevice = await updateStateDevice(
            payload as InfoStateDevice
          );
          done(null, { code, data: res } as QueuePayloadResponse); // done handle save state device
        }
      }
    } catch (error) {
      done(error as Error, null);
    }

    done(null, null);
  }

  private onDataDeviceMqttResponse(
    job: msgQueue.Job<QueuePayloadRequest<DataMqtt>>,
    result: QueuePayloadResponse
  ): void {
    /* get code */
    const _code = result.code;

    if (_code === CODE_EVENT_UPDATE_SENSOR) {
      this.sendMessage('socket-io-service', {
        service: 'db-service',
        action: 'NOTIFY',
        code: CODE_EVENT_UPDATE_SENSOR,
        payload: {
          mac: job.data.payload.mac,
          userId: job.data.payload.userId,
          deviceId: job.data.payload.deviceId,
          data: result.data,
        },
      });
    } else if (
      _code === CODE_EVENT_UPDATE_OUTPUT ||
      _code === CODE_EVENT_UPDATE_INPUT
    ) {
      this.sendMessage('socket-io-service', {
        service: 'db-service',
        action: 'NOTIFY',
        code: _code,
        payload: {
          mac: job.data.payload.mac,
          userId: job.data.payload.userId,
          deviceId: job.data.payload.deviceId,
          data: result.data,
        },
      });
    } else if (_code === CODE_EVENT_SYNC_GPIO) {
      this.sendMessage('socket-io-service', {
        service: 'db-service',
        action: 'NOTIFY',
        code: CODE_EVENT_SYNC_GPIO,
        payload: {
          mac: job.data.payload.mac,
          userId: job.data.payload.userId,
          deviceId: job.data.payload.deviceId,
          data: result.data,
        },
      });
    } else if (_code === CODE_EVENT_UPDATE_STATE_DEVICE) {
      this.sendMessage('socket-io-service', {
        service: 'db-service',
        action: 'NOTIFY',
        code: _code,
        payload: {
          mac: job.data.payload.mac,
          userId: job.data.payload.userId,
          deviceId: job.data.payload.deviceId,
          data: result.data,
        },
      });
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

    this.queueDeviceMqtt.process(this.onDataDeviceMqttRequest.bind(this));
    this.queueDeviceMqtt.on(
      'completed',
      this.onDataDeviceMqttResponse.bind(this)
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
  queueDeviceMqtt: msgQueue.Queue<QueuePayloadRequest<DataMqtt>>;
}

export default new DatabaseInstance(
  parseInt(process.env.PORT_DATABASE || '27017')
);
