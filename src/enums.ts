import { code, def, Code, joinCode } from 'ts-poet';
import { EnumDescriptorProto } from 'ts-proto-descriptors';
import { maybeAddComment } from './utils';
import SourceInfo, { Fields } from './sourceInfo';
import { Context } from './context';

// Output the `enum { Foo, A = "A", B = "B" }`
export function generateEnum(
  ctx: Context,
  fullName: string,
  enumDesc: EnumDescriptorProto,
  sourceInfo: SourceInfo
): Code {
  const chunks: Code[] = [];

  maybeAddComment(sourceInfo, chunks, enumDesc.options?.deprecated);
  chunks.push(code`export const enum ${def(fullName)} {`);

  enumDesc.value.forEach((valueDesc, index) => {
    const info = sourceInfo.lookup(Fields.enum.value, index);
    maybeAddComment(info, chunks, valueDesc.options?.deprecated, `${valueDesc.name} - `);
    chunks.push(
      code`${valueDesc.name} = "${valueDesc.name}",`
    );
  });

  chunks.push(code`}`);

  return joinCode(chunks, { on: '\n' });
}