import ModuleManager from './module/manager';
import { forEachValue, assert, typeOf } from './util';
import { createStore, applyMiddleware} from 'redux';
import createReducer from './reducer/creator';

export default class Store {

  constructor(options = {}) {
    
    let {
      name = 'rex',
      size = 1024,
      undoable = true,
      modifiers = [],
      middlewares = []
    } = options;

    //base config
    this.name = name;
    this.size = size;
    this.undoable = !!undoable;
    this.modifiers = modifiers;
    this.middlewares = middlewares;
    
    //install modules
    this.modules = new ModuleManager(options);

    //collect reducer
    this.reducers = Object.create(null);
    this.modules.forEachModule((module) => {
      forEachValue(module.reducers, (reducer, name) => {
        assert(
          !this.reducers[name], 
          `name of reducer must be unique, there is already a reducer named '${name}' existing.`
        )
        this.reducers[name] = {
          path: module.path.slice(),
          handler: reducer
        }
      })
    })
    //add the replace state reducer
    this.reducers['@replace/state'] = {
      path: [],
      handler(state, payload) {
        return payload.state;
      }
    }

    //deal with the middlewares
    middlewares = middlewares.map(fn => middlewareWrapper(this, fn));

    this.store = createStore(createReducer(this), this.modules.state, applyMiddleware(...middlewares));
  }

  /**
   * to dispatch an action
   * @param {String|Function} type, the type of reducer or a function
   * @param {Ojbect} payload 
   */
  dispatch(type, payload = {}) {
    //for build-in reducer
    if (type === 'undo' || type === 'redo') {
      return this[type](payload);
    }
    if (type === '@init/state') {
      return this.replaceState(this.modules.state, {clean: true});
    }
    if (typeOf(type) === 'function') {
      return type(this.dispatch.bind(this));
    }
    assert(typeOf(type) === 'string', 'the type of a reducer must be a string.');
    let reducer = this.reducers[type];
    if (reducer) {
      let action = {type, payload};
      ['replace', 'action', 'clean', 'record'].forEach((v) => {action[v] = payload[v]});
      return this.store.dispatch(action);
    }
    assert(false, `the reducer ${type} is not found in reducers list.`)
  }

  /**
   * subscribe the dispatch of store
   * @param {Function} fn--the callback handler
   * @return {Function} the unsubscribe of this subscribe
   */
  subscribe(fn) {
    return this.store.subscribe(fn);
  }

  /**
   * redo
   * @param {Object} payload 
   */
  redo(payload) {
    if (!this.undoable) {
      return assert(false, `can't redo because of the config.undoable is false`, 'warn');
    }
    if (this.canRedo()) {
      this.store.dispatch({
        type: `${this.name}_REDO`,
        payload
      })
    }
  }

  /**
   * undo
   * @param {Object} payload 
   */
  undo(payload) {
    if (!this.undoable) {
      return assert(false, `can't undo because of the config.undoable is false`, 'warn');
    }
    if (this.canUndo()) {
      this.store.dispatch({
        type: `${this.name}_UNDO`,
        payload
      })
    }
  }

  /**
   * if can undo
   */
  canUndo() {
    if (!this.undoable) return false;
    let {timeline, index} = this.store.getState();
    return index !== 0 && !!timeline.length;
  }

  /**
   * if can redo
   */
  canRedo() {
    if (!this.undoable) return false;
    let {timeline, index} = this.store.getState();
    return !!timeline.length && index !== timeline.length - 1;
  }

  /**
   * replace state
   * @param {*} state 
   * @param {*} action 
   */
  replaceState(state, action) {
    action = Object.assign({}, action, {
      type: '@replace/state',
      payload: {state}
    })
    this.store.dispatch(action);
  }

  /**
   * get the state
   */
  getState() {
    let state = this.store.getState();
    return this.undoable ? state.current : state;
  }

  get state() {
    return this.getState();
  }

}

/**
 * to wrap a function into middleware for redux
 * @param {Store instance} store 
 * @param {Function} fn
 */
function middlewareWrapper(store, fn) {
  return reduxStore => next => action => {
    let nextFn = () => next(action);
    let context = {
      dispatch: store.dispatch.bind(store),
      getState: store.getState.bind(store)
    }
    fn(context, nextFn);
  }
}