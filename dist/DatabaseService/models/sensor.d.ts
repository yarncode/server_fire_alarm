import mongoose from 'mongoose';
export declare const MODEL_SENSOR_NAME = "Sensor";
export declare const MODEL_SENSOR_PAYLOAD_NAME = "SensorPayload";
export type SensorType = 'smoke' | 'humidity' | 'temperature' | 'gas';
declare const SensorMD: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    smoke: mongoose.Types.ObjectId[];
    gas: mongoose.Types.ObjectId[];
    env?: {
        humidity: mongoose.Types.ObjectId[];
        temperature: mongoose.Types.ObjectId[];
    } | null | undefined;
    by_device?: mongoose.Types.ObjectId | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    smoke: mongoose.Types.ObjectId[];
    gas: mongoose.Types.ObjectId[];
    env?: {
        humidity: mongoose.Types.ObjectId[];
        temperature: mongoose.Types.ObjectId[];
    } | null | undefined;
    by_device?: mongoose.Types.ObjectId | null | undefined;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    smoke: mongoose.Types.ObjectId[];
    gas: mongoose.Types.ObjectId[];
    env?: {
        humidity: mongoose.Types.ObjectId[];
        temperature: mongoose.Types.ObjectId[];
    } | null | undefined;
    by_device?: mongoose.Types.ObjectId | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    smoke: mongoose.Types.ObjectId[];
    gas: mongoose.Types.ObjectId[];
    env?: {
        humidity: mongoose.Types.ObjectId[];
        temperature: mongoose.Types.ObjectId[];
    } | null | undefined;
    by_device?: mongoose.Types.ObjectId | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    smoke: mongoose.Types.ObjectId[];
    gas: mongoose.Types.ObjectId[];
    env?: {
        humidity: mongoose.Types.ObjectId[];
        temperature: mongoose.Types.ObjectId[];
    } | null | undefined;
    by_device?: mongoose.Types.ObjectId | null | undefined;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    smoke: mongoose.Types.ObjectId[];
    gas: mongoose.Types.ObjectId[];
    env?: {
        humidity: mongoose.Types.ObjectId[];
        temperature: mongoose.Types.ObjectId[];
    } | null | undefined;
    by_device?: mongoose.Types.ObjectId | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
declare const SensorPayloadMD: mongoose.Model<{
    value?: any;
    time_at?: NativeDate | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    value?: any;
    time_at?: NativeDate | null | undefined;
}> & {
    value?: any;
    time_at?: NativeDate | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    value?: any;
    time_at?: NativeDate | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    value?: any;
    time_at?: NativeDate | null | undefined;
}>> & mongoose.FlatRecord<{
    value?: any;
    time_at?: NativeDate | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
export { SensorMD, SensorPayloadMD };
