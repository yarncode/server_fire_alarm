import mongoose from 'mongoose';
export declare const MODEL_DEVICE_NAME = "Device";
export type NodeType = 'GATEWAY' | 'NODE' | 'UNKNOWN';
export declare const NodeTypeList: string[];
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
export { DeviceMD, };
