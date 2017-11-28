/**
 * 下拉框搜索提示
 * @author wangze
 * @date 2017-09-28 14:46.
 * @email 595702583@qq.com
 **/

;(function () {
    $.fn.suggestion = function (options) {
        return this.each(function () {
            //bindEvent(this);
            var s = new Suggestion($(this), options);
            s.init();
        });
    };
    function Suggestion(ele, options) {
        this.opt = $.extend({}, $.fn.suggestion.defaults, options);
        this.ele = ele;
    }
    var proto = Suggestion.prototype;
    var cacheText = '';//缓存用户输入的数据,两种方式缓存，一种设置dom属性，一种设置js变量
    var key = {
        'up': 38,
        'down': 40,
        'enter': 13,
        'esc': 27,
        'tab': 9,
        'del': 127
    };

    proto.init = function () {
        var that = this;
        var $parent = that.ele.parent();
        var clsName = '.' + that.opt.suggestionCls;


        //click事件
        that.ele.on('click', function (e) {
            e.stopPropagation();
            that.showSuggestion();
        });
        //keyup事件
        that.ele.on('keydown', function (e) {
            e.stopPropagation();
            var html = [
                '<div class="' + that.opt.suggestionCls + '">',
                '<ul>',
                '</ul>',
                '</div>'
            ];
            var $me = $(this);
            //添加下拉弹框
            var p = $me.position();
            //这里用postion 主要是因为 父节点是postion:relative,所以，我们absolute对应的left top,只要获取相对于父节点的left和top
            var top = p.top + $(this).outerHeight();
            if ($(clsName, $parent).length === 0) {
                $me.parent().append(html.join(''));
            }
            $(clsName, $parent).css({
                'position': 'absolute',
                'top': top,
                'left': p.left,
                'width': $me.outerWidth()
            });
            switch (e.keyCode) {
                case key.up:
                    e.preventDefault();//阻止默认事件,阻止弹出框中事件
                    indexChange(key.up, that.opt, $me);
                    break;
                case key.down:
                    e.preventDefault();//阻止默认事件,阻止弹出框中事件
                    indexChange(key.down, that.opt, $me);
                    break;
                case key.tab:
                    break;
                case key.enter:
                    e.preventDefault();
                    break;
            }
        });


        that.ele.on('input propertychange', function () {
            var $me = $(this);
            if ($me.val() !== cacheText) {
                cacheText = $me.val();
            }
            that.showSuggestion();
        });
        //滑动事件
        $parent.on('mouseover', clsName + ' li', function () {
            $(this).addClass(that.opt.activeClassName).siblings().removeClass(that.opt.activeClassName);
        }).on('click', clsName + ' li', function () {
            var text = $(this).text();
            that.ele.val(text).focus();
        });

        $(document).on('click', function () {
            $(clsName, $parent).hide();
            $(clsName + ' li', $parent).removeClass(that.opt.activeClassName);
        });
    };


    proto.showSuggestion = function () {
        var that = this,
            $me = that.ele,
            $parent = $me.parent(),
            clsName = '.' + that.opt.suggestionCls;
        //搜索框有值
        if ($me.val()) {
            return $.ajax({
                type: that.opt.type,
                dataType: that.opt.dataType,
                data: that.opt.transferData($me),
                url: that.opt.url,
                jsonp: that.opt.jsonp
            }).done(function (data) {
                that.opt.onCallback($(clsName, $parent).find('ul').empty(), data);
            }).fail(function (a, b) {
                console && console.warn(a);
                console && console.warn(b);
            }).done(function () {
                if (!$(clsName, $parent).is(':visible')) {
                    $(clsName, $parent).show();
                }
            });
        }
        //搜索框没值
        if (!$me.val()) {
            $(clsName, $parent).hide().find('ul').empty();
            return new $.Deferred();
        }
    };


    function indexChange(type, opt, inputEle) {
        var activeClassName = opt.activeClassName,
            ulSelector = '.' + opt.suggestionCls + ' ul',
            liSelector = ulSelector + ' li',
            selectedLiSelector = liSelector + '.' + activeClassName,
            $selectedLi = $(selectedLiSelector),
            index = 0;
        if (type === key.up) {
            if ($selectedLi.length === 0) {
                $(liSelector + ':last').addClass(activeClassName).siblings().removeClass(activeClassName);
            } else {
                index = $selectedLi.index();
                if (index === 0) {
                    $(liSelector).removeClass(activeClassName);
                } else {
                    $(liSelector).eq(index - 1).addClass(activeClassName).siblings().removeClass(activeClassName);
                }
            }
        } else if (type === key.down) {
            if ($selectedLi.length === 0) {
                $(liSelector + ':first').addClass(activeClassName).siblings().removeClass(activeClassName);
            } else {
                index = $selectedLi.index();
                if (index === $(liSelector).length - 1) {
                    $(liSelector).removeClass(activeClassName);
                } else {
                    $(liSelector).eq(index + 1).addClass(activeClassName).siblings().removeClass(activeClassName);
                }
            }
        }
        if ($(selectedLiSelector).length === 0) {
            inputEle.val(cacheText);
        } else {
            inputEle.val($(selectedLiSelector).text());
        }

    }


    $.fn.suggestion.defaults = {
        url: '',
        zIndex: 11,
        suggestionCls: 'suggestion',
        transferData: function (input) {
            return {};
        },
        type: 'get',
        dataType: 'json',
        jsonp: null,
        jsonpCallback: '',
        activeClassName: 'active',
        autoSubmit: true,//点击确定是否自动提交表单
        onCallback: function (target, data) {
        },
        onSelect: function () {

        }
    };


})();