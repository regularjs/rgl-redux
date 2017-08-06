## Reducer
### 提交修改
更改redux的store中的状态的唯一方法是提交一个修改：

```javascript
store.dispatch("count", {
  step: 2
})
```
dispatch函数接受一个type和payload作为参数，这是会触发一个回调函数来处理state的变化。如果你在store这样定义了reducer：

```javascript
new Store({
  state: {
    count: 0
  },
  reducers: {
    count(state, payload) {
      let count = state.count;
      let step = payload.step || 1;
      count = count + step;
      return Object.assign({}, state, {count})
    }  
  }
})
```
调用dispatch的时候，reducer函数就会执行，这个函数return的state会替换state，从而修改数据。

### 模块化reducer
和state一样，reducer也有模块化，这个模块化是什么意思呢？其实很简单，只是改变注入reducer的state，将模块的state注入到reducer中，例如：

```javascript
const store = new Store({
  state: {
    count: 0,
    module: {
        count: 2
    }
  },
  reducers: {
    count(state, payload) {
      console.log(state); // {count: 2}
      let count = state.count;
      let step = payload.step || 1;
      count = count + step;
      return Object.assign({}, state, {count})
    }  
  }
})

store.dispatch('count');
```
注入到reducer的state是一个局部state，并且你返回的state就是module的state
### 提交载荷payload
你可以向store.dispatch传入额外的参数：

```javascript
store.dispatch('count', {
  step: 1
})
```
第二个参数就是payload
### 内置reducer
rgl-redux提供了几个内置的reducer用来执行一些特定的操作
1. undo撤销

```javascript
store.dispatch('undo')
```
2. redo重做

```javascript
store.dispatch('redo')
```
3. @init/state初始化/重置state

```javascript
store.dispatch('@init/state')
```
由于目前rgl-redux有个问题：组件创建后mapState并不会执行，所以可以通过这个dispatch进行初始化，触发mapState。

4. @replace/state替换state

```javascript
store.dispatch('@replace/state', {
  state: newState
})
```
### payload的一些特殊参数

```javascript
payload.replace = true //表示本次dispach产生的state会替换上一次的提交

payload.clean = true //表示只保存本次提交

payload.record = false //表示这次产生的state不会进历史

payload.steps = 2 // 表示undo, redo的步长，只在undo, redo的时候有效
```
