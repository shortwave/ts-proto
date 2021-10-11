import { messageToTypeName, TypeMap } from '../src/types';
import { Code, code, imp } from 'ts-poet';

const fakeProto = undefined as any;

describe('types', () => {
  describe('messageToTypeName', () => {
    type TestCase = {
      descr: string;
      typeMap: TypeMap;
      protoType: string;
      expected: Code;
    };
    const testCases: Array<TestCase> = [
      {
        descr: 'top-level messages',
        typeMap: new Map([['.namespace.Message', ['namespace', 'Message', fakeProto]]]),
        protoType: '.namespace.Message',
        expected: code`${imp('Message@./namespace')}`,
      },
      {
        descr: 'nested messages',
        typeMap: new Map([['.namespace.Message.Inner', ['namespace', 'Message_Inner', fakeProto]]]),
        protoType: '.namespace.Message.Inner',
        expected: code`${imp('Message_Inner@./namespace')}`,
      },
    ];
    testCases.forEach((t) =>
      it(t.descr, async () => {
        const ctx = { ...t };
        const got = messageToTypeName(ctx, t.protoType);
        expect(await got.toStringWithImports()).toEqual(await t.expected.toStringWithImports());
      })
    );
  });
});
