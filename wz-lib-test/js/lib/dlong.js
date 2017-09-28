/**
 * @description 组件变量。
 * @author 史进
 * @date 2014/5/27
 * @dependency
 *      null
 */
var xc = {
	Browser: {},                // 浏览器检测
	Global: {                   // 全局对象

    },
	GoTo: {},                   // 页面滚动
	Label: {},                  // 提示标签
    Confirm: {},                // 提示对话框
	Slider: {},                 // 滑动块
	Utils: {},                  // 工具类
	Controls: {                 // 控件集
		CImages:{}              //    图片展示
	},
	Share: {                    // 页面公用
		Common: {}              //    页面效果公用模块
	},
	App: {                      // 页面效果
		Index: {},              //    首页index.js
		HotIndex:{}             //    热门博主&热门博文
	}
};
window.XC = xc;
/**
 * @description 存储全局数据
 * @author 史进
 * @date 2014/5/28
 * @dependency
 *      jquery
 */

(function ($) {
    var exports = {};

    // 插件版本
    exports.version = '0.0.1';

    /**
     * 空函数
     */
    exports.noop = function () {
    };

    /**
     * 全局数据初始化
     * @param opts 参数
     */
    exports.init = function (opts) {
        // 默认参数
        var defaultOptions = {
            page: 'newest_blog_articles',                               // 默认首页
            templates: {
                root: '../../module/templates/'                         // 模板根目录
            },
            request: {
                root: '../../module/test_data/',                        // 请求地址根目录
                index_hot_object: 'indexHotObjects.json',               // 我的喜欢、热门主题、热门博文、热门图片主题
                newest_blog_articles: 'blogArticles.json',              // 最新动态
                my_blog_articles: 'myBlogArticles.json',                // 我的博文
                my_like_articles: 'myLikeArticles.json',                // 我的喜欢
                my_attention_articles: 'myAttentionArticles.json',      // 我的关注
                attention_user: 'attentionUser.json',                   // 关注用户
                expression_like: 'expressionLike.json',                 // 对博文加心
                add_hot_object: 'addHotObject.json',                    // 添加热门主题
                comment_list: 'commentList.json',                       // 评论列表
                transfer_commit: 'transferCommit.json',                 // 转载和评论
                hot_blogger: 'hotBlogers.json'                          // 热门博主
            }
        };

        // 设置参数
        exports.options = $.extend(defaultOptions, opts);
    };

    /**
     * 登录状态
     */
    exports.isLogin = false;                                            // 登录状态

    /**
     * ajax标识
     */
    exports.ajaxcode = -1;

    window.XC.Global = exports;
})(window.jQuery);
/**
 * @description 工具类。
 * @author 史进
 * @date 2014/5/27
 * @dependency
 *      jquery
 *
 */

