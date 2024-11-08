import { InfoIo, IoState } from '..';
import { GpioState, IoMD } from '../models/gpio';

export interface ResponseInfoIo {
  deviceId: string;
  data: {
    input: boolean[];
    output: boolean[];
  };
}

export interface ResponseGpioState {
  deviceId: string;
  data: GpioState;
}

export const createGpio = async (info: InfoIo): Promise<ResponseInfoIo> => {
  const { deviceId, data } = info;
  const { input, output } = data;

  try {
    const ioExist = await IoMD.findOne({ by_device: deviceId });

    /* update io */
    if (ioExist) {
      await IoMD.updateOne(
        { by_device: deviceId },
        {
          $set: {
            input: input.map((_, i) => ({ value: _, update_at: new Date() })),
            output: output.map((_, i) => ({ value: _, update_at: new Date() })),
          },
        }
      ).exec();
    } else {
      const newIo = new IoMD({
        by_device: deviceId,
        input: input.map((_, i) => ({ value: _, update_at: new Date() })),
        output: output.map((_, i) => ({ value: _, update_at: new Date() })),
      });
      await newIo.save();
    }
  } catch (error) {
    console.log(error);
  }

  return {
    deviceId,
    data: {
      input,
      output,
    },
  };
};

export const updateGpio = async (info: IoState): Promise<ResponseGpioState> => {
  const { deviceId, data } = info;
  const { state, pos, type, mode } = data;

  if (['input', 'output'].includes(type) === false) {
    return { deviceId, data };
  }

  try {
    const ioExist = await IoMD.findOne({ by_device: deviceId });

    if (ioExist) {
      if (mode === 'single') {
        if (pos === undefined) {
          return { deviceId, data };
        }
        /* check pos exist in field output start from 0 to length -1 */
        if (pos < 0 || pos >= ioExist.output.length) {
          return { deviceId, data };
        }

        await IoMD.updateOne(
          { by_device: deviceId },
          {
            $set: {
              [`${type}.${pos}`]: {
                value: state,
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
              [`${type}`]: Array.from(
                { length: ioExist.output.length },
                (_, i) => ({
                  value: state,
                  update_at: new Date(),
                })
              ),
            },
          }
        ).exec();
      }
    }
  } catch (error) {
    console.log(error);
  }

  return { deviceId, data };
};
