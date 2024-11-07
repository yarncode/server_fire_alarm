import mongoose from 'mongoose';
export interface DataStateDevice {
    status: NodeStateType;
}
export declare const MODEL_DEVICE_NAME = "Device";
export declare const MODEL_DEVICE_SETTING_NAME = "DeviceSetting";
export declare const MODEL_DEVICE_LOGGER_NAME = "DeviceLogger";
export type NodeType = 'GATEWAY' | 'NODE' | 'UNKNOWN';
export type NodeStateType = 'ONLINE' | 'OFFLINE';
export declare const NodeTypeList: string[];
export declare const LoggerTypeList: string[];
declare const DeviceMD: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    type: string;
    status: "ONLINE" | "OFFLINE";
    by_user: mongoose.Types.ObjectId;
    mac: string;
    child_mac: string[];
    name?: string | null | undefined;
    auth?: {
        username: string;
        password: string;
    } | null | undefined;
    token?: string | null | undefined;
    desc?: string | null | undefined;
    state?: "removed" | "active" | "disable" | null | undefined;
    parent_mac?: string | null | undefined;
    ram_size?: number | null | undefined;
    ip?: string | null | undefined;
    layer?: number | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    type: string;
    status: "ONLINE" | "OFFLINE";
    by_user: mongoose.Types.ObjectId;
    mac: string;
    child_mac: string[];
    name?: string | null | undefined;
    auth?: {
        username: string;
        password: string;
    } | null | undefined;
    token?: string | null | undefined;
    desc?: string | null | undefined;
    state?: "removed" | "active" | "disable" | null | undefined;
    parent_mac?: string | null | undefined;
    ram_size?: number | null | undefined;
    ip?: string | null | undefined;
    layer?: number | null | undefined;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    type: string;
    status: "ONLINE" | "OFFLINE";
    by_user: mongoose.Types.ObjectId;
    mac: string;
    child_mac: string[];
    name?: string | null | undefined;
    auth?: {
        username: string;
        password: string;
    } | null | undefined;
    token?: string | null | undefined;
    desc?: string | null | undefined;
    state?: "removed" | "active" | "disable" | null | undefined;
    parent_mac?: string | null | undefined;
    ram_size?: number | null | undefined;
    ip?: string | null | undefined;
    layer?: number | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    type: string;
    status: "ONLINE" | "OFFLINE";
    by_user: mongoose.Types.ObjectId;
    mac: string;
    child_mac: string[];
    name?: string | null | undefined;
    auth?: {
        username: string;
        password: string;
    } | null | undefined;
    token?: string | null | undefined;
    desc?: string | null | undefined;
    state?: "removed" | "active" | "disable" | null | undefined;
    parent_mac?: string | null | undefined;
    ram_size?: number | null | undefined;
    ip?: string | null | undefined;
    layer?: number | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    type: string;
    status: "ONLINE" | "OFFLINE";
    by_user: mongoose.Types.ObjectId;
    mac: string;
    child_mac: string[];
    name?: string | null | undefined;
    auth?: {
        username: string;
        password: string;
    } | null | undefined;
    token?: string | null | undefined;
    desc?: string | null | undefined;
    state?: "removed" | "active" | "disable" | null | undefined;
    parent_mac?: string | null | undefined;
    ram_size?: number | null | undefined;
    ip?: string | null | undefined;
    layer?: number | null | undefined;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    type: string;
    status: "ONLINE" | "OFFLINE";
    by_user: mongoose.Types.ObjectId;
    mac: string;
    child_mac: string[];
    name?: string | null | undefined;
    auth?: {
        username: string;
        password: string;
    } | null | undefined;
    token?: string | null | undefined;
    desc?: string | null | undefined;
    state?: "removed" | "active" | "disable" | null | undefined;
    parent_mac?: string | null | undefined;
    ram_size?: number | null | undefined;
    ip?: string | null | undefined;
    layer?: number | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
declare const DeviceSettingMD: mongoose.Model<{
    deviceId: mongoose.Types.ObjectId;
    threshold: any;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    deviceId: mongoose.Types.ObjectId;
    threshold: any;
}> & {
    deviceId: mongoose.Types.ObjectId;
    threshold: any;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    deviceId: mongoose.Types.ObjectId;
    threshold: any;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    deviceId: mongoose.Types.ObjectId;
    threshold: any;
}>> & mongoose.FlatRecord<{
    deviceId: mongoose.Types.ObjectId;
    threshold: any;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
declare const DeviceLoggerMD: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    message: string;
    type: string;
    deviceId: mongoose.Types.ObjectId;
    raw?: any;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    message: string;
    type: string;
    deviceId: mongoose.Types.ObjectId;
    raw?: any;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    message: string;
    type: string;
    deviceId: mongoose.Types.ObjectId;
    raw?: any;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    message: string;
    type: string;
    deviceId: mongoose.Types.ObjectId;
    raw?: any;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    message: string;
    type: string;
    deviceId: mongoose.Types.ObjectId;
    raw?: any;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    message: string;
    type: string;
    deviceId: mongoose.Types.ObjectId;
    raw?: any;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
export { DeviceMD, DeviceSettingMD, DeviceLoggerMD };
