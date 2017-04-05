import { IActionDispatcher, IStateFetcher } from './helper';

/**
 * connect a Regular component
 * @param {Object} def connect definition object
 * @param {Function} def.mapState map redux state to regular component's data, and will call $update method automatically
 * @param {Boolean} def.dispatch truly to inject dispatch to component
 * @returns {Function}  return a function, you can use it to redefine (Component) to be reduxable
 */
export default function connect({
    mapState,
    dispatch,
  }) {
  return function (originComponent) {
    if (mapState && typeof mapState === 'function') {
      originComponent = originComponent.implement(IStateFetcher).implement({ 
        mapState(state) {
          const mappedData = mapState.call(this, state, this.data);
          mappedData && Object.assign(this.data, mappedData);
          return mappedData;
        }
      });
    }
    if (dispatch) {
      originComponent = originComponent.implement(IActionDispatcher);
    }
    return originComponent;
  };
}
