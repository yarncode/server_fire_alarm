/* node_module import */
import express from 'express';
const router = express.Router();

/* my import */
import Account from '../controller/account'
import { main_auth } from '../middleware/app-auth'

router.get('/info', main_auth.validate_token, Account.info);
router.post('/login', Account.login);
router.post('/register', Account.register);
router.post('/logout', Account.logout);
router.post('/refresh-token', main_auth.validate_token, Account.refreshToken);
router.post('/change-password', main_auth.validate_token, Account.changePassword);

export default router;
