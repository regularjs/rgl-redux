// helper functions goes here

/**
 * filter visible todos
 * @param {Array<Object>} todos todos list array
 * @param {String} filter todo filter type
 */
export const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed)
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed)
  }
};


export const ESCAPE_KEY = 27;
export const ENTER_KEY = 13;