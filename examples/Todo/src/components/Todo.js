import Regular from 'regularjs';
import { updateTodo } from '../actions';
import { ESCAPE_KEY, ENTER_KEY } from './helper';
import { connect } from '../../../../src';

const Todo = Regular.extend({
  name: 'Todo',
  template: `
    <div class="todo">
      {#if mode === 'edit'}
      <input type="text" placeholder="enter your todo" r-model={text} on-change={this.onChange()} on-keydown={this.onKeyDown($event)} autofocus />
      {#else}
      <input type="checkbox" checked={todo.completed} on-click="click" /> <span r-class={{"z-completed": todo.completed}} on-dblclick={this.enterEdit()}>{todo.text}</span> <i class="fa fa-times" on-click="remove"></i>
      {/if}
    </div>`,
  config(data) {
    Object.assign(data, {
      mode: 'show',
      text: ''
    })
  },
  enterEdit() {
    if (this.data.todo.completed) {
      return;
    }
    this.data.mode = 'edit';
    this.data.text = this.data.todo.text;
  },
  cancel() {
    this.data.mode = 'show';
    this.data.text = '';
  },
  onChange() {
    let { text, todo } = this.data;
    text = text.trim();
    if (text && text !== todo.text) {
      //dispatch
      this.$dispatch(updateTodo(todo.id, text));
    }
  },
  onKeyDown(ev) {
    if (ev.which === ENTER_KEY) {
      this.onChange();
    } else if (ev.which === ESCAPE_KEY) {
      this.cancel();
    }
  }
});

export default connect({ dispatch: true })(Todo);
