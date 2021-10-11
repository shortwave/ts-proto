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
    const structOutput = readFileSync(join(__dirname, 'google/protobuf/struct.ts'), { encoding: 'utf8' });
    expect(structOutput).toMatchSnapshot('struct.golden.ts');
    const protoOutput = readFileSync(join(__dirname, 'test.ts'), { encoding: 'utf8' });
    expect(protoOutput).toMatchSnapshot('test.golden.ts');
  });
});
