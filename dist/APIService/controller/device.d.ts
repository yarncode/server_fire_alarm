import { Request, Response } from 'express';
export interface DeviceResponse {
    code: DeviceCode;
    message: string;
}
export type DeviceCode = '107000' | '107001' | '107002' | '107003' | '107004' | '107005' | '107006' | '107007' | '107008' | '107009' | '107010' | '107011' | '107012' | '107013' | '107014';
export declare const DEVICE_MESSAGE: {
    [key in DeviceCode]: string;
};
declare class Device {
    constructor();
    private generateToken;
    device_list(req: Request, res: Response): Promise<any>;
    device_info(req: Request, res: Response): Promise<any>;
    create_device(req: Request, res: Response): Promise<any>;
    update_device(req: Request, res: Response): Promise<any>;
    remove_device(req: Request, res: Response): Promise<any>;
}
declare const _default: Device;
export default _default;
