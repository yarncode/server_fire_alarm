import { Request, Response } from 'express';
import { SensorMD } from '../../DatabaseService/models/sensor';
import mongoose from 'mongoose';

export interface AccountResponse {
  code: AccountCode;
  message: string;
}
export type AccountCode = '109000' | '109001' | '109002' | '109003';
export const ACCOUNT_MESSAGE: { [key in AccountCode]: string } = {
  '109000': 'None',
  '109001': 'Device id not found',
  '109002': 'Device not found',
  '109003': 'Unknown error',
};

class Sensor {
  constructor() {
    this.info = this.info.bind(this);
  }

  private genObjectQuerySensor(field: string, time: number): any {
    return {
      $let: {
        vars: {
          firstItem: {
            $arrayElemAt: [field, -1],
          },
        },
        in: {
          $filter: {
            input: field,
            as: 'item',
            cond: {
              $gt: [
                '$$item.update_at',
                {
                  $subtract: ['$$firstItem.update_at', time],
                },
              ],
            },
          },
        },
      },
    };
  }

  async info(req: Request, res: Response): Promise<any> {
    try {
      const { id_device } = req.params;
      const { time } = req.query;

      const millisecond = parseInt((time as string) ?? '3600') * 1000; // default 1 hour

      if (!id_device) {
        return res.status(400).json({
          code: '109001',
          message: ACCOUNT_MESSAGE['109001'],
        });
      }

      const sensor = await SensorMD.aggregate([
        {
          $match: {
            by_device: new mongoose.Types.ObjectId(id_device),
          },
        },
        {
          $project: {
            humidity: this.genObjectQuerySensor('$env.humidity', millisecond),
            temperature: this.genObjectQuerySensor(
              '$env.temperature',
              millisecond
            ),
            smoke: this.genObjectQuerySensor('$smoke', millisecond),
          },
        },
      ]);

      return res.status(200).json({
        code: '109000',
        message: ACCOUNT_MESSAGE['109000'],
        info: sensor[0] ? sensor[0] : [],
      });
    } catch (error) {
      console.log(error);

      return res.status(400).json({
        code: '109003',
        message: ACCOUNT_MESSAGE['109003'],
      });
    }
  }
}

export default new Sensor();
