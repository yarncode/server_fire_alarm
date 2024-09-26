/* node_module import */
import express from 'express';
const router = express.Router();

/* my import */
import Account from '../controller/account'

router.get('/info', Account.info);
router.post('/login', Account.login);
router.post('/register', Account.register);
router.post('/logout', Account.logout);
router.post('/refresh-token', Account.refreshToken);
router.post('/change-password', Account.changePassword);

export default router;
