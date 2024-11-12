import mongoose from 'mongoose';
export type GpioType = 'input' | 'output';
export type ControlType = 'buzzer' | 'gpio';
export type ModeControl = 'single' | 'multiple' | 'all';
export interface DataInfoIO {
    input: number;
    output: number;
}
export interface DataStateInfoIO {
    input: boolean[];
    output: boolean[];
}
export interface GpioState {
    state: boolean;
    type: GpioType;
    pos?: number;
    ack?: string;
    mode?: ModeControl;
}
export declare const MODEL_IO_NAME = "IO";
export declare const MODEL_IO_PAYLOAD_NAME = "IOPayload";
export type IOType = 'input' | 'output';
declare const IoMD: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    input: mongoose.Types.DocumentArray<{
        value?: boolean | null | undefined;
        update_at?: NativeDate | null | undefined;
    }>;
    output: mongoose.Types.DocumentArray<{
        value?: boolean | null | undefined;
        update_at?: NativeDate | null | undefined;
    }>;
    by_device?: mongoose.Types.ObjectId | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    input: mongoose.Types.DocumentArray<{
        value?: boolean | null | undefined;
        update_at?: NativeDate | null | undefined;
    }>;
    output: mongoose.Types.DocumentArray<{
        value?: boolean | null | undefined;
        update_at?: NativeDate | null | undefined;
    }>;
    by_device?: mongoose.Types.ObjectId | null | undefined;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    input: mongoose.Types.DocumentArray<{
        value?: boolean | null | undefined;
        update_at?: NativeDate | null | undefined;
    }>;
    output: mongoose.Types.DocumentArray<{
        value?: boolean | null | undefined;
        update_at?: NativeDate | null | undefined;
    }>;
    by_device?: mongoose.Types.ObjectId | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    input: mongoose.Types.DocumentArray<{
        value?: boolean | null | undefined;
        update_at?: NativeDate | null | undefined;
    }>;
    output: mongoose.Types.DocumentArray<{
        value?: boolean | null | undefined;
        update_at?: NativeDate | null | undefined;
    }>;
    by_device?: mongoose.Types.ObjectId | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    input: mongoose.Types.DocumentArray<{
        value?: boolean | null | undefined;
        update_at?: NativeDate | null | undefined;
    }>;
    output: mongoose.Types.DocumentArray<{
        value?: boolean | null | undefined;
        update_at?: NativeDate | null | undefined;
    }>;
    by_device?: mongoose.Types.ObjectId | null | undefined;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    input: mongoose.Types.DocumentArray<{
        value?: boolean | null | undefined;
        update_at?: NativeDate | null | undefined;
    }>;
    output: mongoose.Types.DocumentArray<{
        value?: boolean | null | undefined;
        update_at?: NativeDate | null | undefined;
    }>;
    by_device?: mongoose.Types.ObjectId | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
export { IoMD };
