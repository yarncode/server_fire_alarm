import { Request, Response } from 'express';
export interface AccountResponse {
    code: AccountCode;
    message: string;
}
export type AccountCode = '108000' | '108001' | '108002' | '108003' | '108004' | '108005' | '108006' | '108007' | '108008' | '108009' | '108010' | '108011' | '108012' | '108013' | '108014' | '108015';
export declare const ACCOUNT_MESSAGE: {
    [key in AccountCode]: string;
};
declare class Account {
    constructor();
    private emailValidate;
    private passwordValidate;
    private validateAccount;
    private generateToken;
    private generateRuntimeToken;
    login(req: Request, res: Response): Promise<any>;
    register(req: Request, res: Response): Promise<any>;
    logout(req: Request, res: Response): Promise<void>;
    info(req: Request, res: Response): Promise<any>;
    refreshToken(req: Request, res: Response): Promise<any>;
    changePassword(req: Request, res: Response): Promise<any>;
}
declare const _default: Account;
export default _default;
