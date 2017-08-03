//the utility functions

/**
 * get the type of the target
 * such as object|array|function|string|number...
 * @param {variate} target 
 */
export function typeOf(target) {
  return Object.prototype.toString.call(target).slice(8, -1).toLowerCase();
}

/**
 * shallowly, copy an object or an array
 * @param {Object or Array} target 
 * @return {Object or Array} the copy
 */
export function clone(target) {
  let type = typeOf(target);
  if (type === 'array') {
    return [].slice.call(target);
  }
  if (type === 'object') {
    return Object.assign({}, target);
  }
  return target;
}

/**
 * to extend an object
 * when the parameter(overwrite) is true, it equals to Object.assign
 * @param {Object} to the target object
 * @param {Object} from the reference object
 * @param {Boolean} overwrite force to overwrite the value
 * @return {Object}the target object after extended
 */
export function extend(to, from, overwrite) {
  if (typeOf(to) !== 'object' || typeOf(from) !== 'object') {
    return to;
  }
  for (let i in from) if (overwrite || to[i] == null) {
    to[i] = from[i];
  }
  return to;
}

/**
 * to judge if an object or an array is empty or not
 * @param {Object or Array} target 
 * @return {Boolean} the result
 */
export function isEmpty(target) {
  let type = typeOf(target);
  if (type === 'object') {
    return !Object.keys(target).length;
  }
  if (type === 'array') {
    return !target.length;
  }
  return true;
}

/**
 * the forEach of an object
 * @param {Object} obj the target to traverse
 * @param {*} fn 
 */
export function forEachValue(obj = {}, fn) {
  if (typeOf(obj) !== 'object') return;
  Object.keys(obj).forEach(key => fn(obj[key], key))
}

/**
 * to throw an error or warning when the condition is false
 * @param {Boolean Expression} condition--the expression to be judged
 * @param {String} msg--the message to throw
 */
export function assert(condition, msg, type = 'error') {
  if (!condition) {
    switch (type) {
      case 'error': 
        throw new Error(`[regular-redux]${msg}`);
        break;
      case 'warn':
        console.warn(`[regular-redux]${msg}`);
        break;
    }
  }
}