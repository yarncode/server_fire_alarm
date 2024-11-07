import express from 'express';
import { RocketService } from '../ManageService';
export declare const API_SERVICE_NAME = "api-service";
declare class APIInstance extends RocketService {
    constructor(port: number);
    onReceiveMessage(payload: string): void;
    onListen(): void;
    start(): void;
    stop(): void;
    port: number;
    app: express.Application;
}
declare const _default: APIInstance;
export default _default;
