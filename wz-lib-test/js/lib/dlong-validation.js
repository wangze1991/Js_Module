//<input type="password" class="resume-control dlong-validation[required{请输入登录密码！}]" id="txtPassword" name="password" placeholder="登录密码">
(function ($) {
    //单个验证
    $.fn.dlongValidationStart = function () {
        this.find("[class*='dlong-validation']").each(function (i) {
            var reg = /dlong-validation\[(.*)\]/;
            var field = reg.exec($(this).attr("class"))[1];
            $(this).blur(function () {
                methods.check(this, field);
            });
            if (field.indexOf('Number') != -1) {
                $(this).attr("onkeypress", "return (event.keyCode>=48&&event.keyCode<=57)");
            }
        });
    }
    //验证所有
    $.fn.dlongValidation = function () {
        var validationResult = true;
        var ctls = $(this).find("[class*='dlong-validation']");
        ctls.each(function (i) {
            var reg = /dlong-validation\[(.*)\]/;
            var field = reg.exec($(this).attr("class"))[1];
            var bool = methods.check(this, field);
            if (!bool) {
                validationResult = false;
                //$(this).focus();
                return false;//遇到信息不符合要求就终止
            }
        });
        return validationResult;
    }
    var root = function () {
        var fullPath = location.href;
        var pathname = location.pathname;
        return fullPath.substring(0, fullPath.indexOf(pathname));
    }
    var DialogShow = function (content, ctl) {
        dialog({
            //title: '提示',
            content: "<div style=\"padding:0 80px;\">" + content + "</div>",
            cancel: false,
            autofocus: false,
            okValue: "确 定",
            ok: function () { ctl.focus(); }
        }).showModal();
    }
    var methods = {
        isFocus: false,
        //errorStyle: "<span class=\"validationTip\" style=\"background: url(" + root() + "/static/img/job/ts-bg.png) no-repeat 0 -32px;color: red;font-size: 12px;padding-left: 16px;margin-left: 5px;\">ErrorMsgFlag</span>",
        //okStyle: "<span class=\"validationTip\" style=\"background: url(" + root() + "/static/img/job/ts-bg.png) no-repeat 0 -16px;color: red;font-size: 12px;padding-left: 16px;margin-left: 5px;\"></span>",
        check: function (obj, field) {
            var ctl = $(obj);
            var value = "";
            switch (obj.tagName.toLocaleLowerCase()) {
                case "img": value = ctl.attr("src"); break;
                case "textarea": value = $.trim(ctl.html());
                default: value = $.trim(ctl.val()); break;
            }
            if (value == null) value = "";
            if (field.indexOf("required") != -1) {
                if (value == "") {
                    var match = /required{(.*?)}/.exec(field);
                    var msg = match == null || match[1] == "" ? "此项不能为空！" : match[1];
                    //ctl.next(".validationTip").remove();
                    //ctl.after(methods.errorStyle.replace("ErrorMsgFlag", "不能为空"));
                    DialogShow(msg, ctl);
                    return false;
                }
            }
            //else if (value == "") {
            //    ctl.next(".validationTip").remove();
            //    return true;

            ///最大长度
            if (field.indexOf("maxLength") != -1) {
                var match = /maxLength\((\d*?)\)/.exec(field);
                var length = match == null ? 0 : parseInt(match[1]);
                if (length != 0 && value.length > length) {
                    match = /maxLength\(\d*?\){(.*?)}/.exec(field);
                    var msg = match == null || match[1] == "" ? "最大长度不能超过 " + length + " " : match[1];
                    DialogShow(msg, ctl);
                    return false;
                }
            }
            //最小长度
            if (field.indexOf("minLength") != -1) {
                var match = /minLength\((\d*?)\)/.exec(field);
                var length = match == null ? 0 : parseInt(match[1]);
                if (length != 0 && value.length < length) {
                    match = /minLength\(\d*?\){(.*?)}/.exec(field);
                    var msg = match == null || match[1] == "" ? "最小长度不能小于 " + length + " " : match[1];
                    DialogShow(msg, ctl);
                    return false;
                }
            }




            //只有文本框才检测下列属性
            if (obj.tagName.toLocaleLowerCase() == "input" && (obj.type == "text")) {
                if (field.indexOf("email") != -1) {
                    if (!methods.isEmail(value)) {
                        var match = /email{(.*?)}/.exec(field);
                        var msg = match == null || match[1] == "" ? "邮箱格式不正确！" : match[1];
                        //ctl.next(".validationTip").remove();
                        //ctl.after(methods.errorStyle.replace("ErrorMsgFlag", "邮箱格式不正确"));
                        DialogShow(msg, ctl);
                        return false;
                    }
                }
                if (field.indexOf("mobile") != -1) {
                    if (!methods.isMobile(value)) {
                        var match = /mobile{(.*?)}/.exec(field);
                        var msg = match == null || match[1] == "" ? "手机号码格式不正确！" : match[1];
                        //ctl.next(".validationTip").remove();
                        //ctl.after(methods.errorStyle.replace("ErrorMsgFlag", "手机号码格式不正确"));
                        DialogShow(msg, ctl);
                        return false;
                    }
                }
                if (field.indexOf("tel") != -1) {
                    if (!methods.isTel(value)) {
                        var match = /tel{(.*?)}/.exec(field);
                        var msg = match == null || match[1] == "" ? "电话号码格式不正确！" : match[1];
                        //ctl.next(".validationTip").remove();
                        //ctl.after(methods.errorStyle.replace("ErrorMsgFlag", "电话号码格式不正确"));
                        DialogShow(msg, ctl);
                        return false;
                    }
                }
                if (field.indexOf("number") != -1) {
                    if (!methods.isNumber(value)) {
                        var match = /number{(.*?)}/.exec(field);
                        var msg = match == null || match[1] == "" ? "只能输入数字！" : match[1];
                        //ctl.next(".validationTip").remove();
                        //ctl.after(methods.errorStyle.replace("ErrorMsgFlag", "只能输入数字"));
                        DialogShow(msg, ctl);
                        return false;
                    }
                }
            }
            //if (value != "") {
            //    ctl.next(".validationTip").remove();
            //    ctl.after(methods.okStyle);
            //}
            return true;
        },
        isEmail: function (value) {
            if (value == "" || /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/g.test(value)) {
                return true;
            } else {
                return false;
            }
        },
        isMobile: function (value) {
            var reg = /^[1][3578][0-9]{9}$/;
            if (value == "" || reg.test(value)) {
                return true;
            }
            else {
                return false;
            }
        },
        isTel: function (value) {
            if (value == "") {
                return true;
            }
            if (/^0\d{2,3}-{0,1}\d{5,9}|0\d{2,3}-{0,1}\d{5,9}/g.test(value)) {
                return true;
            } else {
                if (/^(0\d{2,3}-)?\d{7,8}$/g.test(value)) {
                    return true;
                } else {
                    if (/^(\d{0,3}-)?(\d{0,3}-)?\d{4,8}$/g.test(value)) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
        },
        isNumber: function (value) {
            if ($.trim(value) == "") {
                return true;
            }
            if (isNaN(value)) {
                return false;
            }
            return true;
        }
    };
})(jQuery);
