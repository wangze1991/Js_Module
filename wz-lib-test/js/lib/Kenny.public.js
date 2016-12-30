/**
* public js
* @author kenny 89335272@qq.com
* 
*/
if (typeof ($.validator) == 'function') {
    $.validator.addMethod("kennychecked", function (value, element, params) {
        if (value.length < 1) {
            return false;
        }
        if (value != params) {
            return true;
        } else {
            return false;
        }
    }, "必须选择一项");
}
function clearNoMoney(obj) {
    obj.value = obj.value.replace(/[^\d.-]/g, "");  //清除“数字”和“.”和“-”以外的字符
    //   obj.value = obj.value.replace(/^\./g, "");  //验证第一个字符是数字而不是. 
    obj.value = obj.value.replace(/\-{2,}/g, "-"); //只保留第一个- 清除多余的- 
    obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的. 
    obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    obj.value = obj.value.replace("-", "$#$").replace(/\-/g, "").replace("$#$", "-");
}
function clearNoNum(obj) {
    obj.value = obj.value.replace(/[^\d-]/g, "");  //清除“数字”和“-”以外的字符
    obj.value = obj.value.replace(/\-{2,}/g, "-"); //只保留第一个- 清除多余的- 
    obj.value = obj.value.replace("-", "$#$").replace(/\-/g, "").replace("$#$", "-");
}

//过滤json 去除pre标签
function FilterJson(data) {
    var reg = /<pre.+?>(.+)<\/pre>/g;
    var result = data.match(reg);
    data = RegExp.$1;
    data = eval('(' + data + ')');
    return data;
}
function checkload() {
    $(":checkbox").each(function () {
        //  alert($(this).attr("value") == undefined)
        if (typeof ($(this).attr("value")) != "undefined") {
            if ($(this).attr("value") == "True" || $(this).attr("value") == "true") {
                $(this).attr("checked", true);
                if ($(this).next(":hidden").length > 0) {
                    $(this).next().val(true);
                }
            } else {
                $(this).attr("checked", false);
                if ($(this).next(":hidden").length > 0) {
                    $(this).next().val(false);
                }
            }
        } else {
            $(this).attr("checked", false);
        }

    });
    $(":checkbox").bind("click", function () {
        if ($(this).is(":checked")) {
            $(this).val(true);
            if ($(this).next(":hidden").length > 0) {
                $(this).next().val(true);
            }
        } else {
            $(this).val(false);
            if ($(this).next(":hidden").length > 0) {
                $(this).next().val(false);
            }
        }

    });
}


//add by wangze
; (function (win) {
    var exports = win.utils || {};
    /**获取查询参数
    */
    exports.getParam = function (selector) {
        var obj = {};
        exports.jquery(selector).each(function () {
            var self = this;
            var value = $.trim($(self).val());
            if (value || value == '0') {
                if (self.type == 'checkbox') {
                    if (!$(self).prop('checked')) return true;
                    if (obj[self.name] && $.isArray(obj[self.name])) {
                        obj[self.name].push(value);
                    } else {
                        obj[self.name] = [];
                        obj[self.name].push(value);
                    }
                    return true;
                } 
                  obj[self.name] = value;
            }
        });
        $.each(obj, function (i, item) {
            if ($.isArray(item)) {
                obj[i] = item.join(',');
            }
        })
        return obj;
    };
    exports.getCheckBoxArray = function (selector) {
        var array = [];
        exports.jquery(selector).each(function () {
            var self = this;
            var value = $.trim($(self).val());
            if (value) {
                array.push(value);
            }
        });
        return array;
    }
    /**获取url hash
    *@param name 名称
    *@param url  地址
    */
    exports.getQuery = function (name, url) {
        var u = arguments[1] || window.location.search
            , reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
            , r = u.substr(u.indexOf("?") + 1).match(reg);
        return r != null ? r[2] : "";
    }
    exports.getCheckBoxArray = function (selector) {

    }
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
    win.utils = exports;
})(window);

/**绑定参数
*/
; (function () {
    $.fn.formBind = function (params) {
        var me = this;
        return me.each(function () {
            var self = this;
            new FormBind({ 'form': $(self), 'params': params }).bind();
        });
    }
    function FormBind(opt) {
        this.form = opt.form;
        this.params = opt.params;
    }
    FormBind.prototype.bind = function () {
        var self = this;
        if (!self.params) return;
        $('input', self.form).each(function () {
            var val =self.timeFormatter(self.params[this.name]);
            if (typeof val === 'object') return true;
            if (this.type == "text" || this.type == "hidden") {
                $(this).val(val);
            }
            else if (this.type == "checkbox") {
                $(this).attr("checked", val == "True" || val == true);
            }
            else if ((this.type == "radio")) {
                $("input[name=" + this.name + "][value=" + val + "]").attr("checked", true);
            }
        });
        $('textarea,select', self.form).each(function () {
            $(this).val(self.params[this.name]);
        });
        $('label', self.form).each(function () {
            var val = self.timeFormatter(self.params[$(this).attr("name")]);
            $(this).html(val);
        });
    }
    FormBind.prototype.timeFormatter = function (value) {
        if (value == null || value == "") return value;
        if (value == '/Date(-62135596800000)/') return '';
        var date;
        if (value.toString().indexOf("\/Date(") > -1) {
            date = new Date(parseInt(value.replace("/Date(", "").replace(")/", ""), 10));
        }
        else
            return value;
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        var t = y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d) + ' ';
        var hh = date.getHours();
        var mm = date.getMinutes();
        var ss = date.getSeconds();
        if (ss === 0 && hh === 0 && mm == 0) return t;
        t += (hh < 10 ? ('0' + hh) : hh) + ':' + (mm < 10 ? ('0' + mm) : mm) + ':' + (ss < 10 ? ('0' + ss) : ss);
        return t;
    }
})();


//格式化时间格式
function timeFormatter(value,isShort) {
    if (value == null || value == "") return value;
    if (value == '/Date(-62135596800000)/') return '';
    var date;
    if (value.toString().indexOf("Date") > -1) {
        date = new Date(parseInt(value.replace("/Date(", "").replace(")/", ""), 10));
    }
    else
        date = new Date(value);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var t = y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d) + ' ';
    var hh = date.getHours();
    var mm = date.getMinutes();
    var ss = date.getSeconds();
    if (ss === 0 && hh === 0 && mm == 0) return t;
    if (isShort !== true) {
        t += (hh < 10 ? ('0' + hh) : hh) + ':' + (mm < 10 ? ('0' + mm) : mm) + ':' + (ss < 10 ? ('0' + ss) : ss);
    }
    return t;
}