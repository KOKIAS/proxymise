const proxymise = require('..');

describe('Promise', () => {
  it('should support then', async () => {
    const promise = proxymise({
      async foo() {
        return 'bar';
      }
    });
    expect(await promise.foo().then(value => [value, 'baz'])).toEqual(['bar', 'baz']);
  });

  it('should support catch', async () => {
    const promise = proxymise({
      async foo() {
        throw new Error();
      }
    });
    expect(promise.foo().catch(() => 'catch')).resolves.toBe('catch');
  });

  it('should get value', async () => {
    const promise = proxymise(Promise.resolve('foo'));
    expect(await promise).toBe('foo');
  });

  it('should get value property', async () => {
    const promise = proxymise({
      async foo() {
        return 'bar';
      }
    });
    expect(await promise.foo().length.toString()).toBe('3');
  });

  it('should get object', async () => {
    const promise = proxymise(Promise.resolve({ foo: 'bar' }));
    expect(await promise.foo).toBe('bar');
  });

  it('should get nested object', async () => {
    const promise = proxymise(Promise.resolve({
      foo: Promise.resolve({
        bar: Promise.resolve({
          baz: 'qux'
        })
      })
    }));
    expect(await promise.foo.bar.baz).toBe('qux');
  });

  it('should apply function', async () => {
    const promise = proxymise(async () => 'foo');
    expect(await promise()).toBe('foo');
  });

  it('should apply nested function', async () => {
    const promise = proxymise(async () => ({
      async foo() {
        return {
          async bar() {
            return 'baz';
          }
        };
      }
    }));
    expect(await promise().foo().bar()).toBe('baz');
  });

  it('should get/apply object/function', async () => {
    const promise = proxymise({
      async foo() {
        return {
          bar: {
            async baz() {
              return 'qux';
            }
          }
        };
      }
    });
    expect(await promise.foo().bar.baz()).toBe('qux');
  });

  it('should support Promise.all', async () => {
    const promises = ['foo', 'bar', 'baz'].map(o => Promise.resolve(o)).map(proxymise);
    expect(await Promise.all(promises)).toEqual(['foo', 'bar', 'baz']);
  });
});
