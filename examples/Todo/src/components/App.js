import Regular from 'regularjs';
import '../../../../src/StoreProvider';
import { createTodoStore } from '../store';
import './TodoList';

const App = Regular.extend({
  name: 'App',
  template: `
    <StoreProvider store={store}>
      <TodoList />
    </StoreProvider>
  `,
  config(data) {
    data.store = createTodoStore()
  }
});

export default App;