/* node_module import */
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

/* my import */
import { UserMD } from '../../DatabaseService/models/account';
import {
  DeviceMD,
  NodeType,
  NodeTypeList,
} from '../../DatabaseService/models/devices';

interface CreateDevicePayload {
  email: string;
  mac: string;
  type_node: NodeType;
}

interface UpdateDevicePayload {
  email: string;
  name: string;
  desc: string;
}

export interface DeviceResponse {
  code: DeviceCode;
  message: string;
}
export type DeviceCode =
  | '107000'
  | '107001'
  | '107002'
  | '107003'
  | '107004'
  | '107005'
  | '107006'
  | '107007'
  | '107008'
  | '107009'
  | '107010'
  | '107011'
  | '107012'
  | '107013';
export const DEVICE_MESSAGE: { [key in DeviceCode]: string } = {
  '107000': 'None',
  '107001': 'Device not found',
  '107002': 'Device already exists',
  '107003': 'Unknown error',
  '107004': 'Token is not valid',
  '107005': 'Token is not found',
  '107006': 'User is not found',
  '107007': 'MAC is not found',
  '107008': 'Node type is not found',
  '107009': 'Node type is not valid',
  '107010': 'Device created successfully',
  '107011': 'Device get successfully',
  '107012': 'Device update successfully',
  '107013': 'Device remove successfully',
};

class Device {
  constructor() {
    this.create_device = this.create_device.bind(this); // oke now method can access {this}
  }

  private generateToken(payload: any): string {
    return jwt.sign(payload, process.env.JWT_SIGNATURE_SECRET || 'secret');
  }

  /* {for user}: [GET] /device/info/list */
  async device_list(req: Request, res: Response): Promise<any> {
    try {
      const { email } = req.body;

      /* get user from email */
      const user = await UserMD.findOne({ email });

      if (user === null) {
        return res
          .status(400)
          .json({ code: '107006', message: DEVICE_MESSAGE['107006'] });
      }

      const devices = await DeviceMD.find({ by_user: user.id }).select([
        '-_id',
        '-__v',
        '-by_user',
      ]);

      if (devices === null) {
        return res
          .status(400)
          .json({ code: '107001', message: DEVICE_MESSAGE['107001'] });
      }

      return res.status(200).json({
        code: '107002',
        message: DEVICE_MESSAGE['107002'],
        info: devices,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ code: '107011', message: DEVICE_MESSAGE['107011'] });
    }
  }

  /* {for user}: [GET] /device/info */
  async device_info(req: Request, res: Response): Promise<any> {
    try {
      const { mac } = req.params;

      /* get device if found */
      const device = await DeviceMD.findOne({ mac }).select([
        '-_id',
        '-__v',
        '-by_user',
      ]);

      if (device === null) {
        return res
          .status(400)
          .json({ code: '107001', message: DEVICE_MESSAGE['107001'] });
      }

      return res.status(200).json({
        code: '107002',
        message: DEVICE_MESSAGE['107002'],
        info: device.toObject(),
      });
    } catch (error) {
      return res
        .status(500)
        .json({ code: '107011', message: DEVICE_MESSAGE['107011'] });
    }
  }

  /* {for device}: [GET] /device/new */
  async create_device(req: Request, res: Response): Promise<any> {
    try {
      const { email, mac, type_node }: CreateDevicePayload = req.body;

      if (!mac) {
        return res
          .status(400)
          .json({ code: '107007', message: DEVICE_MESSAGE['107007'] });
      }

      if (!type_node) {
        return res
          .status(400)
          .json({ code: '107008', message: DEVICE_MESSAGE['107008'] });
      }

      if (NodeTypeList.includes(type_node) === false) {
        return res
          .status(400)
          .json({ code: '107009', message: DEVICE_MESSAGE['107009'] });
      }

      /* get info account */
      const user = await UserMD.findOne({ email });

      if (user === null) {
        return res
          .status(400)
          .json({ code: '107006', message: DEVICE_MESSAGE['107006'] });
      }

      /* get device if found */
      const device = await DeviceMD.findOne({ mac });

      if (device !== null) {
        /* device already exists => goto update */
        await device.updateOne({ type: type_node, by_user: user._id }).exec();

        return res
          .status(200)
          .json({ code: '107012', message: DEVICE_MESSAGE['107012'] });
      } else {
        /* device not found => goto create new */

        /* create auth username & password */
        const username = uuid();
        const password = uuid();

        /* create new device */
        const device = new DeviceMD({
          mac,
          by_user: user._id,
          desc: 'Unknown',
          layer: 0,
          name: 'Unknown',
          state: 'active',
          type: type_node,
          ram_size: 0,
          status: 'OFFLINE',
          token: this.generateToken({ mac }),
          auth: {
            username,
            password,
          },
        });

        await device.save();
        return res.status(200).json({
          code: '107010',
          message: DEVICE_MESSAGE['107010'],
          auth: {
            username: device.auth?.username ?? 'Unknown',
            password: device.auth?.password ?? 'Unknown',
            token: device.token,
          },
        });
      }
    } catch (error) {
      console.log(error);

      return res
        .status(500)
        .json({ code: '107003', message: DEVICE_MESSAGE['107003'] });
    }
  }

  /* {for user}: [POST] /device/info/update */
  async update_device(req: Request, res: Response): Promise<any> {
    try {
      const { mac } = req.params;
      const { name, desc }: UpdateDevicePayload = req.body;

      /* get device if found */
      const device = await DeviceMD.findOne({ mac });

      if (device === null) {
        return res
          .status(400)
          .json({ code: '107001', message: DEVICE_MESSAGE['107001'] });
      }

      /* update device */
      await device.updateOne({ name, desc }).exec();

      return res
        .status(200)
        .json({ code: '107012', message: DEVICE_MESSAGE['107012'] });
    } catch (error) {
      return res
        .status(500)
        .json({ code: '107003', message: DEVICE_MESSAGE['107003'] });
    }
  }

  /* {for user}: [POST] /device/remove */
  async remove_device(req: Request, res: Response): Promise<any> {
    try {
      const { mac } = req.params;

      /* get device if found */
      const device = await DeviceMD.findOne({ mac });

      if (device === null) {
        return res
          .status(400)
          .json({ code: '107001', message: DEVICE_MESSAGE['107001'] });
      }

      /* update state device */
      await device.updateOne({ state: 'removed' }).exec();

      return res
        .status(200)
        .json({ code: '107012', message: DEVICE_MESSAGE['107012'] });
    } catch (error) {
      return res
        .status(500)
        .json({ code: '107003', message: DEVICE_MESSAGE['107003'] });
    }
  }
}

export default new Device();
