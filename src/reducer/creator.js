import {set, get} from '../immuable';
import track from './track';
import changed from './changed';
/**
 * the creator of reducer
 * bind the track modifier to undo redo
 * bind the changed modier to get the changed function
 * @param {Store} the instance of Store
 */
export default function createReducer(store) {

  let reducer = function(state, action) {
    
    if (!state || !action) return state;

    let match = store.reducers[action.type];

    if (match) {
      let {path, handler} = match;
      let moduleState = path.length ? get(state, path.join('.')) : state;
      let newState = handler(moduleState, action.payload);
      if (newState !== moduleState && newState) {
        if (path.length) {
          return set(state, path.join('.'), newState);
        } else {
          return newState;
        }
      }
    }
    return state;
  }

  store.modifiers.slice().forEach(modifier => {
    reducer = modifier(reducer);
  })
  
  if (store.undoable) {
    return changed(track(store.name, reducer), true);
  } else {
    return changed(reducer, false);
  } 
  
}
