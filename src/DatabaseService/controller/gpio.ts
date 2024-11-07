import { InfoIo, IoState } from '..';
import { GpioState, IoMD } from '../models/gpio';

export interface ResponseInfoIo {
  input: number;
  output: number;
}

export interface ResponseGpioState {
  value: boolean;
  pos: number;
}

export const createGpio = async (info: InfoIo): Promise<ResponseInfoIo> => {
  try {
    const { deviceId, data } = info;
    const { input, output } = data;

    const ioExist = await IoMD.findOne({ by_device: deviceId });

    /* update io */
    if (ioExist) {
      await IoMD.updateOne(
        { by_device: deviceId },
        {
          $set: {
            input: Array.from({ length: input }, (_, i) => ({
              value: false,
              update_at: new Date(),
            })),
            output: Array.from({ length: output }, (_, i) => ({
              value: false,
              update_at: new Date(),
            })),
          },
        }
      ).exec();

      return {
        input,
        output,
      };
    } else {
      const newIo = new IoMD({
        by_device: deviceId,
        input: Array.from({ length: input }, (_, i) => ({
          value: false,
          update_at: new Date(),
        })),
        output: Array.from({ length: output }, (_, i) => ({
          value: false,
          update_at: new Date(),
        })),
      });
      await newIo.save();
      return {
        input,
        output,
      };
    }
  } catch (error) {
    return {
      input: 0,
      output: 0,
    };
  }
};

export const updateGpio = async (info: IoState): Promise<GpioState> => {
  const { deviceId, data } = info;
  const { value, pos, type, mode } = data;

  try {
    if (type === 'input') {
      return data;
    }

    const ioExist = await IoMD.findOne({ by_device: deviceId });

    if (ioExist) {
      if (mode === 'single') {
        if (pos === undefined) {
          return data;
        }
        /* check pos exist in field output start from 0 to length -1 */
        if (pos < 0 || pos >= ioExist.output.length) {
          return data;
        }

        await IoMD.updateOne(
          { by_device: deviceId },
          {
            $set: {
              [`output.${pos}`]: {
                value,
                update_at: new Date(),
              },
            },
          }
        ).exec();
      } else if (mode === 'all') {
        await IoMD.updateOne(
          { by_device: deviceId },
          {
            $set: {
              output: Array.from({ length: ioExist.output.length }, (_, i) => ({
                value: value,
                update_at: new Date(),
              })),
            },
          }
        ).exec();
      }

      return data;
    }

    return data;
  } catch (error) {
    return data;
  }
};
