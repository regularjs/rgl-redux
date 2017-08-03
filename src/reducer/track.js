import {extend} from '../util';

const timelineActionTypes = ['ADD', 'UNDO', 'REDO', 'SEEK'];

const track = (name, reducer, size = 1024) => {
  
  const initialState = {
    timeline: [],
    index: -1,
    size
  };

  const handlers = {};

  timelineActionTypes.forEach(type => {
    handlers[name + '_' + type] = track[type.toLowerCase()];
  });

  /**
   * the track reducer
   * @param {Object} initialState
   * @param {Object} action
   * 1. action.record : false, the change will not push into timeline
   * 2. action.replace: true, the change will replace last change
   * 3. action.clean: true, will clean the timeline
   */
  return (state = initialState, action) => {

    if (!state.timeline) {
      initialState.current = state;
      initialState.index = 0;
      initialState.timeline.push(state);
      state = initialState;
    }
    const handler = handlers[action.type];
    if (handler) {
      return handler(state, action.payload || {}, action.replace);
    }
    //expose part of the state to other reducers
    //and get the new state through other reducers
    const newCurrentState = reducer(state.current, action);
    return add(state, newCurrentState, action.record !== false, action);
  };
};

/**
 * add a state into timeline
 * @param {Object} state, the old state, including timeline message
 * @param {Object} data, the new state you want to push into timeline
 * @param {Boolean} record, if to record of this action
 * @param {Object} action
 * @return {Object} the new state with timeline
 */
const add = track.add = (state, data, recored, action) => {
  const current = state.current;
  if (data === current || data === undefined || data === null) {
    return state;
  }

  const nextState = {
    current: data
  };

  if (recored) {
    if (action.clean) {
      state.timeline = [];
    } else if (action.replace) {
      state.timeline.pop();
    }
    let nextTimeline = nextState.timeline = state.timeline.slice(
      state.index + 1 >= state.size ? 1 : 0,
      state.index + 1
    );
    nextState.index = nextTimeline.push(data) - 1;
  }
  
  return extend(nextState, state);
};

/**
 * search specific state, and replace the current
 * @param {Object} state, the new state
 * @param {Object} payload, payload.index decide the index of state in timeline
 * @param {Boolean} replace, if to clean the states of the index
 */
const seek = track.seek = (state, {index}, replace) => {
  const timeline = state.timeline;
  const maxIndex = timeline.length - 1;

  if (index < 0) {
    index = 0;
  }

  // Allow for -1 when timeline is empty.
  if (index > maxIndex) {
    index = maxIndex;
    return state;
  }

  if (replace) {
    state.timeline = timeline.slice(0, index + 1);
  }

  return index == state.index ? state : extend({
    index: index,
    current: timeline[index]
  }, state);
};

/**
 * undo
 * @param {Object} state, the new state
 * @param {Object} payload, payload.steps decide the steps to travel from timeline
 * @param {Boolean} replace, if to clean the states of the index
 */
track.undo = function(state, {steps = 1}, replace) {
  let payload = {
    index: state.index - steps
  }
  return seek(state, payload, replace);
};

/**
 * redo
 * @param {Object} state, the new state
 * @param {Object} payload, payload.steps decide the steps to travel from timeline
 * @param {Boolean} replace, if to clean the states of the index
 */
track.redo = function(state, {steps = 1}, replace) {
  let payload = {
    index: state.index + steps
  }
  return seek(state, payload, replace);
};

export default track;