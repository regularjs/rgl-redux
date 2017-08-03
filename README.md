# Regular Redux
一个微型模块用于 [Regular](http://regularjs.github.io) 组件实现[Redux](http://redux.js.org).

[![build status](https://img.shields.io/travis/regularjs/rgl-redux/develop.svg?style=flat-square)](https://travis-ci.org/regularjs/rgl-redux) [![npm version](https://img.shields.io/npm/v/rgl-redux.svg?style=flat-square)](https://www.npmjs.com/package/rgl-redux)

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
## 示例项目
示例项目位于 `examples` 目录，克隆项目后，运行 `npm run example`
* [TodoApp 示例](examples/Todo)

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

## 使用时间线插件：timeline plugin
## new Store(configs)
`module/store.js`:
```js
import {Store} from 'rgl-redux';

export const store = new Store({
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
## 将store注入到StoreProvider

`module/AppContainer.js`:
```js
import store from './module/store';
import 'rgl-redux';
import './module/App';

const AppContainer = Regular.extend({
  template: `
  <StoreProvider store={store}>
    <App />
  </StoreProvider>
  `,
  config(data) {
    data.store = store;
  },
});
```

`components/App.js`:
```js
import { connect } from 'rgl-redux';

let App = Regular.extend({

  name: 'app',

  template: `
    <div>count: {count}</div>
    <button on-click={this.onClick()}>count</button>
    <button on-click={this.$dispatch("undo")}>undo</button>
    <button on-click={this.$dispatch("redo")}>redo</button>
  `,
  
  onClick() {
    this.$dispatch('count');
  },

  config() {
    //第一次初始化的时候不会触发mapState，这里暂时这样写
    setTimeout(() => this.$dispatch('@init/state'), 100)
  }

});

App = connect({
 
  mapState(state) {
    return {
      count: state.count,
    };
  },

  dispatch: true

})(App);

```
### 注意
由于rgl-redux在组件初始化的时候并不会调用mapState，所以需要在组件实例化后this.$dispatch('@init/state')
## 时间线插件文档
### new Rgx.Store(configs)
store的构造函数，接受一个配置对象configs，用于创建app的store。
```js
new Rex.Store({
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
### config.undoable
是否可以undo、redo，默认开启。
### config.state
store的默认state，这个state是全局的（和模块区分，模块见下面文档）。
### config.reducers
store全局reducer（和模块区分，模块见下面文档）。
### config.modules
```js
new Rex.Store({
  ...
  state: {
    count: 0
  },
  modules: {
    moduleA: {
      state: {
        count: 1
      },
      reducers: {
        moduleAcount(moduleA, payload) {
          let count = moduleA.count;
          count++;
          return Object.assign({}, moduleA, {count});
        }
      }
    }
  }
  ....
});
//全局state会和局部state进行合并，实例中会合成为：
//state: {
//  count: 0,
//  moduleA: {
//    count: 1
//  }
//}

//模块中的reducer注入的state会自动换成module层次的state
```
`注意：如果有模块的时候，全局的state必须是一个对象`
### module.combineMode：'assign' | 'extend' | 'replace'，默认assign
```js
new Rgx.Store({
  state: {
    count: 0,
    moduleA: {
        count: 1,
        other: 2
    }
  },
  modules: {
    moduleA: {
      state: {
        count: 2
      }
    }
  }
});
//extendMode为assign的时候state会合并成为：
//state: {
//  count: 0,
//  moduleA: {
//    count: 2,
//    other: 2
//  }
//}

new Rgx.Store({
  state: {
    count: 0,
    moduleA: {
      count: 1,
      other: 2
    }
  },
  modules: {
    moduleA: {  
      extendMode: 'extend',
      state: {
        count: 2,
      }
    }
  }
});
//extendMode为assign的时候state会合并成为：
//state: {
//  count: 0,
//  moduleA: {
//    count: 1,
//    other: 2
//  }
//}

new Rgx.Store({
  state: {
    count: 0,
    moduleA: {
      count: 1,
      other: 2
    }
  },
  modules: {
    moduleA: {  
      extendMode: 'replace',
      state: {
        count: 2,
      }
    }
  }
});
//extendMode为assign的时候state会合并成为：
//state: {
//  count: 0,
//  moduleA: {
//    count: 2
//  }
//}
```
### config.middlewares
中间件，可用于数据修改无关的操作，例如发送保存请求，记录日志等。
```js
function myMiddleware(context, next) {
  //context的方法: dispatch, getState
  //next：只有执行了next()后dispatch才会往下执行
}

new Rex.Store({
  ...
  middlewares:[myMiddleware]
  ....
});
```
### config.modifiers
可用于对reducer返回的state做一些改变，业务中经常用于数据关联处理。
```js
function myModifiers(reducer) {
  return (state, action) {
    //do something
    let newState = reducer(state, action);
    //do something
    return newState; //这里要return新的state
  }
}

new Rex.Store({
  ...
  modifiers:[myModifiers]
  ....
});
```
### 内置dispatch的方法
```js
//回退历史
this.$dispatch("undo") //store.dispatch("undo")
//前进
this.$dispatch("redo") //store.dispatch("redo")
//重置state
this.$dispatch("@init/state") //store.dispatch("@init/state")
//替换state
this.$dispatch("@replace/state") //store.dispatch("@replace/state")

```

### dispatch的payload
```js
payload.replace = true //表示本次dispach产生的state会替换上一次的提交

payload.clean = true //表示只保存本次提交

payload.record = false //表示这次产生的state不会进历史

payload.steps = 2 // 表示undo, redo的步长，只在undo, redo的时候有效

```

## 路线图
### v0.2.0
* broadcast event: StoreProvider内的广播事件支持
* Complicated example: 更完整复杂的示例
* ActionMap: 一种简洁的方式实现dispatch -> action的映射


## License
MIT