(function ($) {

    var exports = {};

    /**
     * 转换成jquery对象
     * @param obj jquery对象或jquery选择器
     * @returns {$object}
     */
    exports.jquery = function (obj, $content) {
        var $obj = null;
        if (obj instanceof jQuery) {
            $obj = obj;
        } else {
            if ($content) {
                $obj = $(obj, $content);
            } else {
                $obj = $(obj);
            }
        }
        return $obj;
    };

    /**
     * URL地址解析
     * @param url 地址路径
     */
    exports.url = function (url) {
        var a = document.createElement('a');
        a.href = url;
        var obj = {
            source: url,
            relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
            protocol: a.protocol.replace(':', ''),
            host: a.hostname,
            port: a.port,
            path: a.pathname.replace(/^([^\/])/, '/$1'),
            file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
            query: a.search,
            params: (function () {
                var ret = {}, seg = a.search.replace(/^\?/, '').split('&'), len = seg.length, s;
                for (var i = 0; i < len; i++) {
                    if (!seg[i]) {
                        continue;
                    }
                    s = seg[i].split('=');
                    ret[s[0]] = s[1];
                }
                return ret;
            })(),
            anchor: a.hash,
            hash: a.hash.replace('#', ''),
            segments: a.pathname.replace(/^\//, '').split('/')
        };

        // 设置参数值
        obj.setParam = function (key, value) {
            obj.params[key] = encodeURIComponent(value);
            obj.query = '?' + $.param(obj.params);
        };

        // 获取参数值
        obj.getParam = function (key) {
            return decodeURIComponent(obj.params[key]);
        };

        // 删除参数
        obj.removeParam = function (key) {
            if (key in obj.params) {
                obj.params[key] = undefined;
                delete obj.params[key];
            }
            obj.query = '?' + $.param(obj.params);
        };

        // 将对象转换成URL地址
        obj.toURL = function () {
            return obj.protocol + '://' + obj.host + ':' + obj.port + obj.path + obj.query + obj.anchor;
        };

        return obj;
    };

    /**
     * html转码
     * @param html html代码
     * @returns {string}
     */
    exports.htmlEncode = function (html) {
        var temp = document.createElement("div");
        (temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
        var output = temp.innerHTML;
        temp = null;
        return output;
    };

    /**
     * html解码
     * @param text 转义后的html代码
     * @returns {string}
     */
    exports.htmlDecode = function (text) {
        var temp = document.createElement("div");
        temp.innerHTML = text;
        var output = temp.innerText || temp.textContent;
        temp = null;
        return output;
    };

    /**
     * 获取后缀名称
     * @param filename
     */
    exports.getExtensions = function (filename) {
        var result = /\.[^\.]+/.exec(filename);
        return result;
    };

    window.XC.Utils = exports;

})(window.jQuery);

/**
 * @description 浏览器检测。
 * @author 史进
 * @date 2014/5/28
 * @dependency
 *      无
 */

(function() {
	var exports = {};

	var BrowserDetect = {
		searchString: function(data) {
			for (var i = 0; i < data.length; i++) {
				var dataString = data[i].string;
				var dataProp = data[i].prop;
				this.versionSearchString = data[i].versionSearch || data[i].identity;
				if (dataString) {
					if (dataString.indexOf(data[i].subString) != -1)
						return data[i].identity;
				} else if (dataProp)
					return data[i].identity;
			}
		},
		searchVersion: function(dataString) {
			var index = dataString.indexOf(this.versionSearchString);
			if (index == -1) return;
			return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
		},
		dataBrowser: [
			{
				string: navigator.userAgent,
				subString: "Chrome",
				identity: "Chrome"
			},
			{    string: navigator.userAgent,
				subString: "OmniWeb",
				versionSearch: "OmniWeb/",
				identity: "OmniWeb"
			},
			{
				string: navigator.vendor,
				subString: "Apple",
				identity: "Safari",
				versionSearch: "Version"
			},
			{
				prop: window.opera,
				identity: "Opera",
				versionSearch: "Version"
			},
			{
				string: navigator.vendor,
				subString: "iCab",
				identity: "iCab"
			},
			{
				string: navigator.vendor,
				subString: "KDE",
				identity: "Konqueror"
			},
			{
				string: navigator.userAgent,
				subString: "Firefox",
				identity: "Firefox"
			},
			{
				string: navigator.vendor,
				subString: "Camino",
				identity: "Camino"
			},
			{		// for newer Netscapes (6+)
				string: navigator.userAgent,
				subString: "Netscape",
				identity: "Netscape"
			},
			{
				string: navigator.userAgent,
				subString: "MSIE",
				identity: "Explorer",
				versionSearch: "MSIE"
			},
			{
				string: navigator.userAgent,
				subString: "Gecko",
				identity: "Mozilla",
				versionSearch: "rv"
			},
			{ 		// for older Netscapes (4-)
				string: navigator.userAgent,
				subString: "Mozilla",
				identity: "Netscape",
				versionSearch: "Mozilla"
			}
		],
		dataOS: [
			{
				string: navigator.platform,
				subString: "Win",
				identity: "Windows"
			},
			{
				string: navigator.platform,
				subString: "Mac",
				identity: "Mac"
			},
			{
				string: navigator.userAgent,
				subString: "iPhone",
				identity: "iPhone/iPod"
			},
			{
				string: navigator.platform,
				subString: "Linux",
				identity: "Linux"
			}
		]
	};

	/**
	 * 操作系统名称
	 * Windows | Mac | iPhone/iPod | Linux | an unknown OS
	 */
	exports.os = BrowserDetect.searchString(BrowserDetect.dataOS) || "an unknown OS";

	/**
	 * 浏览器名称
	 * Chrome | Safari | Opera | Firefox | Explorer
	 * OmniWeb | iCab | Konqueror | Camino | Netscape | Mozilla | An unknown browser
	 */
	exports.name = BrowserDetect.searchString(BrowserDetect.dataBrowser) || "An unknown browser";

	/**
	 * 浏览器版本
	 * version | an unknown version
	 */
	exports.version = BrowserDetect.searchVersion(navigator.userAgent) || BrowserDetect.searchVersion(navigator.appVersion) || "an unknown version";

	window.XC.Browser = exports;
})();
/**
 * @description 页面滚动
 * @author 史进
 * @date 2014/5/28
 * @dependency
 *      jquery
 *      utils
 */

(function($, Utils) {
	var exports = {};
	var $body = $('html,body');

	/**
	 * 页面滚动指定距离
	 * @param far 距离
	 * @param opts 参数(second)
	 * @returns {promise}
	 */
	exports.far = function(far, opts) {
		// 默认参数
		var options = {
			second: 500
		};
		$.extend(options, opts);

		var animatePromise = $body.animate({scrollTop: far}, options.second).promise();
		return animatePromise;
	};

	/**
	 * 页面滚动指定距离
	 * @param $trigger 触发器
	 * @param opts 参数(second)
	 */
	exports.farWith = function($trigger, far, opts) {
		$trigger = Utils.jquery($trigger);
		$trigger.click(function() {
			exports.far(far, opts);
			return false;
		});
	};

	/**
	 * 前往顶部
	 * @param opts 参数(second)
	 * @returns {promise}
	 */
	exports.top = function(opts) {
		return exports.far(0, opts);
	};

	/**
	 * 前往顶部
	 * @param $trigger 触发器
	 * @param opts 参数(second)
	 */
	exports.topWith = function($trigger, opts) {
		$trigger = Utils.jquery($trigger);
		$trigger.click(function() {
			exports.top(opts);
			return false;
		});
	};

	/**
	 * 前往中间
	 * @param opts 参数(second)
	 * @returns {promise}
	 */
	exports.middle = function(opts) {
		var m = $body.height() / 2;
		return exports.far(m, opts);
	};

	/**
	 * 前往中间
	 * @param $trigger 触发器
	 * @param opts 参数(second)
	 */
	exports.middleWith = function($trigger, opts) {
		$trigger = Utils.jquery($trigger);
		$trigger.click(function() {
			exports.middle(opts);
			return false;
		});
	};

	/**
	 * 前往底部
	 * @param opts 参数(second)
	 * @returns {promise}
	 */
	exports.bottom = function(opts) {
		var b = $body.height();
		return exports.far(b, opts);
	};

	/**
	 * 前往底部
	 * @param $trigger 触发器
	 * @param opts 参数(second)
	 */
	exports.bottomWith = function($trigger, opts) {
		$trigger = Utils.jquery($trigger);
		$trigger.click(function() {
			exports.bottom(opts);
			return false;
		});
	};

	/**
	 * 每次页面滚动距离
	 * @param distance 滚动距离
	 * @param opts 参数(second)
	 * @returns {promise}
	 */
	exports.every = function(distance, opts) {
		var d = $body.scrollTop() + distance;
		return exports.far(d, opts);
	};

	/**
	 * 每次页面滚动距离
	 * @param $trigger 触发器
	 * @param distance 滚动距离
	 * @param opts 参数(second)
	 */
	exports.everyWith = function($trigger, distance, opts) {
		$trigger = Utils.jquery($trigger);
		$trigger.click(function() {
			exports.every(distance, opts);
			return false;
		});
	};

	/**
	 * 前往DOM
	 * @param $target 目标DOM
	 * @param opts 参数(second)
	 * @returns {promise}
	 */
	exports.dom = function($target, opts) {
		var $target = Utils.jquery($target);
		var t = $target.offset().top;
		return exports.far(t, opts);
	};

	/**
	 * 前往DOM
	 * @param $trigger 触发器
	 * @param $target 目标DOM
	 * @param opts 参数(second)
	 */
	exports.domWith = function($trigger, $target, opts) {
		$trigger = Utils.jquery($trigger);
		$trigger.click(function() {
			exports.dom($target, opts);
			return false;
		});
	};

	window.XC.GoTo = exports;
})(window.jQuery, window.XC.Utils);
/**
 * @description 提示标签。
 * @author 史进
 * @date 2014/5/28
 * @dependency
 *      jquery
 *      utils
 */

(function ($, Utils) {
    var exports = {};
    var tId = -1;

    /**
     * 显示状态信息
     * @param opts 参数
     */
    exports.state = function (opts) {
        // 默认参数
        var options = $.extend({
            el: '.attention_succeed',
            second: 3000
        }, opts);

        var $attention = Utils.jquery(options.el);
        if ($attention.length === 0) {
            $attention = $('<div class="attention_succeed"><i class="succeed"></i><span>关注标签成功！</span></div>');
            $('body').append($attention);
        }
        var ml = $attention.width() / 2;
        $attention.css('margin-left', -ml);
        $attention.fadeIn('show');

        if (tId !== -1) {
            clearTimeout(tId);
        }
        // 默认3秒自动关闭
        tId = setTimeout(function () {
            $attention.fadeOut('hide');
            tId = -1;
        }, options.second);

        return $attention;
    };

    /**
     * 显示失败状态消息
     * @param msg 消息
     * @param opts 参数
     */
    exports.showError = function (msg, opts) {
        var $attention = exports.state(opts);
        $attention.addClass('attention_error');
        $attention.find('span').text(msg);
    };

    /**
     * 显示成功状态消息
     * @param msg 消息
     * @param opts 参数
     */
    exports.showSuccess = function (msg, opts) {
        var $attention = exports.state(opts);
        $attention.removeClass('attention_error');
        $attention.find('span').text(msg);
    };

    /**
     * 显示关注成功标签
     * @param opts 参数
     */
    exports.showAttentionSucceed = function (opts) {
        var $attention = exports.state(opts);
        $attention.removeClass('attention_error');
        $attention.find('span').text('关注标签成功');
    };

    /**
     * 显示加载信息更多信息
     * @param opts 参数
     */
    exports.showLoading = function (opts) {
        var options = $.extend({
            content: '<div class="celar mt20 t_loading"><div class="fr main_fl_conter"><div class="celar"><div class="main_fl_conter_conter fr"><div class="loading">为你加载更多内容中...</div></div></div></div></div>',
            position: 'bottom'
        }, opts);

        var $articles = $('.main_fl');
        var $trends = $('.trends');
        if (options.position === 'top') {
            $trends.after(options.content);
            $trends.hide();
        } else if (options.position === 'bottom') {
            $articles.append(options.content);
        } else {
            console.warn('参数position没有：%d', options.position);
        }
    };

    /**
     * 隐藏加载信息更多信息
     */
    exports.hideLoading = function () {
        $('.t_loading').fadeOut('hide').remove();
    };

    /**
     * 显示最新粉丝数
     * @param n 人
     */
    exports.showFans = function (n) {
        var html = '';
        html += '<div class="fans" style="display:none;">';
        html += '    <div class="fans_top"></div>';
        html += '    <ul class="fans_main celar">';
        html += '        <li>' + n + '位新粉丝，<a href="../usercenter/relation_center.aspx?type=fans" target="_blank" onclick="javascript:XC.Label.hideFans()">点击查看</a></li>';
        html += '        <li><a href="javascript:XC.Label.hideFans()"></a> </li>';
        html += '    </ul>';
        html += '</div>';
        var $fans = $(html);

        $('#TopContent').append($fans);
        $fans.fadeIn('show');
    };

    exports.hideFans = function () {
        $('.fans', '#TopContent').fadeIn('hide').remove();
        return false;
    };

    /**
     * 显示私信
     * @param n 显示私信
     */
    exports.showLetter = function (n) {
        $('#pletters').html('<div class="NewTips"><a href="">' + n + '</a></div>');
    };

    exports.hideLetter = function () {
        $('#pletters').html('');
    };

    window.XC.Label = exports;
})(window.jQuery, window.XC.Utils);



/**
 * @description 滑动条效果
 * @author 史进
 * @date 2014/5/28
 * @dependency
 *      jquery
 *      utils
 */

(function($, Utils) {
	var exports = {};

	/**
	 * 菜单hover切换
	 * @param el 菜单对象
	 */
	exports.nav = function(el) {
		if (!el) el = '.nav';
		var $nav = Utils.jquery(el);

		var $selectedItem = $('.current', $nav);
		$nav.mouseleave(function() {
			$selectedItem.addClass('current');
			$selectedItem.siblings().removeClass('current');
		});

		var $list = $nav.find('li');
		$list.mouseenter(function() {
			var $item = $(this);
			$item.addClass('current');
			$item.siblings().removeClass('current');
		});
	};

	window.XC.Slider = exports;
})(window.jQuery, window.XC.Utils);




/**
 * @description 图片展示。
 * @author 史进
 * @date 2014/6/11
 * @dependency
 *      jquery
 *      XC
 */
(function ($, XC) {
    var exports = {};
    var $body = $('body');
    var CImages = "";
    CImages += '<div class="c_images">';
    CImages += '	<div class="c_images_container">';
    CImages += '		<a href="#" class="c_images_prev"><img class="lazy" /></a>';
    CImages += '		<a href="#" class="c_images_next"><img class="lazy" /></a>';
    CImages += '		<div class="c_images_current">';
    CImages += '			<img class="lazy"/>';
    CImages += '			<div class="c_images_meta">';
    CImages += '				<p>{{desc}}</p>';
    CImages += '				<p><a href="{{link}}" target="_blank">查看原图（{{size}}）</a></p>';
    CImages += '			</div>';
    CImages += '		</div>';
    CImages += '	</div>';
    CImages += '</div>';
    var $CImages = $(CImages);
    var max = 0;
    var gIndex = 0;
    var winWidth = $(window).width();
    var winHeight = $(window).height();


    /**
     * 初始化图片展示
     * @param root 图片根目录
     * @param images 图片列表
     * @param index 当前显示
     */
    exports.init = function (root, images, index) {
        winWidth = $(window).width();
        winHeight = $(window).height();

        gIndex = index;
        // 显示遮罩层
        var $mask = $('<div class="mask cmask"></div>');
        $body.addClass('mask_open');
        $body.append($mask);

        // 图片展示结构
        if (!index) {
            index = 0;
        }

        $body.append($CImages);
        $CImages.click(function () {
            exports.close();
        });
        var $prev = $('.c_images_prev', $CImages);
        var $next = $('.c_images_next', $CImages);
        var $current = $('.c_images_current', $CImages);
        var $meta = $('.c_images_meta', $CImages);

        max = images.length;
        exports.show(root, images, index);

        $current.click(function (e) {
            if (e.target.nodeName.toLowerCase() === 'a') {
                e.stopPropagation();
            } else {
                if (gIndex < max - 1) {
                    var maxW = winWidth - 110 * 2 - 100; // 总宽-左右图-间距
                    var maxH = winHeight - 50 - 100; // 总高-描述高度-间距
                    var w = images[gIndex + 1].width;
                    var h = images[gIndex + 1].height;
                    //w = w < maxW ? w : maxW; // 图片宽
                    //h = h < maxH ? h : maxH; // 图片高
                    if (h > maxH) {
                        w = w * maxH / h;
                        h = maxH;
                    }
                    if (w > maxW) {
                        h = h * maxW / w;
                        w = maxW;
                    }

                    // $current.hide();
                    var cPromise = $current.animate({
                        width: '110px',
                        height: '200px',
                        opacity: 0,
                        left: 0,
                        top: (winHeight - 200) / 2
                    }, 700).promise();
                    var nPromise = $next.animate({
                        width: parseInt(w)+'px',
                        height: parseInt(h)+'px',
                        opacity: 1,
                        left: (winWidth - parseInt(w)) / 2,
                        top: (winHeight - parseInt(h) ) / 2
                    }, 700).promise();
                    $.when(cPromise, nPromise).done(function () {
                        $current.css({
                            opacity: 1
                        });
                        $next.css({
                            width: '110px',
                            height: '200px',
                            left: winWidth - 92,
                            top: (winHeight - 200) / 2
                        }).fadeIn('show', function () {
                            //debugger;
                            exports.show(root, images, gIndex + 1);
                        });
                    });
                }
                e.stopPropagation();
                e.preventDefault();
            }
        });

        $prev.click(function (e) {
            var maxW = winWidth - 110 * 2 - 100; // 总宽-左右图-间距
            var maxH = winHeight - 50 - 100; // 总高-描述高度-间距
            var w = images[gIndex - 1].width;
            var h = images[gIndex - 1].height;
            // w = w < maxW ? w : maxW; // 图片宽
            // h = h < maxH ? h : maxH; // 图片高

            if (h > maxH) {
                w = w * maxH / h;
                h = maxH;
            }
            if (w > maxW) {
                h = h * maxW / w;
                w = maxW;
            }

            //$current.hide();
            var cPormise = $current.animate({
                width: '110px',
                height: '200px',
                opacity: 0,
                left: winWidth - 92,
                top: (winHeight - 200) / 2
            });
            var pPromise = $prev.animate({
                width: parseInt(w)+'px',
                height: parseInt(h)+'px',
                opacity: 1,
                left: (winWidth - parseInt(w)) / 2,
                top: (winHeight - parseInt(h) ) / 2
            }, 700).promise();
            $.when(cPormise, pPromise).done(function () {
                $current.css({
                    opacity: 1
                });
                $prev.css({
                    width: '110px',
                    height: '200px',
                    left: 0,
                    top: (winHeight - 200) / 2,
                    opacity: 0.5
                }).fadeIn('show', function () {
                    exports.show(root, images, gIndex - 1);
                });
            });
            e.stopPropagation();
            e.preventDefault();
        });

        $next.click(function (e) {
            var maxW = winWidth - 110 * 2 - 100; // 总宽-左右图-间距
            var maxH = winHeight - 50 - 100; // 总高-描述高度-间距
            var w = images[gIndex + 1].width;
            var h = images[gIndex + 1].height;
            // w = w < maxW ? w : maxW; // 图片宽
            // h = h < maxH ? h : maxH; // 图片高

            if (h > maxH) {
                w = w * maxH / h;
                h = maxH;
            }
            if (w > maxW) {
                h = h * maxW / w;
                w = maxW;
            }

            var cPromise = $current.animate({
                width: '110px',
                height: '200px',
                opacity: 0,
                left: 0,
                top: (winHeight - 200) / 2
            }, 700).promise();
            var nPromise = $next.animate({
                width: parseInt(w)+'px',
                height: parseInt(h)+'px',
                opacity: 1,
                left: (winWidth - parseInt(w)) / 2,
                top: (winHeight - parseInt(h)) / 2
            }, 700).promise();
            $.when(cPromise, nPromise).done(function () {
                $current.css({
                    opacity: 1
                });
                $next.css({
                    width: '110px',
                    height: '200px',
                    left: winWidth - 92,
                    top: (winHeight - 200) / 2
                }).fadeIn('show', function () {
                    exports.show(root, images, gIndex + 1);
                });
            });
            e.stopPropagation();
            e.preventDefault();
        });
    };

    /**
     * 显示第index张图片
     * @param root 图片根目录
     * @param images 图片列表
     * @param index 当前显示
     */
    exports.show = function (root, images, index) {
        gIndex = index;
        var c_image = images[gIndex];
        var p_image = images[gIndex - 1];
        var n_image = images[gIndex + 1];
        var $current = $('.c_images_current', $CImages);

        //debugger;
        // 设置图片大小
        var maxW = winWidth - 110 * 2 - 100; // 总宽-左右图-间距
        var maxH = winHeight - 50 - 100; // 总高-描述高度-间距
        // var w = c_image.width < maxW ? c_image.width : maxW; // 图片宽
        // var h = c_image.height < maxH ? c_image.height : maxH; // 图片高
        var w = c_image.width;
        var h = c_image.height;
        if (h > maxH) {
            w = w * maxH / h;
            h = maxH;
        }
        if (w > maxW) {
            h = h * maxW / w;
            w = maxW;
        }
        console.log(w+','+h);
        $current.css({
            'width': parseInt(w)+'px',
            'height': parseInt(h)+'px',
            left: (winWidth - parseInt(w)) / 2,
            top: (winHeight - parseInt(h) ) / 2
        });

        // 设置图片
        var $img = $current.find('img');
        $img.attr('src', root + 'small/small_' + c_image.image);
        $img.attr('data-original', root + 'small/middle_' + c_image.image);




        var $prev = $('.c_images_prev', $CImages);
        var $next = $('.c_images_next', $CImages);


        if (images.length === 0 || images.length === 1) {
            $prev.hide();
            $next.hide();
            p_image = null;
            n_image = null;
        } else if (gIndex === 0) {
            $prev.hide();
            p_image = null;
        } else if (gIndex === images.length - 1) {
            $next.hide();
            n_image = null;
        }






        $current.find('p').first().html(c_image.desc).width(w).attr('title', c_image.desc);
        //$current.find('a').html('查看原图（' + c_image.size + '）').attr('href', root + 'initial_' + c_image.link);
        $current.find('a').html('查看原图').attr('href', root + 'initial_' + c_image.link);

        // 左右图片
        if (p_image) {
            $prev.find('img').attr('data-original', root + 'small/small_' + p_image.image);
            $prev.css({
                left: 0,
                top: (winHeight - 200) / 2
            });
            $prev.fadeIn('show');
        }
        if (n_image) {
            $next.find('img').attr('data-original', root + 'small/small_' + n_image.image);
            $next.css({
                left: winWidth - 92,
                top: (winHeight - 200) / 2
            });
            $next.fadeIn('show');
        }

        // 异步加载图片
        $('.c_images').find('.lazy').lazyload();
    };

    /**
     * 关闭
     */
    exports.close = function () {
        $CImages.remove();
        $('.mask').remove();
        $body.removeClass('mask_open');
    };

    XC.Controls.CImages = exports;
})(window.jQuery, window.XC);
/**
 * @description 提示对话框。
 * @author 史进
 * @date 2014/7/17
 * @dependency
 *      jquery
 *      XC
 */
(function ($, XC) {
    var exports = {};

    /**
     * 创建一个对话框（招聘）
     * @param opts 参数
     */
    exports.open = function (opts) {
        var $body = $('body');

        var options = {
            title: '提示',
            text: '确定操作？',
            fnAlways: function () {
            },
            fnDone: function () {
            },
            fnFail: function () {
            }
        };
        options = $.extend(options, opts);

        // 对话框
        var CConfirm = '';
        CConfirm += '<div class="pop confirm" style="position: fixed;top:30%;left:50%;margin-left:-280px;z-index:100000;">';
        CConfirm += '    <div class="pop_top">';
        CConfirm += '        <span class="fl">{{title}}</span>';
        CConfirm += '        <a href="" class="fr data_delete"></a>';
        CConfirm += '    </div>';
        CConfirm += '    <p class="pop_title">{{text}}</p>';
        CConfirm += '    <div class="pop_bottom">';
        CConfirm += '        <a href="#" class="pop_done">确定</a>';
        CConfirm += '        <a href="#" class="pop_cancel">取消</a>';
        CConfirm += '    </div>';
        CConfirm += '</div>';

        // 数据替换
        CConfirm = CConfirm.replace(/{{title}}/g, options.title);
        CConfirm = CConfirm.replace(/{{text}}/g, options.text);

        // 事件绑定
        var $CConfirm = $(CConfirm);
        var $done = $CConfirm.find('.pop_done');
        var $fail = $CConfirm.find('.pop_cancel');
        var $close = $CConfirm.find('.data_delete');

        $done.on('click', function () {
            options.fnAlways();
            options.fnDone();
            exports.close();
            return false;
        });
        $fail.on('click', function () {
            options.fnAlways();
            options.fnFail();
            exports.close();
            return false;
        });
        $close.on('click', function () {
            options.fnAlways();
            exports.close();
            return false;
        });

        showMask();
        $body.append($CConfirm);
    };

    /**
     * 创建一个对话框（博客）
     * @param opts 参数
     */
    exports.openB = function (opts) {
        var $body = $('body');

        var options = {
            text: '你确定要删除该博文吗？',
            fnAlways: function () {
            },
            fnDone: function () {
            },
            fnFail: function () {
            }
        };
        options = $.extend(options, opts);

        // 对话框
        var CConfirm = '';
        CConfirm += '<div class="prompt confirm">';
        CConfirm += '<div><i class="prompt_delete data_delete"></i></div>';
        CConfirm += '<p>{{text}}</p>';
        CConfirm += '    <div class="prompt_div">';
        CConfirm += '        <a href="#" class="pop_done">确定</a>';
        CConfirm += '        <a href="#" class="pop_cancel">取消</a>';
        CConfirm += '    </div>';
        CConfirm += '</div>';

        // 数据替换
        CConfirm = CConfirm.replace(/{{text}}/g, options.text);

        // 事件绑定
        var $CConfirm = $(CConfirm);
        var $done = $CConfirm.find('.pop_done');
        var $fail = $CConfirm.find('.pop_cancel');
        var $close = $CConfirm.find('.data_delete');

        $done.on('click', function () {
            options.fnAlways();
            options.fnDone();
            exports.close();
            return false;
        });
        $fail.on('click', function () {
            options.fnAlways();
            options.fnFail();
            exports.close();
            return false;
        });
        $close.on('click', function () {
            options.fnAlways();
            exports.close();
            return false;
        });

        showMask();
        $body.append($CConfirm);
    };

    /**
     * 关闭对话框
     */
    exports.close = function () {
        var $body = $('body');
        $('.confirm', $body).remove();
        closeMask();
    };

    /**
     *  打开遮罩层
     */
    function showMask() {
        var $body = $('body');
        var $mask = $('<div class="mask breaksbox_bg"></div>');
        $body.addClass('mask_open');
        $body.append($mask);
    }

    /**
     *  关闭遮罩层
     */
    function closeMask() {
        var $body = $('body');
        $('.mask', $body).remove();
        $body.removeClass('mask_open');
    }


    /**
     * 提示用户登录（博客）
     */
    exports.tipLogin = function (opts) {
        var $body = $('body');

        var options = {
            text: '您需要登录后才可以操作',
            fnAlways: function () {
            },
            fnDone: function () {
            },
            fnFail: function () {
            }
        };
        options = $.extend(options, opts);

        // 对话框（旧版）
        //var CConfirm = '';
        //CConfirm += '<div class="prompt confirm">';
        //CConfirm += '    <div><i class="prompt_delete data_delete"></i></div>';
        //CConfirm += '    <p>{{text}}<a href="../usercenter/Login.aspx">登录</a>|<a href="../usercenter/Register.aspx">立即注册</a></p>';
        //CConfirm += '    <div class="prompt_div"><a href="#" class="pop_done">我知道了</a></div>';
        //CConfirm += '</div>';

        // 对话框（新版）
        var CConfirm = [
            '<div id="breaksbox_container" class="confirm">',
            '   <div class="middle">',
            '       <div class="breaksbox">',
            '           <div class="breaksbox_head">',
            '               <span class="breaksbox_title">提示</span>',
            '               <a href="#" class="close prompt_delete data_delete"></a>',
            '           </div>',
            '           <div class="breaksbox_content">',
            '               <p>{{text}}<a href="../login/login.aspx">登录</a>|<a href="../login/registerGuider.aspx">立即注册</a></p>',
            '               <div class="prompt_div"><a href="#" class="pop_done">我知道了</a></div>',
            '           </div>',
            '       </div>',
            '   </div>',
            '</div>'
        ].join('');

        // 数据替换
        CConfirm = CConfirm.replace(/{{text}}/g, options.text);

        // 事件绑定
        var $CConfirm = $(CConfirm);
        var $done = $CConfirm.find('.pop_done');
        var $fail = $CConfirm.find('.pop_cancel');
        var $close = $CConfirm.find('.data_delete');

        $done.on('click', function () {
            options.fnAlways();
            options.fnDone();
            exports.close();
            return false;
        });
        $fail.on('click', function () {
            options.fnAlways();
            options.fnFail();
            exports.close();
            return false;
        });
        $close.on('click', function () {
            options.fnAlways();
            exports.close();
            return false;
        });

        showMask();
        $body.append($CConfirm);
    };


    XC.Confirm = exports;
})(window.jQuery, window.XC);