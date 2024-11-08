/* node_module import */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/* my import */
import { DEVICE_MESSAGE, DeviceResponse } from '../controller/device';
import { UserMD } from '../../DatabaseService/models/account';
import { DeviceMD } from '../../DatabaseService/models/devices';

export const main_auth = {
  validate_token: (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['_token']?.toString();
    if (!token) {
      return res.status(400).json({
        code: '107005',
        message: DEVICE_MESSAGE['107005'],
      } as DeviceResponse);
    }

    /* verify token */
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SIGNATURE_SECRET || 'secret'
      );
      // console.log(decoded);
      req.body['mac'] = (decoded as jwt.JwtPayload)['mac']; // set mac
      next();
      return;
    } catch (error) {
      /* token invalid */
      return res.status(400).json({
        code: '107004',
        message: DEVICE_MESSAGE['107004'],
      } as DeviceResponse);
    }
  },
  validate_owner: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const { id } = req.query;

      const user = await UserMD.findOne({ email });

      if (user === null) {
        return res.status(400).json({
          code: '107006',
          message: DEVICE_MESSAGE['107006'],
        } as DeviceResponse);
      }

      const device = await DeviceMD.findOne({ _id: id });

      if (device === null) {
        return res.status(400).json({
          code: '107014',
          message: DEVICE_MESSAGE['107014'],
        } as DeviceResponse);
      }

      req.body['_user_id'] = user._id;
      req.body['_mac'] = device.mac;
      req.body['_device_id'] = device._id;

      next();
      return;
    } catch (error) {
      return res.status(400).json({
        code: '107003',
        message: DEVICE_MESSAGE['107003'],
      } as DeviceResponse);
    }
  },
};
