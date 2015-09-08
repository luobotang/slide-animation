# slide-animation

幻灯片切换效果。

## 说明

一张幻灯片页面经历的状态包括：

- slide-down：在当前显示幻灯片后面
- slide-in：进入
- slide-active：显示
- slide-out：退出
- slide-up：在当前显示幻灯片前面

## 使用方法

```javascript
var Slider = require('luobo-slider')
new Slider({
    container: '#slider-container'
})
```

## 依赖

- jQuery
- jquery-mousewheel
