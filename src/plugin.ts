import {CodeGeneratorRequest, CodeGeneratorResponse, CodeGeneratorResponse_Feature,} from 'ts-proto-descriptors';
import {promisify} from 'util';
import {prefixDisableLinter, protoFilesToGenerate, readToBuffer} from './utils';
import {generateFile} from './main';
import {createTypeMap} from './types';
import {Context} from './context';

// this would be the plugin called by the protoc compiler
async function main() {
  const stdin = await readToBuffer(process.stdin);
  // const json = JSON.parse(stdin.toString());
  // const request = CodeGeneratorRequest.fromObject(json);
  const request = CodeGeneratorRequest.decode(stdin);

  const typeMap = createTypeMap(request);
  const ctx: Context = { typeMap };

  const filesToGenerate = protoFilesToGenerate(request);
  const files = await Promise.all(
    filesToGenerate.map(async (file) => {
      const [path, code] = generateFile(ctx, file);
      const spec = await code.toStringWithImports({ path });
      return { name: path, content: prefixDisableLinter(spec) };
    })
  );

  const response = CodeGeneratorResponse.fromPartial({
    file: files,
    supportedFeatures: CodeGeneratorResponse_Feature.FEATURE_PROTO3_OPTIONAL,
  });
  const buffer = CodeGeneratorResponse.encode(response).finish();
  const write = promisify(process.stdout.write as (buffer: Buffer) => boolean).bind(process.stdout);
  await write(Buffer.from(buffer));
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    process.stderr.write('FAILED!');
    process.stderr.write(e.message);
    process.stderr.write(e.stack);
    process.exit(1);
  });
