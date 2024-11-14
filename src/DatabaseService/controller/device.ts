import { InfoStateDevice } from '..';
import { DeviceMD, DataStateDevice } from '../models/devices';

/* func update state device */
export const updateStateDevice = async (info: InfoStateDevice) => {

  const { deviceId, mac, userId } = info;
  const { status } = info.data;

  /* update state device */
  const device = await DeviceMD.findOneAndUpdate(
    { _id: deviceId, mac, by_user: userId },
    { status },
    { new: true }
  ).select('-_id -__v -by_user');

  if (device == null) {
    throw new Error('Device not found');
  }

  return {
    status: device.status,
  } as DataStateDevice;
};
