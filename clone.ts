abstract class CloneCat {
  is (val: any) {
    return false
  }

  clone (val: any) {
    return val
  }
}

class NilCloneCat extends CloneCat {
  is (val: any) {
    return val === null || val === undefined
  }
}

class NumberCloneCat extends CloneCat {
  is (val: any) {
    return typeof val === 'number'
  }
}

class StringCloneCat extends CloneCat {
  is (val: any) {
    return typeof val === 'string'
  }
}

class BooleanCloneCat extends CloneCat {
  is (val: any) {
    return typeof val === 'boolean'
  }
}

class ArrayCloneCat extends CloneCat {
  is (val: any) {
    return Array.isArray(val)
  }

  clone (val: any[]) {
    return val.map(item => clone(item))
  }
}

class ObjCloneCat extends CloneCat {
  map: WeakMap<Object, Object>

  constructor (map: WeakMap<Object, Object>) {
    super()
    this.map = map
  }

  is (val: any) {
    return typeof val === 'object' && val !== null
  }

  clone (val: Object) {
    if (this.map.has(val)) return this.map.get(val)
    const proto = Object.getPrototypeOf(val)
    const res = Object.create(proto)
    this.map.set(val, res)
    for (const [key, value] of Object.entries(val)) {
      Reflect.set(res, key, clone(value, this.map))
    }
    return res
  }
}

export const clone = (val: any, map = new WeakMap()) => {
  function * cats() {
    yield new NilCloneCat()
    yield new BooleanCloneCat()
    yield new NumberCloneCat()
    yield new StringCloneCat()
    yield new ArrayCloneCat()
    yield new ObjCloneCat(map)
  }
  for (const cat of cats()) {
    if (cat.is(val)) {
      return cat.clone(val)
    }
  }
  throw new TypeError(`typeof ${val} has not supported`)
}
