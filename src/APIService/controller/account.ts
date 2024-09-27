/* node_module import */
import { Request, Response } from 'express'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

/* my import */
import { UserMD } from '../../DatabaseService/models/account'

export interface AccountResponse {
    code: AccountCode,
    message: string
}
export type AccountCode = 
'108000' | '108001' | '108002' | '108003' | '108004' | '108005' | '108006' | '108007' | 
'108008' | '108009' | '108010' | '108011' | '108012' | '108013' | '108014' | '108015';
export const ACCOUNT_MESSAGE: { [key in AccountCode]: string } = {
    '108000': 'None',
    '108001': 'Account not found',
    '108002': 'Account already exists',
    '108003': 'Email is not valid',
    '108004': 'Password is not valid',
    '108005': 'Email field is required',
    '108006': 'Password field is required',
    '108007': 'Unknown error',
    '108008': 'Account register successfully',
    '108009': 'Account login successfully',
    '108010': 'Token is not valid',
    '108011': 'Refresh token successfully',
    '108012': 'New password is like old password',
    '108013': 'New password is not valid',
    '108014': 'New password is updated',
    '108015': 'Token is not found',
}

class Account {

    constructor() {
        this.register = this.register.bind(this); // oke now method can access {this}
        this.login = this.login.bind(this); // oke now method can access {this}
        this.refreshToken = this.refreshToken.bind(this); // oke now method can access {this}
        this.changePassword = this.changePassword.bind(this); // oke now method can access {this}
        this.info = this.info.bind(this); // oke now method can access {this}
    }

    private emailValidate(email: string): boolean {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    }

    /* password more than 8 & less than 32 */
    private passwordValidate(password: string): boolean {
        return password.length > 8 && password.length < 32;
    }

    private validateAccount(email?: string, password?: string): { code: AccountCode, message: string } {
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

    private generateToken(payload: any): string {
        return jwt.sign(payload, (process.env.JWT_SIGNATURE_SECRET || 'secret'));
    }

    private generateRuntimeToken(payload: any): string {
        return jwt.sign(payload, (process.env.JWT_SIGNATURE_SECRET || 'secret'), { expiresIn: 2 * 60 });
    }

    async login(req: Request, res: Response): Promise<any> {
        try {
            const { email, password } = req.body;
            
            /* validate account */
            const { code } = this.validateAccount(email, password);

            if(code !== '108000') {
                return res.status(400).json({ code, message: ACCOUNT_MESSAGE[code] });
            }

            /* get user from email */
            const user = await UserMD.findOne({ email });

            if(user === null) {
                return res.status(400).json({ code: '108001', message: ACCOUNT_MESSAGE['108001'] });
            }
            
            /* verify password */
            const match = await bcrypt.compare(password, user.hash);
            if(match === false) {
                return res.status(400).json({ code: '108001', message: ACCOUNT_MESSAGE['108001'] });
            }

            /* response runtime token */
            res.status(200).json({ code: '108009', message: ACCOUNT_MESSAGE['108009'], runtime_token: this.generateRuntimeToken({ email}), refresh_token: user.token });
        } catch (error) {return res.status(500).json({ code: '108007', message: ACCOUNT_MESSAGE['108007'] });
        }
    }

    async register(req: Request, res: Response): Promise<any> {
        try {
            const { email, password } = req.body;
            
            /* validate account */
            const { code } = this.validateAccount(email, password);

            if(code !== '108000') {
                return res.status(400).json({ code, message: ACCOUNT_MESSAGE[code] });
            }

            /* hash password */
            const hash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS || '10'));

            /* generate token */
            const token = this.generateToken({ email });
            const runtimeToken = this.generateRuntimeToken({ email });

            /* create account */
            const user = new UserMD({
                email,
                hash,
                token,
                desc: 'Unknown',
                state: 'active',
                name: 'Unknown',
                username: 'Unknown'
            });

            await user.save();

            res.status(200).json({ code: '108008', message: ACCOUNT_MESSAGE['108008'], runtime_token: runtimeToken, refresh_token: token });

        } catch (error: any) {/* check account already exists */
            if(error?.code === 11000) {
                return res.status(400).json({ code: '108002', message: ACCOUNT_MESSAGE['108002'] });
            }
            return res.status(500).json({ code: '108007', message: ACCOUNT_MESSAGE['108007'] });
        }
    }

    async logout(req: Request, res: Response) {
        res.status(200).json({})
    }

    async info(req: Request, res: Response): Promise<any> {
        try {
            const { email } = req.body;

            /* get user from email */
            const user = await UserMD.findOne({ email });

            if(user === null) {
                return res.status(400).json({ code: '108001', message: ACCOUNT_MESSAGE['108001'] });
            }

            return res.status(200).json({ code: '108000', message: ACCOUNT_MESSAGE['108000'], info: {
                email: user.email,
                name: user.name,
                username: user.username,
                desc: user.desc,
                avatar_url: user.avatar_url
            } });

        } catch (error) {
            return res.status(500).json({ code: '108007', message: ACCOUNT_MESSAGE['108007'] });
        }
    }

    async refreshToken(req: Request, res: Response): Promise<any> {
        try {
            const { email } = req.body;

            /* get user from email */
            const user = await UserMD.findOne({ email });

            if(user === null) {
                return res.status(400).json({ code: '108001', message: ACCOUNT_MESSAGE['108001'] });
            }

            /* check token */
            if(user.token !== req.headers['_token']) {
                return res.status(400).json({ code: '108010', message: ACCOUNT_MESSAGE['108010'] });
            }

            res.status(200).json({ code: '108011', message: ACCOUNT_MESSAGE['108011'], runtime_token: this.generateRuntimeToken({ email}) });
        } catch (error) {
            return res.status(500).json({ code: '108007', message: ACCOUNT_MESSAGE['108007'] });
        }
    }

    async changePassword(req: Request, res: Response): Promise<any> {
        try {
            const { email, password, new_password } = req.body;

            /* validate new password */
            if(!this.passwordValidate(new_password)) {
                return res.status(400).json({ code: '108013', message: ACCOUNT_MESSAGE['108013'] });
            }

            /* get user from email */
            const user = await UserMD.findOne({ email });

            if(user === null) {
                return res.status(400).json({ code: '108001', message: ACCOUNT_MESSAGE['108001'] });
            }

            /* verify password */
            const match = await bcrypt.compare(password, user.hash);
            if(match === false) {
                return res.status(400).json({ code: '108001', message: ACCOUNT_MESSAGE['108001'] });
            }

            /* new password mest be different from old */
            if(new_password === password) {
                return res.status(400).json({ code: '108012', message: ACCOUNT_MESSAGE['108012'] });
            }

            /* hash password */
            const hash = await bcrypt.hash(new_password, parseInt(process.env.BCRYPT_SALT_ROUNDS || '10'));

            /* update password */
            await UserMD.updateOne({ email }, { hash });
            res.status(200).json({ code: '108014', message: ACCOUNT_MESSAGE['108014'] });

        } catch (error) {
            return res.status(500).json({ code: '108007', message: ACCOUNT_MESSAGE['108007'] });
        }
    }

}

export default new Account();