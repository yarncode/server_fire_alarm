/* node_module import */
import express from 'express';
const router = express.Router();

/* my import */
import Device from '../controller/device'
// import { main_auth as device_auth } from '../middleware/device-auth'
import { main_auth as account_auth } from '../middleware/app-auth'

router.post('/new', account_auth.validate_token, Device.create_device);
router.get('/info', account_auth.validate_token, Device.create_device);

export default router;
