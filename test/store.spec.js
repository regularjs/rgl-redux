import expect from 'expect.js'
import Regular from 'regularjs';
import Store from '../src/store';

const common = function() {
  return {
    state: {
      count: 0
    },
    reducers: {
      countGlobal(state, payload) {
        let count = state.count;
        count++;
        return Object.assign({}, state, {count});
      }
    },
    modules: {
      components: {
        state: {
          count: 1
        },
        reducers: {
          countComponents(components, payload) {
            let count = components.count;
            count++;
            return Object.assign({}, components, {count});
          }
        }
      }
    }
  }
}
const fn = (options) => new Store(options);

describe('Store', () => {
  
  describe('initialState', () => {
    it('the state of store should be complete including the state of modules', () => {
      let configs = common();
      let store = new Store(configs);
      expect(store.state).to.be.eql({
        count: 0,
        components: {
          count: 1
        }
      })
      let fullState = store.store.getState();
      expect(fullState.timeline).to.have.length(1);
      expect(fullState.timeline[0]).to.be(fullState.current);
      expect(fullState.index).to.be(0);
      expect(fullState.changed).to.be.a('function');
      ['count', 'components', 'components.count'].forEach(path => {
        expect(fullState.changed(path)).to.be(true)
      })
    })
  })

  describe('reducers', () => {
    it("the name of reducer must be unique, otherwise the program should throw an error", () => {
      let config = {
        reducers: {
          count(){}
        },
        modules: {
          moduleA: {
            reducers: {
              count() {}
            }
          }
        }
      }
      expect(fn).withArgs(config).to.throwError()
    })

    it("store.reducers should contains all reducer", () => {
      let config = {
        reducers: {
          countOne(){}
        },
        modules: {
          moduleA: {
            reducers: {
              countTwo() {}
            }
          }
        }
      }
      expect(fn(config).reducers).to.have.keys('countOne', 'countTwo', '@replace/state');
      expect(fn(config).reducers.countTwo.path).to.be.eql(['moduleA'])
    })
  });

  describe('dispatch', () => {

    let config = common();
    let store = new Store(config);

    it("dispatch global reducer in the app", () => {
      store.reducers.countGlobal.handler = function(state, payload) {
        expect(state).to.be.eql({count: 0, components: {count: 1}});
        expect(payload).to.be.eql({test: 1});
        let count = state.count;
        count++;
        return Object.assign({}, state, {count});
      }
      
      store.dispatch('countGlobal', {test: 1});
      let state = store.state,
          fullState = store.store.getState();
      expect(state).to.be.eql({
        count: 1,
        components: {
          count: 1
        }
      });
      expect(state).to.be(fullState.current)
      expect(state).to.be(fullState.timeline[1])
      expect(fullState.timeline.length).to.be(2)
      expect(fullState.index).to.be(1)
    });

    it("dispatch undo in the app", () => {
      
      store.dispatch('undo');
      let state = store.state,
          fullState = store.store.getState();
      expect(state).to.be.eql({
        count: 0,
        components: {
          count: 1
        }
      });
      expect(state).to.be(fullState.current)
      expect(state).to.be(fullState.timeline[0])
      expect(fullState.timeline.length).to.be(2)
      expect(fullState.index).to.be(0)
    });

    it("dispatch redo in the app", () => {

      store.dispatch('redo');
      let state = store.state,
          fullState = store.store.getState();
      expect(state).to.be.eql({
        count: 1,
        components: {
          count: 1
        }
      });
      expect(state).to.be(fullState.current)
      expect(state).to.be(fullState.timeline[1])
      expect(fullState.timeline.length).to.be(2)
      expect(fullState.index).to.be(1)
    });

     it("dispatch undo/redo with steps", () => {
      let config = common();
      let store = new Store(config);
      store.dispatch('countGlobal')
      store.dispatch('countGlobal')
      store.dispatch('countGlobal')
      let state = store.state,
          fullState = store.store.getState();
      expect(state).to.be.eql({
        count: 3,
        components: {
          count: 1
        }
      });
      expect(state).to.be(fullState.current)
      expect(fullState.timeline.length).to.be(4)
      expect(fullState.index).to.be(3)
      store.dispatch('undo', {steps: 2});
      state = store.state;
      fullState = store.store.getState();
      expect(state).to.be.eql({
        count: 1,
        components: {
          count: 1
        }
      });
      expect(fullState.timeline.length).to.be(4)
      expect(fullState.index).to.be(1)
    });

    it("dispatch module reducer in the app", () => {
      store.reducers.countComponents.handler = function(state, payload) {
        expect(state).to.be.eql({count: 1});
        expect(payload).to.be.eql({test: 1});
        let count = state.count;
        count++;
        return Object.assign({}, state, {count});
      }
      
      store.dispatch('countComponents', {test: 1});
      let state = store.state,
          fullState = store.store.getState();
      expect(state).to.be.eql({
        count: 1,
        components: {
          count: 2
        }
      });
      expect(state).to.be(fullState.current)
      expect(state).to.be(fullState.timeline[2])
      expect(fullState.timeline.length).to.be(3)
      expect(fullState.index).to.be(2)
    });

    
    it("dispatch a action that not defined in the app should throw an error", () => {
      let config = common();
      let store = new Store(config);
      expect(store.dispatch).withArgs('some reducer name').to.throwError()
    });

    
    it("dispatch a action which is a function", () => {
      let config = common();
      let store = new Store(config);
      store.dispatch(function(dispatch) {
        dispatch('countGlobal')
      })
      let state = store.state,
          fullState = store.store.getState();
      expect(state).to.be.eql({
        count: 1,
        components: {
          count: 1
        }
      });
      expect(state).to.be(fullState.current)
      expect(state).to.be(fullState.timeline[1])
      expect(fullState.timeline.length).to.be(2)
      expect(fullState.index).to.be(1)
    });

    
    it("dispatch a action(object) whose type is not a string", () => {
      let config = common();
      let store = new Store(config);
      expect(store.dispatch).withArgs(1).to.throwError()
    });

    it("dispatch a action with the action.replace is true", () => {
      let config = common();
      let store = new Store(config);
      store.dispatch('countGlobal', {replace: true})
      let state = store.state,
          fullState = store.store.getState();
      expect(state).to.be.eql({
        count: 1,
        components: {
          count: 1
        }
      });
      expect(state).to.be(fullState.current)
      expect(state).to.be(fullState.timeline[0])
      expect(fullState.timeline.length).to.be(1)
      expect(fullState.index).to.be(0)
    });

    it("dispatch a action with the action.record is false", () => {
      let config = common();
      let store = new Store(config);
      store.dispatch('countGlobal')
      store.dispatch('countGlobal')
      store.dispatch('countGlobal', {record: false})
      let state = store.state,
          fullState = store.store.getState();
      expect(state).to.be.eql({
        count: 3,
        components: {
          count: 1
        }
      });
      expect(state).to.be(fullState.current)
      expect(fullState.timeline).not.to.contain(state)
      expect(fullState.timeline.length).to.be(3)
      expect(fullState.index).to.be(2)
      store.dispatch('undo');
      state = store.state;
      fullState = store.store.getState();
      expect(state).to.be.eql({
        count: 1,
        components: {
          count: 1
        }
      });
    });

    it("dispatch a action with the action.clean is true", () => {
      let config = common();
      let store = new Store(config);
      store.dispatch('countGlobal')
      store.dispatch('countGlobal')
      store.dispatch('countGlobal', {clean: true})
      let state = store.state,
          fullState = store.store.getState();
      expect(state).to.be.eql({
        count: 3,
        components: {
          count: 1
        }
      });
      expect(state).to.be(fullState.current)
      expect(fullState.timeline).to.contain(state)
      expect(fullState.timeline.length).to.be(1)
      expect(fullState.index).to.be(0)
    });

    it("dispatch a action when the config.undoable is false", () => {
      let config = common();
      config.undoable = false
      let store = new Store(config);
      store.dispatch('countGlobal');
      let state = store.state,
          fullState = store.store.getState();
      expect(state).to.be(fullState);
      expect(state.count).to.be.eql(1);
    });

    it("dispatch undo/redo when the config.undoable is false, should have a warning", () => {
      let config = common();
      config.undoable = false
      let store = new Store(config);
      store.dispatch('countGlobal');
      store.dispatch('undo')
    });

    it("dispatch @init/state", () => {
      let config = common();
      let store = new Store(config);
      store.dispatch('countGlobal');
      let state = store.state,
          fullState = store.store.getState();
      expect(state).to.be.eql({
        count: 1,
        components: {
          count: 1
        }
      });
      expect(state).to.be(fullState.current)
      store.dispatch('@init/state');
      state = store.state;
      fullState = store.store.getState();
      expect(state).to.be.eql({
        count: 0,
        components: {
          count: 1
        }
      });
      expect(fullState.timeline).to.have.length(1)
      expect(fullState.index).to.be(0)
    });


  })

  describe('canUndo', () => {

    it("when the index of timeline equals to 0, it should be false", () => {
      let config = common();
      let store = new Store(config);
      expect(store.canUndo()).to.be(false)
      store.dispatch('countGlobal');
      expect(store.canUndo()).to.be(true)
    });

    it("when config.undoable is false, it should be false", () => {
      let config = common();
      config.undoable = false
      let store = new Store(config);
      expect(store.canUndo()).to.be(false)
      store.dispatch('countGlobal');
      expect(store.canUndo()).to.be(false)
    });

  

  })

  describe('canRedo', () => {

    it("when the current state is the last state of timeline, it should be false", () => {
      let config = common();
      let store = new Store(config);
      expect(store.canRedo()).to.be(false)
      store.dispatch('countGlobal');
      store.dispatch('undo');
      expect(store.canRedo()).to.be(true)
    });

    it("when config.undoable is false, it should be false", () => {
      let config = common();
      config.undoable = false
      let store = new Store(config);
      expect(store.canRedo()).to.be(false)
      store.dispatch('countGlobal');
      store.dispatch('undo');
      expect(store.canRedo()).to.be(false)
    });

  })

  describe('middlewares', () => {

    it("the middleware function will be injected context and next", () => {
      let config = common();
      config.middlewares = [
        function(context, next) {
          expect(context.getState()).to.be.eql({count: 0, components: {count:1}});
          next();
          expect(context.getState()).to.be.eql({count: 1, components: {count:1}});
        }
      ]
      let store = new Store(config);
      store.dispatch('countGlobal');
    });

  })

  describe('modifiers', () => {

    it("to change the reducer", () => {
      let config = common();
      config.modifiers = [
        function(reducer) {
          return function(state, action) {
            return 1;
          }
        }
      ]
      let store = new Store(config);
      store.dispatch('countGlobal');
      expect(store.state).to.be(1)
    });

  })
});