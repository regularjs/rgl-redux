## StoreProvider组件

假设App组件是你们项目的一个组件，把StoreProvider作为App组件的$outer(父组件)，并通过[connect](connect.md)函数包装App组件来注入store。
```javascript
import 'rgl-redux';
import './module/App';   //一个regular组件
import store from './module/store'  //创建的store实例

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
记得import进rgl-redux来定义StoreProvider组件，并且传入store
