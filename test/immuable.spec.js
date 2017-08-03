import expect from 'expect.js'
import * as im from '../src/immuable.js';

describe('Immuable', () => {
  
  describe('set', () => {
    it("the value returned should be immuable, and the origin value is not changed", () => {
      var a = {
        b: {
          c: 1
        },
        d: {
          e: 2
        }
      }
      var b = im.set(a, 'b.c', 2);
      expect(b).to.eql({b: {c: 2}, d: {e: 2}});
      expect(b).not.to.be(a);
      expect(b.b).not.to.be(a.b);
      expect(b.d).to.be(a.d);
      expect(a).to.eql({b: {c: 1}, d: {e: 2}});
      expect(a).to.be(a);
    })
    
    it("It should accept the array path", () => {
      var a = {
        b: {
          c: 1
        },
        d: {
          e: 2
        }
      }
      var b = im.set(a, ['b', 'c'], 2);
      expect(b).to.eql({b: {c: 2}, d: {e: 2}});
      expect(b).not.to.be(a);
      expect(b.b).not.to.be(a.b);
      expect(b.d).to.be(a.d);
      expect(a).to.eql({b: {c: 1}, d: {e: 2}});
      expect(a).to.be(a);
    })

    it("when the first parameter is not an object or array, it should throw an error", () => {
      expect(im.set).withArgs(1, 'a.b.c.d', 1).to.throwError();
    })
    it("when the path is wrong, it should throw an error", () => {
      var a = {
        b: {
          c: 1
        }
      }
      expect(im.set).withArgs(a, 'a.d.c', 2).to.throwError();
    })

    it("when the options.autoCreated is true and the path is wrong, it will be created by path", () => {
      var a = {
        b: {
          c: 1
        }
      }
      var b = im.set(a, 'd.c', 2, {autoCreated: true});
      expect(b).to.eql({b: {c: 1}, d: {c: 2}});
    })

    it("when the options.assign is not true and the target and value are both object, it should combine the old value and new value", () => {
      var a = {
        b: {
          c: 1
        }
      }
      var b = im.set(a, 'b', {d: 2}, true);
      expect(b).to.eql({b: {c: 1, d: 2}});
      expect(b.b).not.to.be(a.b);
      b = im.set(a, 'b', {d: 2});
      expect(b).to.eql({b: {d: 2}});
      expect(b.b).not.to.be(a.b);
    })
    
  });

  describe('get', () => {
    it("When the path is right, return the value", () => {
      var a = {
        b: {
          c: 1
        }
      }
      var b = im.get(a, 'b.c');
      expect(b).to.be(1);
      var a = [2, 3];
      var b = im.get(a, 0);
      expect(b).to.be(2)
    })
    
    it("It should accept array path", () => {
      var a = {
        b: {
          c: 1
        }
      }
      var b = im.get(a, ['b', 'c']);
      expect(b).to.be(1);
    })

    it("When the path is wrong, it should return undefined, not throwing an error", () => {
      var a = {
        b: {
          c: 1
        }
      }
      var b = im.get(a, 'd.c');
      expect(b).to.be(undefined);
    })

    it("When the target is not array or object, return undefined", () => {
      var a = 1
      var b = im.get(a, 'd.c');
      expect(b).to.be(undefined);
    })
    
  });

  describe('splice', () => {
    it("When the old value is not an array, it equals to im.get", () => {
      var a = {
        b: {
          c: 1
        }
      }
      var b = im.splice(a, 'b', 0, 1);
      expect(b).to.be(a.b);
      var a = {
        b: {
          c: [1,2,3]
        }
      }
      var b = im.splice(a, 'b.c', 0, 1, 99);
      expect(b).to.eql({b:{c:[99,2,3]}})
      expect(a).to.eql({b:{c:[1,2,3]}})
      expect(a.b).to.be(a.b)
      expect(a.b.c).to.be(a.b.c)
      expect(b.b).not.to.be(a.b)
      expect(b.b.c).not.to.be(a.b.c)
      var b = im.splice(a, 'b.c', 0, 1);
      expect(b).to.eql({b:{c:[2,3]}})
      var b = im.splice(a, 'b.c', 0, 0, 0);
      expect(b).to.eql({b:{c:[0,1,2,3]}})
    })

    
  });

});
