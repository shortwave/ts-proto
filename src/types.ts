import {
  CodeGeneratorRequest,
  DescriptorProto,
  EnumDescriptorProto,
  FieldDescriptorProto,
  FieldDescriptorProto_Label,
  FieldDescriptorProto_Type,
} from 'ts-proto-descriptors';
import {code, Code, imp} from 'ts-poet';
import {visit} from './visit';
import {fail} from './utils';
import SourceInfo from './sourceInfo';
import {Context} from './context';

/** Returns the type name without any repeated/required/etc. labels. */
export function basicTypeName(
  ctx: Context,
  field: FieldDescriptorProto,
): Code {
  switch (field.type) {
    case FieldDescriptorProto_Type.TYPE_DOUBLE:
    case FieldDescriptorProto_Type.TYPE_FLOAT:
    case FieldDescriptorProto_Type.TYPE_INT32:
    case FieldDescriptorProto_Type.TYPE_UINT32:
    case FieldDescriptorProto_Type.TYPE_SINT32:
    case FieldDescriptorProto_Type.TYPE_FIXED32:
    case FieldDescriptorProto_Type.TYPE_SFIXED32:
      return code`number`;
    case FieldDescriptorProto_Type.TYPE_INT64:
    case FieldDescriptorProto_Type.TYPE_UINT64:
    case FieldDescriptorProto_Type.TYPE_SINT64:
    case FieldDescriptorProto_Type.TYPE_FIXED64:
    case FieldDescriptorProto_Type.TYPE_SFIXED64:
      // this handles 2^53, Long is only needed for 2^64; this is effectively pbjs's forceNumber
      return code`string`;
    case FieldDescriptorProto_Type.TYPE_BOOL:
      return code`boolean`;
    case FieldDescriptorProto_Type.TYPE_STRING:
      return code`string`;
    case FieldDescriptorProto_Type.TYPE_BYTES:
      return code`Uint8Array`;
    case FieldDescriptorProto_Type.TYPE_MESSAGE:
    case FieldDescriptorProto_Type.TYPE_ENUM:
      return messageToTypeName(ctx, field.typeName);
    default:
      return code`${field.typeName}`;
  }
}

/** A map of proto type name, e.g. `foo.Message.Inner`, to module/class name, e.g. `foo`, `Message_Inner`. */
export type TypeMap = Map<string, [string, string, DescriptorProto | EnumDescriptorProto]>;

/** Scans all of the proto files in `request` and builds a map of proto typeName -> TS module/name. */
export function createTypeMap(request: CodeGeneratorRequest): TypeMap {
  const typeMap: TypeMap = new Map();
  for (const file of request.protoFile) {
    // We assume a file.name of google/protobuf/wrappers.proto --> a module path of google/protobuf/wrapper.ts
    const moduleName = file.name.replace('.proto', '');
    // So given a fullName like FooMessage_InnerMessage, proto will see that as package.name.FooMessage.InnerMessage
    function saveMapping(
      tsFullName: string,
      desc: DescriptorProto | EnumDescriptorProto,
      s: SourceInfo,
      protoFullName: string
    ): void {
      // package is optional, but make sure we have a dot-prefixed type name either way
      const prefix = file.package.length === 0 ? '' : `.${file.package}`;
      typeMap.set(`${prefix}.${protoFullName}`, [moduleName, tsFullName, desc]);
    }
    visit(file, SourceInfo.empty(), saveMapping, saveMapping);
  }
  return typeMap;
}

function isRepeated(field: FieldDescriptorProto): boolean {
  return field.label === FieldDescriptorProto_Label.LABEL_REPEATED;
}

/** Maps `.some_proto_namespace.Message` to a TypeName. */
export function messageToTypeName(ctx: Context, protoType: string): Code {
  const { typeMap } = ctx;
  const [module, type] = toModuleAndType(typeMap, protoType);
  return code`${imp(`${type}@./${module}`)}`;
}

/** Breaks `.some_proto_namespace.Some.Message` into `['some_proto_namespace', 'Some_Message', Descriptor]. */
function toModuleAndType(typeMap: TypeMap, protoType: string): [string, string, DescriptorProto | EnumDescriptorProto] {
  return typeMap.get(protoType) || fail(`No type found for ${protoType}`);
}

/** Return the TypeName for any field (primitive/message/etc.) as exposed in the interface. */
export function toTypeName(ctx: Context, messageDesc: DescriptorProto, field: FieldDescriptorProto): Code {
  let type = basicTypeName(ctx, field);
  if (isRepeated(field)) {
    const mapType = detectMapType(ctx, messageDesc, field);
    if (mapType) {
      const { keyType, valueType } = mapType;
      return code`{ [key: ${keyType} ]: ${valueType} }`;
    }
    return code`${type}[]`;
  }
  return type;
}

export function detectMapType(
  ctx: Context,
  messageDesc: DescriptorProto,
  fieldDesc: FieldDescriptorProto
): { messageDesc: DescriptorProto; keyType: Code; valueType: Code } | undefined {
  const { typeMap } = ctx;
  if (
    fieldDesc.label === FieldDescriptorProto_Label.LABEL_REPEATED &&
    fieldDesc.type === FieldDescriptorProto_Type.TYPE_MESSAGE
  ) {
    const mapType = typeMap.get(fieldDesc.typeName)![2] as DescriptorProto;
    if (!mapType.options?.mapEntry) return undefined;
    const keyType = code`string`;
    // use basicTypeName because we don't need the '| undefined'
    const valueType = basicTypeName(ctx, mapType.field[1]);
    return { messageDesc: mapType, keyType, valueType };
  }
  return undefined;
}