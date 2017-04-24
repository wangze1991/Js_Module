/**
 * Created by wangze on 2016/12/30.
 */
;(function () {
    "use strict";
    var utils = {};


    /**
     * 关闭当前页面
     */
    function closeWebPage() {
        if (navigator.userAgent.indexOf("MSIE") > 0) {//close IE
            if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
                window.opener = null;
                window.close();
            } else {
                window.open('', '_top');
                window.top.close();
            }
        }
        else if (navigator.userAgent.indexOf("Firefox") > 0) {//close firefox
            window.location.href = 'about:blank ';
        } else {//close chrome;It is effective when it is only one.
            window.opener = null;
            window.open('', '_self');
            window.close();
        }
    }

    /**
     * 获取浏览器类型
     */
    function explorerTest() {

    }


    /**
     * 转换成jquery对象
     * @param obj jquery对象或jquery选择器
     * @returns {$object}
     */
    utils.jquery = function (obj, $content) {
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
     * 日期公共函数
     * @param obj
     * @param $content
     * @returns {*}
     */

    (function () {
        utils.dateUtil = {
            format: function (time, fmt) {
                var o = {
                    "M+": time.getMonth() + 1, //月份
                    "d+": time.getDate(), //日
                    "h+": time.getHours(), //小时
                    "m+": time.getMinutes(), //分
                    "s+": time.getSeconds(), //秒
                    "q+": Math.floor((time.getMonth() + 3) / 3), //季度
                    "S": time.getMilliseconds() //毫秒
                };
                if (/(y+)/.test(fmt))
                    fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt))
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
            }
        };
    })();

    /**
     * 字符串公共方法
     */
    (function () {
        utils.stringUtil = {
            /**字符串格式化
             @param str 字符串
             @param value 替换值
             @example  "我是{0},身高{1}"
             */
            'format': function (str, value) {
                if (utils.isn)
                    for (var i = 0; i < arguments.length; i++) {
                        var j = i + 1;
                        if (arguments[j] != undefined) {
                            var reg = new RegExp("({)" + i + "(})", "g");
                            str = str.replace(reg, arguments[j]);
                        }
                    }
                return str;
            },
            'trim': function (s) {
                // return $.trim(str);
                var str = "" + s,
                    ws = /\s/,
                    i = str.length;
                str = str.replace(/^\s\s*/, "");
                while (ws.test(str.charAt(--i))) {};
                return str.slice(0, i + 1);
            },
            'isBlank': function (str) {
                return !utils.isNotBlank(str);
            },
            'isNotBlank': function (str) {
                if (str === undefined || str === null || str === '') {
                    return false;
                }
                return $.trim(str).length > 0;
            }
        };
    })();

    /**
     * 表单公共方法
     */
    (function () {
        utils.formUtil = {
            /**
             * 绑定表单
             * @param form
             * @param param
             */
            'bindForm': function (form, param) {
                var $form = $(form);
                if (!param) {
                    return;
                }
                $('input', $form).each(function () {
                    if (param.hasOwnProperty(this.name) === false) {
                        return true;
                    }
                    var val = param[this.name];
                    //如果是数组，这里直接不判断,单独写方法重构，遇到具体情况在分析。
                    if ($.isArray(val)) {
                        return true;
                    }
                    if (typeof val === 'object') {
                        return true;
                    }
                    if (this.type == "text" || this.type == "hidden") {
                        $(this).val(val);
                    } else if (this.type == "checkbox") {
                        $(this).prop("checked", val == "True" || val == true);
                    } else if ((this.type == "radio")) {
                        $("input[name=" + this.name + "][value=" + val + "]").prop("checked", true);
                    }
                });
                $('textarea,select', $form).each(function () {
                    if (param.hasOwnProperty(this.name) === false) {
                        return true
                    }
                    ;
                    $(this).val(param[this.name]);
                });
            }
            /**
             * 表单值转换为[{name:'',value}]键值对,也可以直接使用jquery.serialize
             */
            , 'formToArray': function ($form) {
                var a = [];
                if ($form.length === 0) {
                    return a;
                }
                var form = $form[0];
                var els = form.elements;
                if (!els) {
                    return a;
                }
                var i, j, n, v, el, max, jmax;
                for (i = 0, max = els.length; i < max; i++) {
                    el = els[i];
                    n = el.name;
                    if (!n) {
                        continue;
                    }
                    if (el.type == 'checkbox') {
                        if ($(el).prop("checked") !== true)
                            continue;
                    }
                    if (el.type == 'radio') {
                        if ($(el).prop("checked") !== true)
                            continue;
                    }
                    v = $.trim($(el).val());
                    if (v && v.constructor === Array) {
                        for (j = 0, jmax = v.length; j < jmax; j++) {
                            a.push({name: n, value: v[j]});
                        }
                    } else if (v !== null && typeof v != 'undefined' && v != '') {
                        a.push({name: n, value: v});
                    }
                }
                return a;
            },'formToObject': function () {

            }
        };
    })();

    return utils;
})();