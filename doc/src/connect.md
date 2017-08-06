## connect函数

```javascript
import { connect } from 'rgl-redux';

const App = Regular.extend({
  
  name: 'App',
  
  template: '<div>{count}</div>'

    
});

export default connect({
  mapState(state) {
    return {
      count: state.count,
    };
  },
  dispatch: true,
})(App);
```
connect接收一个配置对象config，App是StoreProvider组件的一个子组件(在模板中实例化的，不能是new出来inject进去的)。经过以上代码，你就可以在App的方法中这样调用：
```
this.$dispatch("count");
```
然后，mapState会自动执行，返回一个对象，返回的对象属性会自动注入到组件的data中，从而更新视图。