import {DescriptorProto, EnumDescriptorProto, FileDescriptorProto,} from 'ts-proto-descriptors';
import SourceInfo, {Fields} from './sourceInfo';
import {snakeToCamel} from './case';

type MessageVisitor = (
  fullName: string,
  desc: DescriptorProto,
  sourceInfo: SourceInfo,
  fullProtoTypeName: string
) => void;

type EnumVisitor = (
  fullName: string,
  desc: EnumDescriptorProto,
  sourceInfo: SourceInfo,
  fullProtoTypeName: string
) => void;

export function visit(
  proto: FileDescriptorProto | DescriptorProto,
  sourceInfo: SourceInfo,
  messageFn: MessageVisitor,
  enumFn: EnumVisitor = () => {},
  tsPrefix: string = '',
  protoPrefix: string = ''
): void {
  const isRootFile = 'syntax' in proto;
  const childEnumType = isRootFile ? Fields.file.enum_type : Fields.message.enum_type;

  proto.enumType.forEach((enumDesc, index) => {
    // I.e. Foo_Bar.Zaz_Inner
    const protoFullName = protoPrefix + enumDesc.name;
    // I.e. FooBar_ZazInner
    const tsFullName = tsPrefix + snakeToCamel(enumDesc.name);
    const nestedSourceInfo = sourceInfo.open(childEnumType, index);
    enumFn(tsFullName, enumDesc, nestedSourceInfo, protoFullName);
  });

  const messages = 'messageType' in proto ? proto.messageType : proto.nestedType;
  const childType = isRootFile ? Fields.file.message_type : Fields.message.nested_type;

  messages.forEach((message, index) => {
    // I.e. Foo_Bar.Zaz_Inner
    const protoFullName = protoPrefix + message.name;
    // I.e. FooBar_ZazInner
    const tsFullName = tsPrefix + snakeToCamel(messageName(message));
    const nestedSourceInfo = sourceInfo.open(childType, index);
    messageFn(tsFullName, message, nestedSourceInfo, protoFullName);
    visit(message, nestedSourceInfo, messageFn, enumFn, tsFullName + '_', protoFullName + '.');
  });
}

const builtInNames = ['Date'];

/** Potentially suffixes `Message` to names to avoid conflicts, i.e. with `Date`. */
function messageName(message: DescriptorProto): string {
  const { name } = message;
  return builtInNames.includes(name) ? `${name}Message` : name;
}