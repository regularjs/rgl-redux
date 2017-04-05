import Regular from 'regularjs';
import './Todo';
import { toggleTodo, addTodo } from '../actions';
import { getVisibleTodos, ENTER_KEY, ESCAPE_KEY } from './helper';
import { connect } from '../../../../src';

const TodoList = Regular.extend({
  name: 'TodoList',
  template: `
  <ul class="m-todolist">
    {#list todos as todo}
    <li>
      <Todo todo={todo} on-click={this.onTodoClick(todo)} isolate=1 />
    </li>
    {/list}
    <li><input type="text" placeholder="enter your todo" r-model={text} on-blur={this.onAddTodo()} on-keydown={this.onKeyDown($event)}></li>
  </ul>
  `,
  config(data) {
    Object.assign(data, {
      todos: [],
      text: '',
    });
  },
  onTodoClick(todo) {
    this.$dispatch(toggleTodo(todo.id));
  },
  onAddTodo() {
    const text = this.data.text.trim();
    if (!text) {
      return;
    }
    this.$dispatch(addTodo(text));
    this.data.text = '';
  },
  onKeyDown(ev) {
    if (ev.which === ENTER_KEY) {
      this.onAddTodo();
    } else if (ev.which === ESCAPE_KEY) {
      this.data.text = '';
    }
  }
});

export default connect({
  mapState(state) {
    return {
      todos: getVisibleTodos(state.todos, state.visibilityFilter)
    }
  },
  dispatch: true,
})(TodoList);
