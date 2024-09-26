/* node_module import */
import { Request, Response } from 'express'

export type AccountErrorCode = '108000' | '108001' | '108002' | '108003' | '108004' | '108005' | '108006' | '108007';
export const ACCOUNT_MESSAGE: { [key in AccountErrorCode]: string } = {
    '108000': 'None',
    '108001': 'Account not found',
    '108002': 'Account already exists',
    '108003': 'Email is not valid',
    '108004': 'Password is not valid',
    '108005': 'Email field is required',
    '108006': 'Password field is required',
    '108007': 'Unknown error',
}

class Account {

    constructor() {
        this.register = this.register.bind(this); // oke now method can access {this}
    }

    emailValidate(email: string): boolean {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    }

    /* password more than 8 & less than 32 */
    passwordValidate(password: string): boolean {
        return password.length > 8 && password.length < 32;
    }

    validateAccount(email?: string, password?: string): { code: AccountErrorCode, message: string } {
        if(email === undefined) {
            return { code: '108005', message: ACCOUNT_MESSAGE['108005'] };
        }

        if(password === undefined) {
            return { code: '108006', message: ACCOUNT_MESSAGE['108006'] };
        }

        if(!this.emailValidate(email)) {
            return { code: '108003', message: ACCOUNT_MESSAGE['108003'] };
        }

        if(!this.passwordValidate(password)) {
            return { code: '108004', message: ACCOUNT_MESSAGE['108004'] };
        }
        
        return { code: '108000', message: ACCOUNT_MESSAGE['108000'] };
    }

    async login(req: Request, res: Response) {
        res.status(200).json({})
    }

    async register(req: Request, res: Response): Promise<any> {
        try {
            const { email, password } = req.body;
            
            /* validate account */
            const { code } = this.validateAccount(email, password);

            if(code !== '108000') {
                return res.status(400).json({ code, message: ACCOUNT_MESSAGE[code] });
            }

            /* create account */

            res.status(200).json({})

        } catch (error) {
            console.log(error);
            return res.status(500).json({ code: '108007', message: ACCOUNT_MESSAGE['108007'] });
        }
    }

    async logout(req: Request, res: Response) {
        res.status(200).json({})
    }

    async info(req: Request, res: Response) {
        res.status(200).json({})
    }

    async refreshToken(req: Request, res: Response) {
        res.status(200).json({})
    }

    async changePassword(req: Request, res: Response) {
        res.status(200).json({})
    }

}

export default new Account();