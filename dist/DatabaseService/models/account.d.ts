import mongoose from 'mongoose';
export declare const MODEL_USER_NAME = "User";
declare const UserMD: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    email: string;
    hash: string;
    name?: string | null | undefined;
    token?: string | null | undefined;
    username?: string | null | undefined;
    desc?: string | null | undefined;
    avatar_url?: string | null | undefined;
    state?: "removed" | "active" | "disable" | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    email: string;
    hash: string;
    name?: string | null | undefined;
    token?: string | null | undefined;
    username?: string | null | undefined;
    desc?: string | null | undefined;
    avatar_url?: string | null | undefined;
    state?: "removed" | "active" | "disable" | null | undefined;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    email: string;
    hash: string;
    name?: string | null | undefined;
    token?: string | null | undefined;
    username?: string | null | undefined;
    desc?: string | null | undefined;
    avatar_url?: string | null | undefined;
    state?: "removed" | "active" | "disable" | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    email: string;
    hash: string;
    name?: string | null | undefined;
    token?: string | null | undefined;
    username?: string | null | undefined;
    desc?: string | null | undefined;
    avatar_url?: string | null | undefined;
    state?: "removed" | "active" | "disable" | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    email: string;
    hash: string;
    name?: string | null | undefined;
    token?: string | null | undefined;
    username?: string | null | undefined;
    desc?: string | null | undefined;
    avatar_url?: string | null | undefined;
    state?: "removed" | "active" | "disable" | null | undefined;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    email: string;
    hash: string;
    name?: string | null | undefined;
    token?: string | null | undefined;
    username?: string | null | undefined;
    desc?: string | null | undefined;
    avatar_url?: string | null | undefined;
    state?: "removed" | "active" | "disable" | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
export { UserMD, };
