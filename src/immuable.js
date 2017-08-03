import {typeOf, clone} from './util';

/**
 * immuable set
 * @param {Object or Array} target 
 * @param {String or Array} pathes, like: "a.b.c" , ['a', 'b', 'c'] 
 * @param {variate} value 
 * @param {Object} options 
 * (1) options.assign
 *     when the new value and old value are both object,
 *     if the replace is false, program will set the new value by Object.assign({}, old, new)
 *     if the replace is true, program will just set the new value
 * (2) options.autoCreated
 *     if the autoCreated is true and it come to an inexistent path,
 *     it will create new object by pathes, to avoid the error
 */
export const set = function(target, pathes, value, options = {}) {
  
  if (options === true) {
    options = { assign: true }
  }
  let {assign, autoCreated} = options;

  pathes = Array.isArray(pathes) ? pathes : ('' + pathes).split('.');
  
  let targetType = typeOf(target),
      valueType = typeOf(value),
      length = pathes.length;

  if (!length) {
    return assign && targetType === 'object' && valueType === 'object' 
      ? Object.assign({}, target, value)
      : value;
  }

  let nextPath = pathes.shift();
  
  target = clone(target);

  if (target === undefined && options.autoCreated) {
    target = {};
  }

  if (length === 1 && target[nextPath] === value) {
    return target;
  }

  target[nextPath] = set(target[nextPath], pathes, value, options);

  return target;
}

/**
 * the getter of value by path
 * avoid the error: Can't read property '**' of undefined
 * @param {Object or Array} target 
 * @param {String or Array} pathes, like: "a.b.c" , ['a', 'b', 'c']
 */
export const get = function(target, pathes) {
  
  if (!target) return;

  pathes = Array.isArray(pathes) ? pathes : ('' + pathes).split('.');

  pathes.some((path) => {
    target = target[path]
    if (target === null || target === undefined) {
      return true;
    }
  });

  return target;
}

/**
 * the immuable splice for array
 * @param {Object or Array} target 
 * @param {String or Array} pathes, like: "a.b.c" , ['a', 'b', 'c']
 * @param {Parameters} args, the same as the splice's parameters
 * @return {Object} the new Object with change
 */
export const splice = function(target, pathes, ...args) {
  let list = get(target, pathes);
  if (!Array.isArray(list)) {
    return list;
  }
  list = list.slice();
  list.splice.apply(list, args);
  return set(target, pathes, list, true);
}