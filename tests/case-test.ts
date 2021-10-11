import { snakeToCamel } from '../src/case';

describe('case', () => {
  it('converts snake to camel by default', () => {
    expect(snakeToCamel('foo_bar')).toEqual('fooBar');
  });

  it('de-upper cases', () => {
    expect(snakeToCamel('FOO_BAR')).toEqual('FooBar');
  });

  it('leaves the first character as it was', () => {
    expect(snakeToCamel('Foo_Bar')).toEqual('FooBar');
  });

  it('does nothing is already camel', () => {
    expect(snakeToCamel('FooBar')).toEqual('FooBar');
  });

  // deal with original protoc which converts
  // _uuid -> Uuid
  // __uuid -> Uuid
  // _uuid_foo -> UuidFoo
  it('converts snake to camel with first underscore', () => {
    expect(snakeToCamel('_uuid')).toEqual('Uuid');
  });

  it('converts snake to camel with first double underscore', () => {
    expect(snakeToCamel('__uuid')).toEqual('Uuid');
  });

  it('converts snake to camel with first underscore and camelize other', () => {
    expect(snakeToCamel('_uuid_foo')).toEqual('UuidFoo');
  });
});
