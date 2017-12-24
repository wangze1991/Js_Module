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
                if (/(y+)/.test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
                }
                for (var k in o) {
                    if (new RegExp("(" + k + ")").test(fmt)) {
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                    }
                }
                return fmt;
            }
        };
    })();

    /**
     * 字符串公共方法
     */
    (function () {

        /**string 扩展方法  字符串格式化
         */
        // String.prototype.format = function (args) {
        //     var result = this;
        //     if (arguments.length > 0) {
        //         if (arguments.length == 1 && typeof (args) == "object") {
        //             for (var key in args) {
        //                 if (args[key] != undefined) {
        //                     var reg = new RegExp("({" + key + "})", "g");
        //                     result = result.replace(reg, args[key]);
        //                 }
        //             }
        //         }//example   var template2="我是{name}，今年{age}了";var result2=template2.format({name:"loogn",age:22});
        //         else {
        //             for (var i = 0; i < arguments.length; i++) {
        //                 if (arguments[i] != undefined) {
        //                     var reg = new RegExp("({)" + i + "(})", "g");
        //                     result = result.replace(reg, arguments[i]);
        //                 }
        //             }//expample var template1="我是{0}，今年{1}了"; var result1=template1.format("loogn",22);
        //         }
        //     }
        //     return result;
        // };

        utils.stringUtil = {
            /**
             * string 参数格式化
             * @param source
             * @param params
             * @returns {*}
             */
            format: function (source, params) {
                if (arguments.length == 1) {
                    return source;
                }
                if (arguments.length > 2 && params.constructor != Array) {
                    params = $.makeArray(arguments).slice(1);
                }
                if (params.constructor != Array) {
                    params = [params];
                }
                $.each(params, function (i, n) {
                    source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
                });
                return source;
            },
            'trim': function (str) {
                return $.trim(str);
            },
            'isBlank': function (str) {
                return !utils.isNotBlank(str);
            },
            'isNotBlank': function (str) {
                if (str || str === 0) {
                    return $.trim(str).length > 0;
                }
                return false;
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
                        $(this).prop("checked", val == "True" || val === true);
                    } else if ((this.type == "radio")) {
                        $("input[name=" + this.name + "][value=" + val + "]").prop("checked", true);
                    }
                });
                $('textarea,select', $form).each(function () {
                    if (param.hasOwnProperty(this.name) === false) {
                        return true;
                    }
                    $(this).val(param[this.name]);
                });
            },
            /**
             * 表单值转换为[{name:'',value}]键值对,也可以直接使用jquery.serialize
             */
            'formToArray': function ($form) {
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
                        if ($(el).prop("checked") !== true) {
                            continue;
                        }

                    }
                    if (el.type == 'radio') {
                        if ($(el).prop("checked") !== true) {
                            continue;
                        }
                    }
                    v = $.trim($(el).val());
                    if (v && v.constructor === Array) {
                        for (j = 0, jmax = v.length; j < jmax; j++) {
                            a.push({name: n, value: v[j]});
                        }
                    } else if (v !== null && typeof v != 'undefined' && v !== '') {
                        a.push({name: n, value: v});
                    }
                }
                return a;
            },


            'formToObject': function () {

            }
        };
    })();


    /**
     * 一些公用的jquery 公用方法
     */
    (function () {

        // jQuery.prototype.serializeObject=function(){
        //     var a,o,h,i,e;
        //     a=this.serializeArray();
        //     o={};
        //     h=o.hasOwnProperty;
        //     for(i=0;i<a.length;i++){
        //         e=a[i];
        //         if(!h.call(o,e.name)){
        //             o[e.name]=e.value;
        //         }
        //     }
        //     return o;
        // };

        $.fn.serializeObject = function () {
            var o = {};
            //var nameArray = [];
            var a = this.serializeArray();
            $.each(a, function () {
                //存在 name相同的情况
                var val = $.trim(this.value || '');
                if (o[this.name] !== undefined) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                        //nameArray.push(this.name);//防止重复(第一次才添加)
                    }
                    o[this.name].push(val);

                } else {
                    o[this.name] = val;
                }
            });
            // $.each(nameArray, function (i, item) {
            //     o[item] = o[item].join(',');
            // });
            return o;
        };

        /**绑定参数
         */
        ;(function () {
            $.fn.bindForm = function (params) {
                var me = this;
                return me.each(function () {
                    var self = this;
                    new FormBind({'form': $(self), 'params': params}).bind();
                });
            }

            function FormBind(opt) {
                this.form = opt.form;
                this.params = opt.params;
            }

            FormBind.prototype.bind = function () {
                var self = this;
                if (!self.params) {
                    return;
                }
                $('input', self.form).each(function () {
                    var me = this;
                    if ($(me).attr('data-bind-ignore') == 'true') return true;//continue
                    var val = self.timeFormatter(self.params[me.name]);
                    //if (typeof val === 'object') return true;
                    if (me.type == "text" || me.type == "hidden") {
                        $(me).val(val);
                    }
                    else if (me.type == "checkbox") {
                        if ($.isArray(val)) {
                            if ($.inArray($(me).val(), val) != -1) {
                                $(me).prop("checked", true).click();
                            }
                        } else {
                            $(me).attr("checked", val == "True" || val == true).click();
                        }
                    }
                    else if ((me.type == "radio")) {
                        $("input[name=" + me.name + "][value=" + val + "]").prop("checked", true).click();
                    }
                });
                //这里也只考虑SELECT单选的情况(多选要重写)
                $('textarea,select', self.form).each(function () {
                    var val = self.params[this.name];
                    if (val === null || val === undefined) {
                        return;
                    }
                    $(this).val((self.params[this.name]));
                });
                //$('select', self.form).each(function () {
                //    var val = self.params[this.name];
                //    if (val === null) return;
                //    $(this).find("option[value='" +val.toString()+ "']").prop("selected", true);
                //});
                $('label', self.form).each(function () {
                    var val = self.timeFormatter(self.params[$(this).attr("name")]);
                    $(this).html(val);
                });
            }
            FormBind.prototype.timeFormatter = function (value) {
                if (!value || value !== 0) {
                    return value;
                }
                var date;
                if (value.toString().indexOf("\/Date(") == -1) {
                    return value;
                }
                date = new Date(parseInt(value.replace("/Date(", "").replace(")/", ""), 10));
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                var d = date.getDate();
                var t = y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d) + ' ';
                var hh = date.getHours();
                var mm = date.getMinutes();
                var ss = date.getSeconds();
                if (ss === 0 && hh === 0 && mm === 0) {
                    return t;
                }
                t += (hh < 10 ? ('0' + hh) : hh) + ':' + (mm < 10 ? ('0' + mm) : mm) + ':' + (ss < 10 ? ('0' + ss) : ss);
                return t;
            };
        })();


    })();


    return utils;
})();