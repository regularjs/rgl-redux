import expect from 'expect.js'
import Regular from 'regularjs';
import { createStore } from 'redux';
import connect from '../src/connect';
import { IActionDispatcher, IStateFetcher } from '../src/helper';

describe('Regular', () => {
  describe('connect', () => {
    it('should implement IStateFetcher & mapState if provide mapState in options', () => {
      const Component = Regular.extend();
      const TargetComponent = connect({
        mapState(state) {}
      })(Component);
      const target = new TargetComponent();
      expect(target).to.have.property(IStateFetcher.$$name);
      expect(target.mapState).to.be.a('function');
    });

    it('should implement IActionDispatcher if dispatch is true', () => {
      const Component = Regular.extend();
      const TargetComponent = connect({
        dispatch: true
      })(Component);
      const target = new TargetComponent();
      expect(target).to.have.property(IActionDispatcher.$$name);
    });
  });
});
