import {get, set} from '../immuable';

/**
 * change function getter
 * @param {*} newState 
 * @param {*} oldState 
 */
function getChanged(newState, oldState, undoable) {
  let changed = {};
  return function(path) {
    if (undoable) {
      return get(newState.current, path) !== get(oldState.current, path);
    } else {
      return get(newState, path) !== get(oldState, path);
    }
  }
}

/**
 * sign state.changed to a function to judge if the value changed by path
 * @param {Function} reducer
 */
export default function(reducer, undoable = true) {
  return (state, action) => {
    let newState = reducer(state, action);
    newState && (newState.changed = getChanged(newState, state, undoable));
    return newState;
  }
}