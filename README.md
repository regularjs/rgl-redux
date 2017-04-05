# Regular Redux
一个微型模块用于 [Regular](http://regularjs.github.io) 组件实现[Redux](http://redux.js.org).

[![build status](https://img.shields.io/travis/regularjs/rgl-redux/master.svg?style=flat-square)](https://travis-ci.org/regularjs/rgl-redux) [![npm version](https://img.shields.io/npm/v/rgl-redux.svg?style=flat-square)](https://www.npmjs.com/package/rgl-redux)

```sh
npm install rgl-redux
```

## 运行要求
* regularjs 0.6.0-beta.1以上版本
* webpack+babel 用于构建基于ES6语法的应用

## 用法
`module/App.js`:
```js
import 'rgl-redux';
import './module/MyApp';
import { reducer } from './reducers'
import { createStore } from 'redux';

const AppContainer = Regular.extend({
  template: `
  <StoreProvider store={store}>
    <MyApp />
  </StoreProvider>
  `,
  config(data) {
    data.store = createStore(reducer);
  },
});
```

`components/MyComp.js`:
```js
import { connect } from 'rgl-redux';
import { changeFoo } from './actions';

const MyComp = Regular.extend({
  name: 'MyComp',
  template: '<div>{foo}</div><button on-click={this.onClick()}>Click Me!</button>',
  onClick() {
    this.$dispatch(changeFoo('bar'));
  }
});

export default connect({
  mapState(state) {
    return {
      foo: state.foo,
    };
  },
  dispatch: true,
})(MyComp);

```
## 文档
### StoreProvider
位于`src/StoreProvider.js`

一个Regular容器组件，StoreProvider组件作为提供redux store的容器组件，一般位于应用组件的最外层，需在该组件的 config 中初始化应用的store。StoreProvider类似 react-redux 的 Provider组件，提供了一个上下文环境，处于该环境内的Regular组件都可以通过[connect](#connect(definition))连接至store或得到进行action dispatch的能力。

## connect(definition)
位于`src/connect.js`

用于标识Regular组件，配合StoreProvider向组件内部动态注入mapState方法及 Redux store的dispatch方法。
### 参数
* `definition.mapState(state, data)` _(Function)_: 该方法指定了如何从全局store的当前state中获取当前组件所需要的数据。指定该参数后，组件会订阅Redux store的更新，即在任何时刻store更新时，该方法会被调用。改方法返回一个对象，用于替换当前组件的data，组件的￥update方法会自动调用。如果需要阻止自动调用`$update`使得组件不进入脏检查阶段，则直接返回`false`即可。如：
```js
connect({
  mapState(state, data) {
    const foo = state.foo;
    if (!foo || foo.length === data.foo.length) {
      return false;
    }
    return {
      foo
    };
  }
});
```
* `definition.dispatch` _(Boolean)_: 一个布尔属性指定当前组件是否需要进行分发特定操作（dispatch action）。该属性为任意`true`值时，位于`StoreProvider`组件内部的组件会被注入 `$dispatch` 方法，绑定自 Redux的 `store.dispatch` 方法。

## 路线图
### v0.2.0
* broadcast event: StoreProvider内的广播事件支持
* Complicated example: 更完整复杂的示例
* ActionMap: 一种简洁的方式实现dispatch -> action的映射

### Future
* timeline plugin: 时间线插件，用于提供实现`撤销`, `重做`的操作机制