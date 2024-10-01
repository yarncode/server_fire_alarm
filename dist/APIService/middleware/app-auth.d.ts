import { Request, Response, NextFunction } from 'express';
export declare const main_auth: {
    validate_token: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
};
