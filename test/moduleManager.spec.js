import expect from 'expect.js';
import ModuleManager from '../src/module/manager';
import Module from '../src/module/module';

describe('ModuleManager', () => {
  
  describe('checkState', () => {
    it("When the module has submodules but it's state is not an object, throw an error", () => {
      let a = {
        state: [1, 2, 3],
        modules: { 
          ma: {} 
        }
      }
      let c = {
        state: {},
        modules: {
          ma: {
            state: [1],
            modules: {
              mb: {}
            }
          }
        }
      }
      let fn = (config) => new ModuleManager(config);

      expect(fn).withArgs(a).to.throwError()
      expect(fn).withArgs(c).to.throwError()

    })
    it("When the module has no submodules and it's state is not an object, should not throw an error", () => {
      let b = {
        state: {},
        modules: { 
          ma: {} 
        }
      }
      let fn = (config) => new ModuleManager(config);

      expect(fn).withArgs(b).not.to.throwError()

    })
  });

  describe('combineState', () => {
    it("new ModuleManager().state equals to the combination of all modules' state", () => {
      let config = {
        state: {
          count: 0
        },
        modules: {
          components: {
            state: {
              count: 0
            }
          }
        }
      }
      let fn = (config) => new ModuleManager(config);
      expect(fn(config).state).to.eql({
        count: 0,
        components: {
          count: 0
        }
      })

    })

    it("the the part of global state should be combined(Object.assign) with module state by default", () => {
      let config = {
        state: {
          count: 0,
          components: {
            count: 99,
            other: 2
          }
        },
        modules: {
          components: {
            state: {
              count: 0
            }
          }
        }
      }
      let fn = (config) => new ModuleManager(config);
      expect(fn(config).state).to.eql({
        count: 0,
        components: {
          count: 0,
          other: 2
        }
      })

    })

    it("When the module.combineMode equals 'replace', the the part of global state should be replaced by module state", () => {
      let config = {
        state: {
          count: 0,
          components: {
            count: 99,
            other: 2
          }
        },
        modules: {
          components: {
            combineMode: 'replace',
            state: {
              count: 0
            }
          }
        }
      }
      let fn = (config) => new ModuleManager(config);
      expect(fn(config).state).to.eql({
        count: 0,
        components: {
          count: 0
        }
      })

    })

    it("When the module.combineMode equals 'extend', the the part of global state should be extended by module state", () => {
      let config = {
        state: {
          count: 0,
          components: {
            count: 99,
            other: 2
          }
        },
        modules: {
          components: {
            combineMode: 'extend',
            state: {
              count: 0,
              a: 1
            }
          }
        }
      }
      let fn = (config) => new ModuleManager(config);
      expect(fn(config).state).to.eql({
        count: 0,
        components: {
          count: 99,
          other:2,
          a: 1
        }
      })

    })
  });

  describe('register', () => {
    it('should transform the config into module tree', () => {
      let config = {
        state: {
          count: 0
        },
        modules: {
          components: {
            state: {
              count: 0
            },
            modules: {
              subComponents: {
                state: {}
              }
            }
          },
          dataModels: {
            state: []
          }
        }
      }
      let fn = (config) => new ModuleManager(config);
      expect(fn(config).root).to.a(Module);
      expect(fn(config).root.children.components).to.a(Module);
      expect(fn(config).root.children.components.children.subComponents).to.a(Module);
      expect(fn(config).root.children.dataModels).to.a(Module);
      expect(fn(config).root.children).to.only.have.keys('components', 'dataModels');
      expect(fn(config).root.children.components.children).to.only.have.key('subComponents');
      expect(fn(config).root.children.dataModels.children).to.be.empty();
    })
  })

});
