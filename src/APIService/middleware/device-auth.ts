/* node_module import */
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

/* my import */
import { DEVICE_MESSAGE, DeviceResponse } from '../controller/device'

export const main_auth = {
    validate_token: (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers['_token']?.toString();
        if(!token) {
            return res.status(400).json({ code: '107005', message: DEVICE_MESSAGE['107005'] } as DeviceResponse);
        }
        
        /* verify token */
        try {
            const decoded = jwt.verify(token, (process.env.JWT_SIGNATURE_SECRET || 'secret'));
            // console.log(decoded);
            req.body['mac'] = (decoded as jwt.JwtPayload)['mac']; // set mac
            next();
            return;
        } catch (error) {
            /* token invalid */
            return res.status(400).json({ code: '107004', message: DEVICE_MESSAGE['107004'] } as DeviceResponse);
        }
    },
}