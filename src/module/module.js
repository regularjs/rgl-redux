import {typeOf, isEmpty, forEachValue, assert, extend} from '../util';

export default class Module {

  /**
   * contructor of Module
   * @param {Object} rawModule--the config of this module
   * @param {Array} path--the path of this module in the module-tree
   */
  constructor(rawModule = {}, path) {
    this.children = Object.create(null);
    this.rawModule = rawModule;
    this.path = path;
    const {
      state = {},
      combineMode = 'assign'
    } = rawModule;
    this.combineMode = combineMode;
    this.state = typeOf(state) === 'function' ? state() : state;
  }

  /**
   * add a submodule to this module 
   * @param {String} key 
   * @param {Module instance} module 
   */
  addChild(key, module) {
    this.children[key] = module;
  }

  /**
   * get the submodule by key
   * @param {String} key 
   * @return {Module instance} module
   */
  getChild(key) {
    return this.children[key];
  }

  /**
   * delete a submodule by key
   * @param {String} key 
   */
  removeChild(key) {
    delete this.children[key];
  }

  /**
   * if this module have a submodule with the key;
   * when the key is undefined, meaning if having any submodule.
   * @param {String} key 
   * @return {Boolean} the result 
   */
  hasChild(key) {
    if (key === undefined) {
      return !isEmpty(this.children);
    } else {
      return !!this.children[key];
    }
  }

  /**
   * to traverse the module tree
   * @param {Function} fn--the callback handler
   */
  forEachModule(fn) {
    fn(this);
    forEachValue(this.children, (module) => {
      module.forEachModule && module.forEachModule(fn);
    })
  }

  /**
   * check the module state
   * If the state is not an object but the module has a submodule,
   * there will be some problems combining states into complete state
   */
  checkState() {
    this.forEachModule((module) => {
      let len = module.path.length;
      let moduleName = len ? `module[${module.path[len - 1]}]` : 'the config';
      assert(
        !module.hasChild() || typeOf(module.state) === 'object',
        `${moduleName} has submodules but it's state is not an object`,
      )
    })
  }

  /**
   * combine all the module states into a complete state
   */
  combineState() {
    forEachValue(this.children, (module, key) => {
      let subState = module.combineState();
      switch (module.combineMode) {
        case 'replace': 
          this.state[key] = subState;
          break;
        case 'assign':
        case 'extend':
          this.state[key] = this.state[key] || {};
          extend(this.state[key], subState, module.combineMode === 'assign');
          break;
      }
    });
    return this.state;
  }

  /**
   * reducers getter
   */
  get reducers() {
    return this.rawModule.reducers || {};
  }

}