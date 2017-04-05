import { createStore } from 'redux';
import todoAppReducer from './reducers';

export function createTodoStore() {
  return createStore((state, action) => {
    console.log(action);
    return todoAppReducer(state, action);
  }, {
    todos: []
  });
};