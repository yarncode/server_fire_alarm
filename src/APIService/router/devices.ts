/* node_module import */
import express from 'express';
const router = express.Router();

/* my import */
import Device from '../controller/device';
import { main_auth as device_auth } from '../middleware/device-auth';
import { main_auth as account_auth } from '../middleware/app-auth';

router.get(
  '/info',
  account_auth.validate_token,
  device_auth.validate_owner,
  Device.device_info
);
router.get('/info/list', account_auth.validate_token, Device.device_list);
router.post(
  '/new',
  account_auth.validate_token,
  Device.create_device
); /* {JUST FOR DEVICE CALL} */
router.post(
  '/info/update',
  account_auth.validate_token,
  device_auth.validate_owner,
  Device.update_device
);
router.post(
  '/remove',
  account_auth.validate_token,
  device_auth.validate_owner,
  Device.remove_device
);

export default router;
