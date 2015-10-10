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

## API

**Slider([options])**

构造函数。

options 及缺省值：
- container: '.slide-container',
- slide: '.slide',
- slideTime: 1000,
- active: 0, // index start from 0
- scrollNav: true,
- keyNav: true,
- navBar: true,

- classSlideIn: 'slide-in',
- classSlideOut: 'slide-out',
- classSlidePrev: 'slide-up',
- classSlideNext: 'slide-down',
- classSlideActive: 'slide-active',

- classSlideNavBar: 'slide-nav-bar',
- classSlideNav: 'slide-nav',
- classSlideNavActive: 'slide-nav-active'

**prev()**

导航到上一张幻灯片。

**next()**

导航到下一张幻灯片。

**nav(target)**

导航到指定索引（从0开始）的幻灯片。

## 依赖

- [jQuery](http://jquery.com)
- [jquery-mousewheel](https://github.com/jquery/jquery-mousewheel)
