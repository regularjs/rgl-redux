import Regular from 'regularjs';
import { IActionDispatcher, IStateFetcher } from './helper';

/**
 * Container component to provide store
 * @component StoreProvider
 */
const StoreProvider = Regular.extend({
  name: 'StoreProvider',
  template: '{#inc this.$body}',
  config(data) {
    if (!data.store) {
      throw Error('StoreProvider must provide store');
    }
  },
  modifyBodyComponent(component) {
    const store = this.data.store;
    // component can fetch data from store which
    // implement the DataFetcher interface
    if (component[IStateFetcher.$$name]) {
      if (typeof component.mapState !== 'function') {
        console.warn(`mapState method not found in component ${component.name}`);
        return;
      }

      const unsubscribe = store.subscribe(() => {
        if (component.$phase === 'destroyed') { 
          return;
        }
        const state = store.getState();
        const returnValue = component.mapState(state);
        if (returnValue !== false) {
          component.$update();
        }
      });

      component.$on('$destroy', unsubscribe)
    }
    // component can dispatch action to store which
    // implement the ActionDispatcher interface
    if (component[IActionDispatcher.$$name]) {
      component.$dispatch = store.dispatch.bind(store);
    }
  },
});

export default StoreProvider;
