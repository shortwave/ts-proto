import {code, Code, def, joinCode} from 'ts-poet';
import {DescriptorProto, FileDescriptorProto,} from 'ts-proto-descriptors';
import {toTypeName,} from './types';
import SourceInfo, {Fields} from './sourceInfo';
import {maybeAddComment, maybePrefixPackage} from './utils';
import {snakeToCamel} from './case';
import {generateEnum} from './enums';
import {visit} from './visit';
import {Context} from './context';

export function generateFile(ctx: Context, fileDesc: FileDescriptorProto): [string, Code] {
  // Google's protofiles are organized like Java, where package == the folder the file
  // is in, and file == a specific service within the package. I.e. you can have multiple
  // company/foo.proto and company/bar.proto files, where package would be 'company'.
  //
  // We'll match that structure by setting up the module path as:
  //
  // company/foo.proto --> company/foo.ts
  // company/bar.proto --> company/bar.ts
  //
  // We'll also assume that the fileDesc.name is already the `company/foo.proto` path, with
  // the package already implicitly in it, so we won't re-append/strip/etc. it out/back in.
  const moduleName = fileDesc.name.replace('.proto', '.ts');
  const chunks: Code[] = [];

  // Indicate this file's source protobuf package for reflective use with google.protobuf.Any
  chunks.push(code`export const protobufPackage = '${fileDesc.package}';`);

  // Syntax, unlike most fields, is not repeated and thus does not use an index
  const sourceInfo = SourceInfo.fromDescriptor(fileDesc);
  const headerComment = sourceInfo.lookup(Fields.file.syntax, undefined);
  maybeAddComment(headerComment, chunks, fileDesc.options?.deprecated);

  // first make all the type declarations
  visit(
    fileDesc,
    sourceInfo,
    (fullName, message, sInfo, fullProtoTypeName) => {
      chunks.push(
        generateInterfaceDeclaration(ctx, fullName, message, sInfo, maybePrefixPackage(fileDesc, fullProtoTypeName))
      );
    },
    (fullName, enumDesc, sInfo, fullProtoTypeName) => {
      chunks.push(generateEnum(ctx, fullName, enumDesc, sInfo, maybePrefixPackage(fileDesc, fullProtoTypeName)));
    }
  );
  return [moduleName, joinCode(chunks, { on: '\n\n' })];
}

// Create the interface with properties
function generateInterfaceDeclaration(
  ctx: Context,
  fullName: string,
  messageDesc: DescriptorProto,
  sourceInfo: SourceInfo,
  fullProtoTypeName: string,
): Code {
  if (messageDesc.options?.mapEntry) return code``;

  const chunks: Code[] = [];

  maybeAddComment(sourceInfo, chunks, messageDesc.options?.deprecated);
  const wellKnownProto = generateWellKnownProto(fullProtoTypeName);
  if (wellKnownProto) {
    chunks.push(wellKnownProto);
  } else {
    // interface name should be defined to avoid import collisions
    chunks.push(code`export interface ${def(fullName)} {`);

    messageDesc.field.forEach((fieldDesc, index) => {
      const info = sourceInfo.lookup(Fields.message.field, index);
      maybeAddComment(info, chunks, fieldDesc.options?.deprecated);

      const name = snakeToCamel(fieldDesc.name);
      const type = toTypeName(ctx, messageDesc, fieldDesc);
      chunks.push(code`${name}?: ${type}, `);
    });

    chunks.push(code`}`);
  }
  return joinCode(chunks, { on: '\n' });
}

function generateWellKnownProto(fullProtoTypeName: string): Code | null {
  switch (fullProtoTypeName) {
    case "google.protobuf.Struct":
      return code`export type Struct = {[key: string]: unknown};`;
    case "google.protobuf.Value":
      return code`export type Value = unknown;`;
    case "google.protobuf.ListValue":
      return code`export type ListValue = unknown[];`;
    default:
      return null;
  }
}