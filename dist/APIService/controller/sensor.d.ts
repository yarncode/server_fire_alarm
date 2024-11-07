import { Request, Response } from 'express';
export interface AccountResponse {
    code: AccountCode;
    message: string;
}
export type AccountCode = '109000' | '109001' | '109002' | '109003';
export declare const ACCOUNT_MESSAGE: {
    [key in AccountCode]: string;
};
declare class Sensor {
    constructor();
    private genObjectQuerySensor;
    info(req: Request, res: Response): Promise<any>;
}
declare const _default: Sensor;
export default _default;
