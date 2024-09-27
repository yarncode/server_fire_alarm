/* node_module import */
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

/* my import */
import { ACCOUNT_MESSAGE, AccountResponse } from '../controller/account'

export const main_auth = {
    validate_token: (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers['_token']?.toString();
        if(!token) {
            return res.status(400).json({ code: '108015', message: ACCOUNT_MESSAGE['108015'] } as AccountResponse);
        }

        /* verify token */
        try {
            const decoded = jwt.verify(token, (process.env.JWT_SIGNATURE_SECRET || 'secret'));
            // console.log(decoded);
            req.body['email'] = (decoded as jwt.JwtPayload)['email']; // set email
            next();
            return;
        } catch (error) {
            /* token invalid */
            return res.status(400).json({ code: '108010', message: ACCOUNT_MESSAGE['108010'] } as AccountResponse);
        }
    },
}