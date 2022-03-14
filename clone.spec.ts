import { clone } from './clone'

it('should support circular', () => {
  const a = {val:2};
  a.target = a;
  let newA = clone(a);
  expect(newA.target).toBe(newA)
  expect(newA.val).toBe(2)
})

it('should support class object', () => {
  class A{
    foo = 1
    bar(){
      return this.foo
    }
  }
  const a = new A()
  const b = clone(a)
  expect(b).not.toBe(a)
  expect(b.foo).toBe(1)
  expect(b.bar()).toBe(1)
  expect(b).toBeInstanceOf(A)
})
