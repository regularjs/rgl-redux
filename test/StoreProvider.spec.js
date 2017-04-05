import expect from 'expect.js'
import Regular from 'regularjs';
import { createStore } from 'redux';
import connect from '../src/connect';
import { IActionDispatcher, IStateFetcher } from '../src/helper';

describe('Regular', () => {
  describe('StoreProvider', () => {
    const TodoList = Regular.extend({
      name: 'TodoList',
      template: `
      <ul>
      {#list todos as todo}
      <li><input type="checkbox" checked={todo.completed} on-click={this.onTodoClick(todo)} /> {todo.text}</li>
      {/list}
      </ul>`,
      onTodoClick(todo) {
        this.$dispatch({
          action: 'TOGGLE_TODO',
          payload: todo.id
        });
      }
    });

    const ConnectedTodoList = connect({
      mapState(state) {
        return {
          todos: state.todos
        }
      },
      dispatch: true
    })(TodoList);

    const App = Regular.extend({
      template: `
      <StoreProvider store={store}>
        <TodoList />
      </StoreProvider>
      `,
      config(data) {
        data.store = createStore((state, action) => {
          switch(action.type) {
            case 'TOGGLE_TODO':
              break;
            default:
              return state;
          }
        }, { todos: [] });
      }
    });

    it('should throw when store is not provided', () => {
      const Component = Regular.extend({
        template: `<StoreProvider />`
      });

      const fn = () => new Component();
      expect(fn).to.throwError();
    });
  });
});
