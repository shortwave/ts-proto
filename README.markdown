[![npm](https://img.shields.io/npm/v/@shortwave/ts-proto)](https://www.npmjs.com/package/@shortwave//ts-proto)

# ts-proto

> `ts-proto` transforms your `.proto` files into strongly-typed, idiomatic TypeScript type definitions!

# Overview

ts-proto generates TypeScript types from protobuf schemas.

I.e. given a `person.proto` schema like:

```proto
message Person {
  string name = 1;
}
```

ts-proto will generate a `person.ts` file like:

```typescript
interface Person {
  name?: string
}
```

# QuickStart

- `npm install ts-proto`
- `protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=. ./simple.proto`
  - (Note that the output parameter name, `ts_proto_out`, is named based on the suffix of the plugin's name, i.e. "ts_proto" suffix in the `--plugin=./node_modules/.bin/protoc-gen-ts_proto` parameter becomes the `_out` prefix, per `protoc`'s CLI conventions.)
  - On Windows, use `protoc --plugin=protoc-gen-ts_proto=.\node_modules\.bin\protoc-gen-ts_proto.cmd --ts_proto_out=. ./simple.proto`
  - Ensure you're using a modern `protoc`, i.e. the original `protoc` `3.0.0` doesn't support the `_opt` flag

This will generate `*.ts` source files for the given `*.proto` types.

If you want to package these source files into an npm package to distribute to clients, just run `tsc` on them as usual to generate the `.js`/`.d.ts` files, and deploy the output as a regular npm package.


# Meta

This project is a fork of the excellent [ts-proto](https://github.com/stephenh/ts-proto) project, but only outputs some opinionated typescript definition files.