const { spawnSync } = require('child_process');
const { dirname, join } = require('path');
const { readFileSync } = require('fs');

describe('', () => {
  test('correctly generates types for test.proto', () => {
    const build = spawnSync('npm', ['run', 'build'], { cwd: __dirname, stdio: 'inherit' });
    expect(build.status).toBe(0);
    const protoc = spawnSync(
      'protoc',
      [
        `--proto_path=${dirname(require.resolve('@wix/well-known-protos/package.json'))}/protobuf`,
        `--proto_path=${__dirname}`,
        `--plugin=${join(__dirname, '..', 'protoc-gen-ts_proto')}`,
        `--ts_proto_out=${__dirname}`,
        `google/protobuf/struct.proto`,
        `test.proto`,
      ],
      {
        cwd: __dirname,
        stdio: 'inherit',
      }
    );
    expect(protoc.status).toBe(0);
    const structOutput = readFileSync(join(__dirname, 'test.ts'), { encoding: 'utf8' });
    expect(structOutput).toMatchInlineSnapshot(`
      "/* eslint-disable */
      import { NullValue, Struct, Value, ListValue } from './google/protobuf/struct';
      import {
        BoolValue,
        Int32Value,
        Int64Value,
        UInt32Value,
        UInt64Value,
        FloatValue,
        DoubleValue,
        StringValue,
        BytesValue,
      } from './google/protobuf/wrappers';
      import { Duration } from './google/protobuf/duration';
      import { Timestamp } from './google/protobuf/timestamp';
      import { FieldMask } from './google/protobuf/field_mask';
      import { Any } from './google/protobuf/any';

      export const protobufPackage = 'protobuf_test_messages.proto3';

      export const enum ForeignEnum {
        FOREIGN_FOO = 'FOREIGN_FOO',
        FOREIGN_BAR = 'FOREIGN_BAR',
        FOREIGN_BAZ = 'FOREIGN_BAZ',
      }

      /**
       * This proto includes every type of field in both singular and repeated
       * forms.
       *
       * Also, crucially, all messages and enums in this file are eventually
       * submessages of this message.  So for example, a fuzz test of TestAllTypes
       * could trigger bugs that occur in any message type in this file.  We verify
       * this stays true in a unit test.
       */
      export interface TestAllTypesProto3 {
        /** Singular */
        optionalInt32?: number;
        optionalInt64?: string;
        optionalUint32?: number;
        optionalUint64?: string;
        optionalSint32?: number;
        optionalSint64?: string;
        optionalFixed32?: number;
        optionalFixed64?: string;
        optionalSfixed32?: number;
        optionalSfixed64?: string;
        optionalFloat?: number;
        optionalDouble?: number;
        optionalBool?: boolean;
        optionalString?: string;
        optionalBytes?: Uint8Array;
        optionalNestedMessage?: TestAllTypesProto3_NestedMessage;
        optionalForeignMessage?: ForeignMessage;
        optionalNestedEnum?: TestAllTypesProto3_NestedEnum;
        optionalForeignEnum?: ForeignEnum;
        optionalAliasedEnum?: TestAllTypesProto3_AliasedEnum;
        optionalStringPiece?: string;
        optionalCord?: string;
        recursiveMessage?: TestAllTypesProto3;
        /** Repeated */
        repeatedInt32?: number[];
        repeatedInt64?: string[];
        repeatedUint32?: number[];
        repeatedUint64?: string[];
        repeatedSint32?: number[];
        repeatedSint64?: string[];
        repeatedFixed32?: number[];
        repeatedFixed64?: string[];
        repeatedSfixed32?: number[];
        repeatedSfixed64?: string[];
        repeatedFloat?: number[];
        repeatedDouble?: number[];
        repeatedBool?: boolean[];
        repeatedString?: string[];
        repeatedBytes?: Uint8Array[];
        repeatedNestedMessage?: TestAllTypesProto3_NestedMessage[];
        repeatedForeignMessage?: ForeignMessage[];
        repeatedNestedEnum?: TestAllTypesProto3_NestedEnum[];
        repeatedForeignEnum?: ForeignEnum[];
        repeatedStringPiece?: string[];
        repeatedCord?: string[];
        /** Packed */
        packedInt32?: number[];
        packedInt64?: string[];
        packedUint32?: number[];
        packedUint64?: string[];
        packedSint32?: number[];
        packedSint64?: string[];
        packedFixed32?: number[];
        packedFixed64?: string[];
        packedSfixed32?: number[];
        packedSfixed64?: string[];
        packedFloat?: number[];
        packedDouble?: number[];
        packedBool?: boolean[];
        packedNestedEnum?: TestAllTypesProto3_NestedEnum[];
        /** Unpacked */
        unpackedInt32?: number[];
        unpackedInt64?: string[];
        unpackedUint32?: number[];
        unpackedUint64?: string[];
        unpackedSint32?: number[];
        unpackedSint64?: string[];
        unpackedFixed32?: number[];
        unpackedFixed64?: string[];
        unpackedSfixed32?: number[];
        unpackedSfixed64?: string[];
        unpackedFloat?: number[];
        unpackedDouble?: number[];
        unpackedBool?: boolean[];
        unpackedNestedEnum?: TestAllTypesProto3_NestedEnum[];
        /** Map */
        mapInt32Int32?: { [key: string]: number };
        mapInt64Int64?: { [key: string]: string };
        mapUint32Uint32?: { [key: string]: number };
        mapUint64Uint64?: { [key: string]: string };
        mapSint32Sint32?: { [key: string]: number };
        mapSint64Sint64?: { [key: string]: string };
        mapFixed32Fixed32?: { [key: string]: number };
        mapFixed64Fixed64?: { [key: string]: string };
        mapSfixed32Sfixed32?: { [key: string]: number };
        mapSfixed64Sfixed64?: { [key: string]: string };
        mapInt32Float?: { [key: string]: number };
        mapInt32Double?: { [key: string]: number };
        mapBoolBool?: { [key: string]: boolean };
        mapStringString?: { [key: string]: string };
        mapStringBytes?: { [key: string]: Uint8Array };
        mapStringNestedMessage?: { [key: string]: TestAllTypesProto3_NestedMessage };
        mapStringForeignMessage?: { [key: string]: ForeignMessage };
        mapStringNestedEnum?: { [key: string]: TestAllTypesProto3_NestedEnum };
        mapStringForeignEnum?: { [key: string]: ForeignEnum };
        oneofUint32?: number;
        oneofNestedMessage?: TestAllTypesProto3_NestedMessage;
        oneofString?: string;
        oneofBytes?: Uint8Array;
        oneofBool?: boolean;
        oneofUint64?: string;
        oneofFloat?: number;
        oneofDouble?: number;
        oneofEnum?: TestAllTypesProto3_NestedEnum;
        oneofNullValue?: NullValue;
        /** Well-known types */
        optionalBoolWrapper?: BoolValue;
        optionalInt32Wrapper?: Int32Value;
        optionalInt64Wrapper?: Int64Value;
        optionalUint32Wrapper?: UInt32Value;
        optionalUint64Wrapper?: UInt64Value;
        optionalFloatWrapper?: FloatValue;
        optionalDoubleWrapper?: DoubleValue;
        optionalStringWrapper?: StringValue;
        optionalBytesWrapper?: BytesValue;
        repeatedBoolWrapper?: BoolValue[];
        repeatedInt32Wrapper?: Int32Value[];
        repeatedInt64Wrapper?: Int64Value[];
        repeatedUint32Wrapper?: UInt32Value[];
        repeatedUint64Wrapper?: UInt64Value[];
        repeatedFloatWrapper?: FloatValue[];
        repeatedDoubleWrapper?: DoubleValue[];
        repeatedStringWrapper?: StringValue[];
        repeatedBytesWrapper?: BytesValue[];
        optionalDuration?: Duration;
        optionalTimestamp?: Timestamp;
        optionalFieldMask?: FieldMask;
        optionalStruct?: Struct;
        optionalAny?: Any;
        optionalValue?: Value;
        optionalNullValue?: NullValue;
        repeatedDuration?: Duration[];
        repeatedTimestamp?: Timestamp[];
        repeatedFieldmask?: FieldMask[];
        repeatedStruct?: Struct[];
        repeatedAny?: Any[];
        repeatedValue?: Value[];
        repeatedListValue?: ListValue[];
        /**
         * Test field-name-to-JSON-name convention.
         * (protobuf says names can be any valid C/C++ identifier.)
         */
        fieldname1?: number;
        fieldName2?: number;
        FieldName3?: number;
        fieldName4?: number;
        field0name5?: number;
        field0Name6?: number;
        fieldName7?: number;
        FieldName8?: number;
        fieldName9?: number;
        FieldName10?: number;
        FieldName11?: number;
        FieldName12?: number;
        FieldName13?: number;
        FieldName14?: number;
        fieldName15?: number;
        fieldName16?: number;
        fieldName17?: number;
        FieldName18?: number;
      }

      export const enum TestAllTypesProto3_NestedEnum {
        FOO = 'FOO',
        BAR = 'BAR',
        BAZ = 'BAZ',
        /** NEG - Intentionally negative. */
        NEG = 'NEG',
      }

      export const enum TestAllTypesProto3_AliasedEnum {
        ALIAS_FOO = 'ALIAS_FOO',
        ALIAS_BAR = 'ALIAS_BAR',
        ALIAS_BAZ = 'ALIAS_BAZ',
        QUX = 'QUX',
        qux = 'qux',
        bAz = 'bAz',
      }

      export interface TestAllTypesProto3_NestedMessage {
        a?: number;
        corecursive?: TestAllTypesProto3;
      }

      export interface ForeignMessage {
        c?: number;
      }

      export interface NullHypothesisProto3 {}

      export interface EnumOnlyProto3 {}

      export const enum EnumOnlyProto3_Bool {
        kFalse = 'kFalse',
        kTrue = 'kTrue',
      }
      "
    `);
    const protoOutput = readFileSync(join(__dirname, 'test.ts'), { encoding: 'utf8' });
    expect(protoOutput).toMatchInlineSnapshot(`
      "/* eslint-disable */
      import { NullValue, Struct, Value, ListValue } from './google/protobuf/struct';
      import {
        BoolValue,
        Int32Value,
        Int64Value,
        UInt32Value,
        UInt64Value,
        FloatValue,
        DoubleValue,
        StringValue,
        BytesValue,
      } from './google/protobuf/wrappers';
      import { Duration } from './google/protobuf/duration';
      import { Timestamp } from './google/protobuf/timestamp';
      import { FieldMask } from './google/protobuf/field_mask';
      import { Any } from './google/protobuf/any';

      export const protobufPackage = 'protobuf_test_messages.proto3';

      export const enum ForeignEnum {
        FOREIGN_FOO = 'FOREIGN_FOO',
        FOREIGN_BAR = 'FOREIGN_BAR',
        FOREIGN_BAZ = 'FOREIGN_BAZ',
      }

      /**
       * This proto includes every type of field in both singular and repeated
       * forms.
       *
       * Also, crucially, all messages and enums in this file are eventually
       * submessages of this message.  So for example, a fuzz test of TestAllTypes
       * could trigger bugs that occur in any message type in this file.  We verify
       * this stays true in a unit test.
       */
      export interface TestAllTypesProto3 {
        /** Singular */
        optionalInt32?: number;
        optionalInt64?: string;
        optionalUint32?: number;
        optionalUint64?: string;
        optionalSint32?: number;
        optionalSint64?: string;
        optionalFixed32?: number;
        optionalFixed64?: string;
        optionalSfixed32?: number;
        optionalSfixed64?: string;
        optionalFloat?: number;
        optionalDouble?: number;
        optionalBool?: boolean;
        optionalString?: string;
        optionalBytes?: Uint8Array;
        optionalNestedMessage?: TestAllTypesProto3_NestedMessage;
        optionalForeignMessage?: ForeignMessage;
        optionalNestedEnum?: TestAllTypesProto3_NestedEnum;
        optionalForeignEnum?: ForeignEnum;
        optionalAliasedEnum?: TestAllTypesProto3_AliasedEnum;
        optionalStringPiece?: string;
        optionalCord?: string;
        recursiveMessage?: TestAllTypesProto3;
        /** Repeated */
        repeatedInt32?: number[];
        repeatedInt64?: string[];
        repeatedUint32?: number[];
        repeatedUint64?: string[];
        repeatedSint32?: number[];
        repeatedSint64?: string[];
        repeatedFixed32?: number[];
        repeatedFixed64?: string[];
        repeatedSfixed32?: number[];
        repeatedSfixed64?: string[];
        repeatedFloat?: number[];
        repeatedDouble?: number[];
        repeatedBool?: boolean[];
        repeatedString?: string[];
        repeatedBytes?: Uint8Array[];
        repeatedNestedMessage?: TestAllTypesProto3_NestedMessage[];
        repeatedForeignMessage?: ForeignMessage[];
        repeatedNestedEnum?: TestAllTypesProto3_NestedEnum[];
        repeatedForeignEnum?: ForeignEnum[];
        repeatedStringPiece?: string[];
        repeatedCord?: string[];
        /** Packed */
        packedInt32?: number[];
        packedInt64?: string[];
        packedUint32?: number[];
        packedUint64?: string[];
        packedSint32?: number[];
        packedSint64?: string[];
        packedFixed32?: number[];
        packedFixed64?: string[];
        packedSfixed32?: number[];
        packedSfixed64?: string[];
        packedFloat?: number[];
        packedDouble?: number[];
        packedBool?: boolean[];
        packedNestedEnum?: TestAllTypesProto3_NestedEnum[];
        /** Unpacked */
        unpackedInt32?: number[];
        unpackedInt64?: string[];
        unpackedUint32?: number[];
        unpackedUint64?: string[];
        unpackedSint32?: number[];
        unpackedSint64?: string[];
        unpackedFixed32?: number[];
        unpackedFixed64?: string[];
        unpackedSfixed32?: number[];
        unpackedSfixed64?: string[];
        unpackedFloat?: number[];
        unpackedDouble?: number[];
        unpackedBool?: boolean[];
        unpackedNestedEnum?: TestAllTypesProto3_NestedEnum[];
        /** Map */
        mapInt32Int32?: { [key: string]: number };
        mapInt64Int64?: { [key: string]: string };
        mapUint32Uint32?: { [key: string]: number };
        mapUint64Uint64?: { [key: string]: string };
        mapSint32Sint32?: { [key: string]: number };
        mapSint64Sint64?: { [key: string]: string };
        mapFixed32Fixed32?: { [key: string]: number };
        mapFixed64Fixed64?: { [key: string]: string };
        mapSfixed32Sfixed32?: { [key: string]: number };
        mapSfixed64Sfixed64?: { [key: string]: string };
        mapInt32Float?: { [key: string]: number };
        mapInt32Double?: { [key: string]: number };
        mapBoolBool?: { [key: string]: boolean };
        mapStringString?: { [key: string]: string };
        mapStringBytes?: { [key: string]: Uint8Array };
        mapStringNestedMessage?: { [key: string]: TestAllTypesProto3_NestedMessage };
        mapStringForeignMessage?: { [key: string]: ForeignMessage };
        mapStringNestedEnum?: { [key: string]: TestAllTypesProto3_NestedEnum };
        mapStringForeignEnum?: { [key: string]: ForeignEnum };
        oneofUint32?: number;
        oneofNestedMessage?: TestAllTypesProto3_NestedMessage;
        oneofString?: string;
        oneofBytes?: Uint8Array;
        oneofBool?: boolean;
        oneofUint64?: string;
        oneofFloat?: number;
        oneofDouble?: number;
        oneofEnum?: TestAllTypesProto3_NestedEnum;
        oneofNullValue?: NullValue;
        /** Well-known types */
        optionalBoolWrapper?: BoolValue;
        optionalInt32Wrapper?: Int32Value;
        optionalInt64Wrapper?: Int64Value;
        optionalUint32Wrapper?: UInt32Value;
        optionalUint64Wrapper?: UInt64Value;
        optionalFloatWrapper?: FloatValue;
        optionalDoubleWrapper?: DoubleValue;
        optionalStringWrapper?: StringValue;
        optionalBytesWrapper?: BytesValue;
        repeatedBoolWrapper?: BoolValue[];
        repeatedInt32Wrapper?: Int32Value[];
        repeatedInt64Wrapper?: Int64Value[];
        repeatedUint32Wrapper?: UInt32Value[];
        repeatedUint64Wrapper?: UInt64Value[];
        repeatedFloatWrapper?: FloatValue[];
        repeatedDoubleWrapper?: DoubleValue[];
        repeatedStringWrapper?: StringValue[];
        repeatedBytesWrapper?: BytesValue[];
        optionalDuration?: Duration;
        optionalTimestamp?: Timestamp;
        optionalFieldMask?: FieldMask;
        optionalStruct?: Struct;
        optionalAny?: Any;
        optionalValue?: Value;
        optionalNullValue?: NullValue;
        repeatedDuration?: Duration[];
        repeatedTimestamp?: Timestamp[];
        repeatedFieldmask?: FieldMask[];
        repeatedStruct?: Struct[];
        repeatedAny?: Any[];
        repeatedValue?: Value[];
        repeatedListValue?: ListValue[];
        /**
         * Test field-name-to-JSON-name convention.
         * (protobuf says names can be any valid C/C++ identifier.)
         */
        fieldname1?: number;
        fieldName2?: number;
        FieldName3?: number;
        fieldName4?: number;
        field0name5?: number;
        field0Name6?: number;
        fieldName7?: number;
        FieldName8?: number;
        fieldName9?: number;
        FieldName10?: number;
        FieldName11?: number;
        FieldName12?: number;
        FieldName13?: number;
        FieldName14?: number;
        fieldName15?: number;
        fieldName16?: number;
        fieldName17?: number;
        FieldName18?: number;
      }

      export const enum TestAllTypesProto3_NestedEnum {
        FOO = 'FOO',
        BAR = 'BAR',
        BAZ = 'BAZ',
        /** NEG - Intentionally negative. */
        NEG = 'NEG',
      }

      export const enum TestAllTypesProto3_AliasedEnum {
        ALIAS_FOO = 'ALIAS_FOO',
        ALIAS_BAR = 'ALIAS_BAR',
        ALIAS_BAZ = 'ALIAS_BAZ',
        QUX = 'QUX',
        qux = 'qux',
        bAz = 'bAz',
      }

      export interface TestAllTypesProto3_NestedMessage {
        a?: number;
        corecursive?: TestAllTypesProto3;
      }

      export interface ForeignMessage {
        c?: number;
      }

      export interface NullHypothesisProto3 {}

      export interface EnumOnlyProto3 {}

      export const enum EnumOnlyProto3_Bool {
        kFalse = 'kFalse',
        kTrue = 'kTrue',
      }
      "
    `);
  });
});
