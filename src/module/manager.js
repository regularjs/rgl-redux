import Module from './module';
import { forEachValue } from '../util';

export default class ModuleManager {
  
  constructor(rawRootModule) {
    //the root module of this module tree
    this.root = Object.create(null);
    //register the modules
    //rawRootModule is the config of new Store()
    this.register([], rawRootModule);
    //check the state 
    this.root.checkState();
    //combine the state
    this.state = this.root.combineState();
  }

  /**
   * register a module
   * @param {Array} path 
   * @param {Object} rawModule 
   */
  register (path, rawModule = {}) {
    const newModule = new Module(rawModule, path);
    if (path.length === 0) {
      this.root = newModule;
    } else {
      const parent = this.get(path.slice(0, -1))
      parent.addChild(path[path.length - 1], newModule)
    }
    if (rawModule.modules) {
      forEachValue(rawModule.modules, (rawChildModule, key) => {
        this.register(path.concat(key), rawChildModule);
      })
    }
  }

  /**
   * unregister a module 
   * @param {Array} path 
   */
  unregister (path) {
    const parent = this.get(path.slice(0, -1));
    const key = path[path.length - 1];
    parent.removeChild(key);
  }

  /**
   * get a module
   * @param {Array} path 
   */
  get(path) {
    return path.reduce((module, key) => {
      return module.getChild(key)
    }, this.root)
  }

  /**
   * to traverse the module tree
   * @param {Function} fn--the callback handler
   */
  forEachModule(fn) {
    this.root.forEachModule(fn);
  }

}