import { code, def, Code, joinCode } from 'ts-poet';
import { EnumDescriptorProto } from 'ts-proto-descriptors';
import { maybeAddComment } from './utils';
import SourceInfo, { Fields } from './sourceInfo';
import { Context } from './context';

// Output the `const enum { Foo, A = "A", B = "B" }`
export function generateEnum(
  ctx: Context,
  fullName: string,
  enumDesc: EnumDescriptorProto,
  sourceInfo: SourceInfo,
  fullProtoTypeName: string,
): Code {
  const chunks: Code[] = [];

  maybeAddComment(sourceInfo, chunks, enumDesc.options?.deprecated);

  const wellKnownProtoEnum = generateWellKnownProtoEnum(fullProtoTypeName)
  if (wellKnownProtoEnum) {
    chunks.push(wellKnownProtoEnum)
  } else {
    chunks.push(code`export const enum ${def(fullName)} {`);

    enumDesc.value.forEach((valueDesc, index) => {
      const info = sourceInfo.lookup(Fields.enum.value, index);
      maybeAddComment(info, chunks, valueDesc.options?.deprecated, `${valueDesc.name} - `);
      chunks.push(
        code`${valueDesc.name} = "${valueDesc.name}",`
      );
    });

    chunks.push(code`}`);
  }

  return joinCode(chunks, { on: '\n' });
}

function generateWellKnownProtoEnum(fullProtoTypeName: string): Code | null {
  switch (fullProtoTypeName) {
    case "google.protobuf.NullValue":
      return code`export type NullValue = null;`;
    default:
      return null;
  }
}
