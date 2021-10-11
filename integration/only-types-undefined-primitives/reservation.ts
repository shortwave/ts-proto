/* eslint-disable */
import { Any } from './google/protobuf/any';

export const protobufPackage = 'event';

export interface Registration {
  eventName: string | undefined;
  date: Date | undefined;
  perks: Any | undefined;
}
