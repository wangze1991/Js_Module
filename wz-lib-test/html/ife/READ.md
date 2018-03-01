这是2015年 ife 测试学习

margin　为负数的情况

BFC 上下边距重叠
> 通过设置浮动，可以使父元素的宽度，高度就是子元素

解决方式一 父元素 overflow：hidden 这是对于父元素和子元素margin：top 重叠

流式编程：float:left  要注意清除浮动，并且要注意登高

z-index属性目前只有在position:relative、position:absolute和position:fixed参与的情况下才有作用
一般是不需要用z-index的 默认postion 后来居上的
一般不需要使用z-index

我们必须理解层叠关系满足的2个条件：
1、必须是同级；
2、二者分别设定了position:relative 或 absolute 或 fixed；
这时候通过设置z-index才有效

通常我们在写html+css的时候，如果一个父级元素内部的子元素是浮动的（float），
那么常会发生父元素不能被子元素正常撑开的情况  https://www.jianshu.com/p/9d6a6fc3e398

如果我们给footer添加 clear:both;，布局问题可以被解决，但是container依旧没有被撑开，有一种强行解决问题的感觉。
上述代码通过伪类 :after 在container后添加内容（content），来实现清除浮动。

```
.clearfix:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}
```
clearfix 一般用在还有浮动元素的父元素上


http://blog.csdn.net/zghekuiwu/article/details/54382145 webstorm 设置

http://blog.csdn.net/mizaoyu/article/details/52398547 Position为absolute的div或dropdown menu在设置了overflow的div中显示不完全(cropped)


http://zh.learnlayout.com/ 学习css布局


http://demo.doyoe.com/css/inline-block-space/  去除display：inline-block 去除缝隙

https://www.cnblogs.com/chuaWeb/p/html_css_position_float.html html/css基础篇——DOM中关于脱离文档流的几种情况分析











https://developer.mozilla.org/zh-CN/docs/Web/CSS         CSS


https://www.zhihu.com/question/20543196
http://www.gbtags.com/gb/gbliblist/20.html
http://mly-zju.github.io/html/css/2016/02/23/verticalAlign.html

http://www.gbtags.com/gb/gbtutorials/29.htm Emmt


垂直居中

1. 行内元素
父元素 text-aligin:center

2. 定宽块元素
- margin: 0 auto
- left 50% margin:负的元素宽度
3. 不定宽块元素
- 转换为行内元素居中
- 设置宽度 
- display:table-cell





水平居中












各种居中问题 参考

https://www.cnblogs.com/zuochengsi-9/p/5554340.html


https://www.w3cplus.com/css/elements-horizontally-center-with-css.html   六种实现元素水平居中



https://www.cnblogs.com/zhouhuan/p/vertical_center.html CSS垂直居中的11种实现方式


https://www.qianduan.net/css-to-achieve-the-vertical-center-of-the-five-kinds-of-methods/



# display:inline-block 产生偏移
http://blog.csdn.net/wmaoshu/article/details/52964251  inline-block基线对布局的影响&vertical-align&vertical-align等应用


https://www.cnblogs.com/eaysun/p/4081699.html  深入了解css的行高Line Height属性
https://zhuanlan.zhihu.com/p/25808995?group_id=825729897170345984

http://www.html-js.com/article/3478

https://www.zhihu.com/question/28057944
# input 去除蓝色边框
outline:none

# i
i标签可以设置背景图片



#两列布局
1. 

2. 

3. 

#三列布局

1. 

2.


3.





# BFC 












