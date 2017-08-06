## 中间件

rgl-redux中间件就是一个函数，它接收两个参数context和next.

### context
- context是一个对象，有两个方法：dispatch和getState，即为store.dispatch和store.getState()
- next是一个函数，只有执行这个方法，本次dispatch的reducer才会执行

```javascript
function myMiddleware(context, next) {
  console.log("I'm before next", context.getState());
  next()
  console.log("I'm after next", context.getState());
}

const store = new Store({

  state: {
    count: 0
  },
  
  reducers: {
    count(state, payload) {
      console.log("I'm in reducer");
      let count = state.count;
      let step = payload.step || 1;
      count = count + step;
      return Object.assign({}, state, {count})
    }  
  },
  
  middlewares: [myMiddleware]
})

store.dispatch('count');
// I'm before next {count: 0}
// I'm in reducer
// I'm after next {count: 1}
```
