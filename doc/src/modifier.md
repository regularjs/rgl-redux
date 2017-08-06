## modifier

modifier也是一个函数，返回一个reducer，是reducer的高阶函数，用于对state进行其他修改，例如rgl-redux的undo、redo就是利用modifier实现的功能。和middleware不同的是，middleware常用于做与state的无关的事，例如涌来做日志记录，数据更新到数据库等等，而modifier是对reducer返回的state经过再次加工。


```javascript
function myModifiers(reducer) {
  return (state, action) {
    //do something
    let newState = reducer(state, action);
    //do something
    return newState; //这里要return新的state
  }
}

new Store({
  state: {
    count: 0
  },
  reducers: {
      
  },
  modifiers:[myModifiers]
});
```
