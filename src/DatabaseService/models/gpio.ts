import mongoose, { Schema } from 'mongoose';

/* my import */
import { MODEL_DEVICE_NAME } from './devices';

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

export const MODEL_IO_NAME = 'IO';
export const MODEL_IO_PAYLOAD_NAME = 'IOPayload';
export type IOType = 'input' | 'output';

const Gpio = new Schema(
  {
    by_device: { ref: MODEL_DEVICE_NAME, type: Schema.Types.ObjectId },
    input: {
      type: [{ value: Schema.Types.Boolean, update_at: Schema.Types.Date }],
      required: true,
    },
    output: {
      type: [{ value: Schema.Types.Boolean, update_at: Schema.Types.Date }],
      required: true,
    },
  },
  { timestamps: true }
);

const IoMD = mongoose.model(MODEL_IO_PAYLOAD_NAME, Gpio);

export { IoMD };
