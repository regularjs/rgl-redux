## State
### 单一state树

在new Store的config中传入state属性就可以定义一个state

```javascript
import {Store} from 'rgl-redux';

const store = new Store({
  ...
  state: {
    count: 0,
    languages: [
      {id: 1, name: 'regular'},
      {id: 2, name: 'regular'},
      {id: 3, name: 'regular'},
    ]
  }
  ...
});

console.log(store.state.count) //0

```
### 模块化state
什么叫做模块化的state，在项目开发中，如果你的业务代码逻辑较为复杂，那么你的state也会跟着变得复杂，这时候切分模块就提高了可维护性。

```javascript
state: {
  count: 0,
  languages: [
    {id: 1, name: 'regular'},
    {id: 2, name: 'regular'},
    {id: 3, name: 'regular'}
  ]
}
```
以上的state你可以把languages当作是全局state的一个模块，这个模块名就是languages，那么你可以在config里这样定义：

```javascript
const store = new Store({
  ...
  state: {
    count: 0
  },
  
  modules: {
    languages: {
      state: [
        {id: 1, name: 'regular'},
        {id: 2, name: 'regular'},
        {id: 3, name: 'regular'}
      ]
    }
  }
  ...
});

```
在config.modules中定义一个languages模块，它的state是一个数组，rgl-redux会自动帮我们将state合并成：

```javascript
state: {
  count: 0,
  languages: [
    {id: 1, name: 'regular'},
    {id: 2, name: 'regular'},
    {id: 3, name: 'regular'}
  ]
}
```
### 模块state的嵌套
```javascript
const store = new Store({
  ...
  state: {
    count: 0
  },
  
  modules: {
    languages: {
      state: {
        name: 'regular'
      },
      modules: {
        other: {
          state: {
            name: 'redux'
          }
        }
      }
    }
  }
  ...
});

```
这样合并后：

```javascript
{
  count: 0,
  languages: {
    name: 'regular',
    other: {
      name: 'redux'
    }
  }
}
```
因此，你可以把new Store传入的config当作是最顶层的一个模块。

### state合并策略combineMode
合并策略分为3种：
- 'assign'，默认值
- 'extend'
- 'replace'
##### 在模块的属性直接定义即可：

```javascript
const store = new Store({
  state: {
    count: 0,
    languages: {
      one: 'one',
      two: 'two'
    }
  },
  
  modules: {
    languages: {
      combineMode: 'extend',
      state: {
        one: 'sub-one',
        three: 'sub-three'
      }
    }
  }
  
});

```
##### 下面看个例子来区别3种模式：

```javascript
const store = new Store({
  state: {
    count: 0,
    languages: {
      one: 'one',
      two: 'two'
    }
  },
  
  modules: {
    languages: {
      state: {
        one: 'sub-one',
        three: 'sub-three'
      }
    }
  }
  ...
});

```
1. assign的话合并的话，子模块state会覆盖全局state对应部分的相同属性：

```javascript
{
  count: 0,
  languages: {
    one: 'sub-one',
    two: 'two',
    three: 'sub-three'
  }
}
```
2. extend的话合并的话，子模块state会覆盖全局state对应部分的不存在的属性：

```javascript
{
  count: 0,
  languages: {
    one: 'sub-one',
    three: 'sub-three'
  }
}
```
3. replace的话合并的话，子模块state会全部覆盖全局state对应部分：

```javascript
{
  count: 0,
  languages: {
    one: 'one',
    two: 'two',
    three: 'sub-three'
  }
}
```
### 必须注意的一点
如果一个模块有子模块，那么它的state就必须为一个对象，例如以下定义就会引发错误：

```javascript
const store = new Store({
  
  state: [1, 2, 3],
  
  modules: {
    languages: {
      state: {
        one: 'sub-one'
      }
    }
  }
  
});

```
这样合并的时候就会有麻烦，所以在定义后rgl-redux会对其进行检测，并给出错误提示
