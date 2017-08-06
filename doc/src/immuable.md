## 不可变数据
我们一步一步讲讲什么叫做不可变数据，而不可变数据是实现undo、redo的关键

### 共享与可变

我们都知道Javascript的对象、数组、函数是引用类型，变量名只是保存了它们的引用，真正的数据存放在堆内存中，所以可能多个变量共享同一份数据，例如：

```javascript
let a = [1, 2, 3];
let b = a;
console.log(a); //1, 2, 3
console.log(b); //1, 2, 3
```
如果你修改了其中某个数组的数据：

```javascript
let a = [1, 2, 3];
let b = a;
a[0] = 0;
console.log(a); //0, 2, 3
console.log(b); //0, 2, 3
```
这时两个数组都变化了。

### undo、redo的思路

作为一个复杂的页面应用，我们可能会接到产品的需求：做个撤销、重做的功能吧。对于redux应用，我们可能有两个思路：
- 针对每一个reducer写一个撤销的reducer，需要撤销的时候只需要找到对应的reducer，然后dispatch即可。
- 使用一个数组存放所有的state，撤销重做的时候移动数组的指向就可以了。

对于复杂的应用来说，第一种方法会带来许多的工作量，并且使得代码逻辑变得复杂，所以选择第二个。

### 可变数据带来的麻烦


```javascript
let state = {
  members: [1, 2, 3]
}
let timeline = [state];
let index = 0;
//新增一个操作的时候，如修改menbers第一个元素为0
let newState = state;
newState.members[0] = 0;
timeline[++index] = newState;

```
我们的思路很简单，就是获取到newState，然后修改members第0个值，最后添加到timline，把index加1，然而：

```javascript
console.log(timeline); // [{members: [0, 2, 3]}, {members: [0, 2, 3]}]
```
可以看到，原来的state也跟着改变了，无奈。

### 使用deepClone
相信你也想到了，上面的代码使用深拷贝不就解决了，答案是，没错。

```javascript
let state = {
  members: [1, 2, 3]
}
let timeline = [state];
let index = 0;
//新增一个操作的时候，如修改menbers第一个元素为0
let newState = JSON.parse(JSON.stringify(state)); //这是代表简单的deepClone
newState.members[0] = 0;
timeline[++index] = newState;

console.log(timeline); // [{members: [1, 2, 3]}, {members: [0, 2, 3]}]
```
看起来目的达成了，但是有2个问题，每一步操作都必须生成一个完全不同的对象，开销打，而且无法解决当state上有函数，有循环引用的问题。

### 使用不可变数据
其实不可变数据很好理解，直接上代码：

```javascript
let state = {
  members: [1, 2, 3]
}
let timeline = [state];
let index = 0;
//新增一个操作的时候，如修改menbers第一个元素为0
let newState = Object.assign({}, state);
newState.members = newState.members.slice()

newState.members[0] = 0;
timeline[++index] = newState;

console.log(timeline); // [{members: [1, 2, 3]}, {members: [0, 2, 3]}]
```
为了解决共享数据的问题，我们将state从顶层到members，将引用都修改了，于是共享就实效了，这个就是不可变数据，对象可用Object.assign，数组用slice就可以解决。但是每次都自己写有点麻烦，所以封装成函数
### set(target, path, newValue[, config])
set可以接受4个参数：设置对象，路径，新值，额外配置
- target设置对象：可以是对象或者数组
- path路径：需要替换的值的路径，例如下方代码'member.0'代表state.member[0]
- newValue: 新值，不解释
- config：配置
  - autoCreated，默认为false，为true的时候，路径错误，则会自动创建key
  - assign，新值与旧值的合并策略，默认false

```javascript
import {set} from 'rgl-redux';

let state = {
  members: [1, 2, 3]
}
let timeline = [state];
let index = 0;
//新增一个操作的时候，如修改menbers第一个元素为0
let newState = set(state, 'members.0', 0);

console.log(timeline); // [{members: [1, 2, 3]}, {members: [0, 2, 3]}]
```
返回一个不可变数据。
### get(target, path)
set可以接受2个参数：设置对象，路径
- target设置对象：可以是对象或者数组
- path路径：路径，例如下方代码'member.0'代表state.member[0];

只是单纯获取到值，避免了undefined.key的错误

```javascript
import {get} from 'rgl-redux';

let state = {
  members: [1, 2, 3]
}

console.log(get(state, 'member.0')) // 1
console.log(get(state, 'unknow.a.c.b')) // undefined

```

### splice(target, path, ...args)
splice可以接受多个参数
- target设置对象：可以是对象或者数组
- path路径：路径，例如下方代码'member.0'代表state.member[0];
- 后面的参数和数组的splice是一样的

只是单纯获取到值，如果path获取到的不是一个数组，这时候相当于get

```javascript
import {splice} from 'rgl-redux';

let state = {
  members: [1, 2, 3]
}

console.log(get(state, 'member', 0, 1)) // {members: [2, 3]}

```
