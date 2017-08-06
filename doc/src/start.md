rgl-redux内置一个类Store，是对[Redux](https://github.com/reactjs/redux)的store的集成封装，提供简单配置reducer、state、middleware...的方法，还实现了undo、redo的功能。

### 创建一个最简单的store

```javascript
import {Store} from 'rgl-redux';

const store = new Store({
  state: {
    count: 0
  },
  reducers: {
    count(state, payload) {
      let count = state.count;
      count++;
      return Object.assign({}, state, {count});
    }
  }
});
```
现在，你可以通过 store.state 来获取状态对象，以及通过 store.dispatch 方法触发状态变更：

```javascript
console.log(store.state) // {"count": 0}

store.dispatch("count");

console.log(store.state) // {"count": 1}

```
这样就可以简单地定义一个state数据，同时可以通过reducer改变state的数据，后面我们讲如何将store注入到Regular组件当中以供使用
