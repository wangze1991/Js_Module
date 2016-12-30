/**
 * Created by wangze on 2016/12/30.
 */
;(function(){
    var utils = {};

    /**
     * 转换成jquery对象
     * @param obj jquery对象或jquery选择器
     * @returns {$object}
     */
    utils.jquery= function(obj, $content){
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
    }
    /**
     * 日期公共函数
     */
    ;
    (function(){
        utils.dateUtil = {
            format : function(time, fmt){
                var o = {
                    "M+" : time.getMonth() + 1,                 //月份
                    "d+" : time.getDate(),                    //日
                    "h+" : time.getHours(),                   //小时
                    "m+" : time.getMinutes(),                 //分
                    "s+" : time.getSeconds(),                 //秒
                    "q+" : Math.floor((time.getMonth() + 3) / 3), //季度
                    "S" : time.getMilliseconds()             //毫秒
                };
                if(/(y+)/.test(fmt))
                    fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
                for(var k in o)
                    if(new RegExp("(" + k + ")").test(fmt))
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
            }
        };
    })();


    /**
     * 字符串公共方法
     */
    ;
    (function(){
        utils.stringUtil = {
            /**字符串格式化
             @param str 字符串
             @param value 替换值
             @example  "我是{0},身高{1}"
             */
            'format' : function(str, value){
                if(!value || !str) return "";
                for(var i = 0; i < arguments.length; i++){
                    var j = i + 1;
                    if(arguments[j] != undefined){
                        var reg = new RegExp("({)" + i + "(})", "g");
                        str = str.replace(reg, arguments[j]);
                    }
                }
                return str;
            }
            ,'trimEnd' : function(str){
                if(str.length == 0) return str;
                if(str.lastIndexOf(str) == str.length - 1){
                    return this.substr(0, str.length - 1);
                }
                return this;
            }
            ,'trim' : function(str){
                return $.trim(str);
            }
        };
    })();


    /**
     * 表单公共方法
     */
    ;(function(){
        utils.formUtil = {
            /**
             *绑定表单
             * @param form
             * @param param
             */
            'bindForm' : function(form, param){
                var $form = $(form);
                if (!param) return;
                $('input', $form).each(function () {
                    if (param.hasOwnProperty(this.name) === false)return true;
                    var val = param[this.name];
                    //如果是数组，这里直接不判断,单独写方法重构，遇到具体情况在分析。
                    if ($.isArray(val))return true;
                    if (typeof val === 'object') return true;
                    if (this.type == "text" || this.type == "hidden") {
                        $(this).val(val);
                    }
                    else if (this.type == "checkbox") {
                        $(this).prop("checked", val == "True" || val == true);
                    }
                    else if ((this.type == "radio")) {
                        $("input[name=" + this.name + "][value=" + val + "]").prop("checked", true);
                    }
                });
                $('textarea,select', $form).each(function () {
                    if (param.hasOwnProperty(this.name) === false)return true;
                    $(this).val(param[this.name]);
                });
            }
            /**
             * 表单值转换为[{name:'',value}]键值对
             * @param $form
             * @returns {Array}
             * tips radiobutton 没有考虑
             */
            ,'formToArray' : function($form){
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
                    if(el.type=='checkbox'){
                        if($(el).prop("checked")!==true)
                            continue;
                    }
                    v = $.trim($(el).val());
                    if (v && v.constructor === Array) {
                        for (j = 0, jmax = v.length; j < jmax; j++) {
                            a.push({name: n, value: v[j]});
                        }
                    }
                    else if (v !== null && typeof v != 'undefined' && v != '') {
                        a.push({name: n, value: v});
                    }
                }
                return a;
            }
        };
    })();

    return utils;
})();