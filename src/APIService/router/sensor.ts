/* node_module import */
import express from 'express';
const router = express.Router();

/* my import */
import Sensor from '../controller/sensor'
import { main_auth } from '../middleware/app-auth'

router.get('/info/:id_device', main_auth.validate_token, Sensor.info);

export default router;
