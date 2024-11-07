import mongoose from 'mongoose';
export interface DataSensor {
    smoke: number;
    humidity: number;
    temperature: number;
}
export declare const MODEL_SENSOR_NAME = "Sensor";
export declare const MODEL_SENSOR_PAYLOAD_NAME = "SensorPayload";
export type SensorType = 'smoke' | 'humidity' | 'temperature' | 'gas';
declare const SensorMD: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    smoke: mongoose.Types.DocumentArray<{
        value?: number | null | undefined;
        update_at?: NativeDate | null | undefined;
    }>;
    gas: mongoose.Types.DocumentArray<{
        value?: number | null | undefined;
        update_at?: NativeDate | null | undefined;
    }>;
    env?: {
        temperature: mongoose.Types.DocumentArray<{
            value?: number | null | undefined;
            update_at?: NativeDate | null | undefined;
        }>;
        humidity: mongoose.Types.DocumentArray<{
            value?: number | null | undefined;
            update_at?: NativeDate | null | undefined;
        }>;
    } | null | undefined;
    by_device?: mongoose.Types.ObjectId | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    smoke: mongoose.Types.DocumentArray<{
        value?: number | null | undefined;
        update_at?: NativeDate | null | undefined;
    }>;
    gas: mongoose.Types.DocumentArray<{
        value?: number | null | undefined;
        update_at?: NativeDate | null | undefined;
    }>;
    env?: {
        temperature: mongoose.Types.DocumentArray<{
            value?: number | null | undefined;
            update_at?: NativeDate | null | undefined;
        }>;
        humidity: mongoose.Types.DocumentArray<{
            value?: number | null | undefined;
            update_at?: NativeDate | null | undefined;
        }>;
    } | null | undefined;
    by_device?: mongoose.Types.ObjectId | null | undefined;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    smoke: mongoose.Types.DocumentArray<{
        value?: number | null | undefined;
        update_at?: NativeDate | null | undefined;
    }>;
    gas: mongoose.Types.DocumentArray<{
        value?: number | null | undefined;
        update_at?: NativeDate | null | undefined;
    }>;
    env?: {
        temperature: mongoose.Types.DocumentArray<{
            value?: number | null | undefined;
            update_at?: NativeDate | null | undefined;
        }>;
        humidity: mongoose.Types.DocumentArray<{
            value?: number | null | undefined;
            update_at?: NativeDate | null | undefined;
        }>;
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
    smoke: mongoose.Types.DocumentArray<{
        value?: number | null | undefined;
        update_at?: NativeDate | null | undefined;
    }>;
    gas: mongoose.Types.DocumentArray<{
        value?: number | null | undefined;
        update_at?: NativeDate | null | undefined;
    }>;
    env?: {
        temperature: mongoose.Types.DocumentArray<{
            value?: number | null | undefined;
            update_at?: NativeDate | null | undefined;
        }>;
        humidity: mongoose.Types.DocumentArray<{
            value?: number | null | undefined;
            update_at?: NativeDate | null | undefined;
        }>;
    } | null | undefined;
    by_device?: mongoose.Types.ObjectId | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    smoke: mongoose.Types.DocumentArray<{
        value?: number | null | undefined;
        update_at?: NativeDate | null | undefined;
    }>;
    gas: mongoose.Types.DocumentArray<{
        value?: number | null | undefined;
        update_at?: NativeDate | null | undefined;
    }>;
    env?: {
        temperature: mongoose.Types.DocumentArray<{
            value?: number | null | undefined;
            update_at?: NativeDate | null | undefined;
        }>;
        humidity: mongoose.Types.DocumentArray<{
            value?: number | null | undefined;
            update_at?: NativeDate | null | undefined;
        }>;
    } | null | undefined;
    by_device?: mongoose.Types.ObjectId | null | undefined;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    smoke: mongoose.Types.DocumentArray<{
        value?: number | null | undefined;
        update_at?: NativeDate | null | undefined;
    }>;
    gas: mongoose.Types.DocumentArray<{
        value?: number | null | undefined;
        update_at?: NativeDate | null | undefined;
    }>;
    env?: {
        temperature: mongoose.Types.DocumentArray<{
            value?: number | null | undefined;
            update_at?: NativeDate | null | undefined;
        }>;
        humidity: mongoose.Types.DocumentArray<{
            value?: number | null | undefined;
            update_at?: NativeDate | null | undefined;
        }>;
    } | null | undefined;
    by_device?: mongoose.Types.ObjectId | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
export { SensorMD };
