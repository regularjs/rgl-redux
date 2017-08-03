import expect from 'expect.js'
import * as util from '../src/util.js';

describe('Util', () => {
  
  describe('typeOf', () => {
    it('typeOf("string") === "string"', () => {
      expect(util.typeOf('string')).to.be('string');
    })
    it('typeOf(1) === "number"', () => {
      expect(util.typeOf(1)).to.be('number');
    })
    it('typeOf(true) === "boolean"', () => {
      expect(util.typeOf(true)).to.be('boolean');
    })
    it('typeOf([1, 2, 3]) === "array"', () => {
      expect(util.typeOf([1, 2, 3])).to.be('array');
    })
    it('typeOf({}) === "object"', () => {
      expect(util.typeOf({})).to.be('object');
    })
    it('typeOf(function(){}) === "function"', () => {
      expect(util.typeOf(function(){})).to.be('function');
    })
    it('typeOf(undefined) === "undefined"', () => {
      expect(util.typeOf(undefined)).to.be('undefined');
    })
    it('typeOf(null) === "null"', () => {
      expect(util.typeOf(null)).to.be('null');
    })
    it('typeOf(/regexp/) === "regexp"', () => {
      expect(util.typeOf(/regexp/)).to.be('regexp');
    })
  });

  describe('isEmpty', () => {
    it('isEmpty([]) === true', () => {
      expect(util.isEmpty([])).to.be(true);
    })
    it('isEmpty([1]) === false', () => {
      expect(util.isEmpty([1])).to.be(false);
    })
    it('isEmpty([undefined]) === false', () => {
      expect(util.isEmpty([undefined])).to.be(false);
    })
    it('isEmpty({}) === true', () => {
      expect(util.isEmpty({})).to.be(true);
    })
    it('isEmpty({key: true}) === false', () => {
      expect(util.isEmpty({key: true})).to.be(false);
    })
    it('when the param is not array or object: isEmpty(1) === true', () => {
      expect(util.isEmpty(1)).to.be(true);
    })
  });

  describe('clone', () => {
    it('clone an object', () => {
      var a = {b: {c: 1}};
      var b = util.clone(a);
      expect(b).to.eql(a);
      expect(b).not.to.be(a);
      expect(b.b).to.be(a.b);
    })
    it('clone an array', () => {
      var a = [1, 2, {key: true}];
      var b = util.clone(a);
      expect(b).to.eql(a);
      expect(b).not.to.be(a);
      expect(b[2]).to.be(a[2]);
    })
    it('clone not array or object', () => {
      var a = null;
      var b = util.clone(a);
      expect(b).to.be(a);
    })
  });

  describe('extend', () => {
    it('when one of the first two parameters is not an object, return the first parameter', () => {
      var a = {a: 1};
      var b = 2;
      var c = util.extend(a, b);
      expect(c).to.be(a);
    })
    it("when the two object has the same property, the extend of this property doesn't work", () => {
      var a = {a: 1};
      var b = {a: 2};
      util.extend(a, b);
      expect(a).to.eql({a: 1});
    })
    it("when the two object has the different properties, it will be extended", () => {
      var a = {a: 1};
      var b = {b: 2};
      util.extend(a, b);
      expect(a).to.eql({a: 1, b: 2});
    })
    it("when the third parameter is true, it equals to Object.assign()", () => {
      var a = {a: 1};
      var b = {a: 2};
      util.extend(a, b, true);
      expect(a).to.eql({a: 2});
    })
  });

  describe('forEachValue', () => {
    it('it should traverse all the properties of the object', () => {
      var a = {
        one: 1,
        two: 2,
        three: {
          a: 2
        }
      }
      let count = 0
      util.forEachValue(a, (item, key) => {
        count++;
        expect(item).to.be(a[key])
      })
      expect(count).to.be(3)
    })
    it('when the first parameter is not an object, it should does not work', () => {
      var a = [1, 2, 3]
      let count = 0
      util.forEachValue(a, (item, key) => {
        count++;
      })
      expect(count).to.be(0)
    })
  });

  describe('assert', () => {
    it('when the condition is true, it should not throw an error', () => {
      expect(util.assert).withArgs(true, 'error message').to.not.throwError()
    })
    it('when the condition is false, it should throw an error', () => {
      expect(util.assert).withArgs(false, 'error message').to.throwError()
    })
    it('when the third parameter is "warn", it will just log a warning', () => {
      expect(util.assert).withArgs(false, 'warning message', 'warn').to.not.throwError()
    })
  });

});
