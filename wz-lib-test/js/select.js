/**
 * Created by wangze on 2016/10/19.
 */


/**
 * 级联select
 * @constructor
 */
function CSlect(element, option){
    //this.opt = $.extend({}, CSelect.DEFAULT_OPTION.defaultOpt, $.extend($(element).data(),option ));
    this.opt = $.extend({}, CSlect.DEFAULT_OPTION.defaultOpt,option);
    this.$element = $(element);
    this.$nextElement = $(this.opt.nextSelect);
    this.init();
}

CSlect.VERSION = '1.0.1';
CSlect.DEFAULT_OPTION = {
    defaultOpt : {
        defaultSelectOption : '<option value="">--请选择--</option>',
        url : '',
        emptyText : '--请选择--',
        nextSelect : '',//关联select的选择器
        refUrl : '',//关联的select,获取数据的url
        //val : '',//默认初始值
        kes:{value:'value',text:'text'},
        loadSuccess : function(){},
        change : function(){}
    }
};

CSlect.prototype = {
    constructor : CSlect,
    init : function(){
        this.$element.data('emptyText',this.opt.emptyText);
        //this.$element.data('val',this.opt.val);
        this.changeListener();
        this.ajaxLoad();
    },
    ajaxLoad : function(){
        //ajax有两种加载一种是本身有url
        //一种是refurl
        var that = this;
        var callback = function(data){
            that.opt.loadSuccess && that.opt.loadSuccess.call(that, data);
            //有初始值
            if(that.opt.val || that.opt.val == '0'){
                that.select(that.opt.val);
            }
            that.$element.data('val','');
        }
        if(that.opt.url){
            that._ajaxLoad(that.$element,that.$nextElement, callback);
        }else{
            if(that.$element.find('option').length==0)//第一次初始化，如果什么都没有，则添加默认值
                that.$element.html('<option>'+that.opt.emptyText+'</option>');
        }
    },
    _ajaxLoad : function($ele,$next,callback){
        var emptyText=$ele.data('emptyText');
        $.ajax({
            url : url,
            type : 'post',
            dataType : 'json'
        }).done(function(data){
            var htmlArray = [];
            htmlArray.push('<option value="">' + emptyText + '</option>')
            $.each(data, function(i, item){
                htmlArray.push('<option  value="' + item.value + '">' + item.text + '</option>');
            });
            ele.html(htmlArray.join(''));
            callback && callback(data);
        }).fail(function(){
                throw('加载失败');
        });
    },
    changeListener : function(){
        var that = this;
        that.$element.on('change', function(){
            var selectedValue = $(this).val();
            var selectedText=$(this).find('option:selected').text();
            //如果选择值为空，不触发事件。
            if(!selectedValue){
                //如果有级联select,则相关的select要设置为空
                if(that.$nextElement.length !== 0 && that.opt.refUrl){
                    that.$nextElement.html('<option>'+that.$nextElement.data('emptyText')+'</option>').trigger('change');
                }
                return;
            }
            //添加级联事件
            if(that.$nextElement.length !== 0 && that.opt.refUrl){
                var url=that.opt.refUrl;
                url=url.replace('{value}',selectedValue).replace('{text}',selectedText);
                var callback=function(data){
                    var val=that.$nextElement.data('val');
                    if(val||val=='0'){
                        that.$nextElement.val(val).trigger('change');
                    }
                    that.$nextElement.data('val','');

                }
                that._ajaxLoad(that.$nextElement,url,callback);
            }
            that.opt.change && that.opt.change.call(this);
        });
    },
    select : function(value){
        this.$element.val(value).trigger('change');
    },
    /**
     * 级联初始化，最后一个select使用
     */
    cascadeInit:function(){
        /*var _setEmpty=function($obj,$next){

        }*/

    }

};





/* bootstrap - select */
if ($.fn.selectpicker) {
    var $selectpicker       = $box.find('select[data-toggle="selectpicker"]')
    var bjui_select_linkage = function($obj, $next) {
        if (!$next || !$next.length) return

        var refurl    = $obj.data('refurl')
        var _setEmpty = function($select) {
            var $_nextselect = $($select.data('nextselect'))

            if ($_nextselect && $_nextselect.length) {
                var emptytxt = $_nextselect.data('emptytxt') || '&nbsp;'

                $_nextselect.html('<option>'+ emptytxt +'</option>').selectpicker('refresh')
                _setEmpty($_nextselect)
            }
        }

        if (($next && $next.length) && refurl) {
            var val = $obj.data('val'), nextVal = $next.data('val'), keys = $obj.data('keys')
            if (keys && typeof keys === 'string')
                keys = keys.toObj()
            if (!keys)
                keys = {}
            if (typeof val === 'undefined') val = $obj.val();
            $.ajax({
                type     : 'POST',
                dataType : 'json',
                url      : refurl.replace('{value}', encodeURIComponent(val)),
                cache    : false,
                data     : {},
                success  : function(json) {
                    if (!json) return
                    var html = '', selected = ''
                    $.each(json, function(i) {
                        var value, label
                        if (json[i] && json[i].length) {
                            value = json[i][0]
                            label = json[i][1]
                        } else {
                            value = json[i][keys.value || 'value']
                            label = json[i][keys.label || 'label']
                        }
                        if (typeof nextVal !== 'undefined') selected = value == nextVal ? ' selected' : ''
                        html += '<option value="'+ value +'"'+ selected +'>' + label + '</option>'
                    })

                    $obj.removeAttr('data-val').removeData('val')
                    $next.removeAttr('data-val').removeData('val')

                    if (!html) {
                        html = $next.data('emptytxt') || '&nbsp;'
                        html = '<option>'+ html +'</option>'
                    }

                    $next.html(html).selectpicker('refresh')
                    _setEmpty($next);//设置第三个为空和以后的为空
                },
                error   : BJUI.ajaxError
            })
        }
    }

    $selectpicker.each(function() {
        var $element  = $(this)
        var options   = $element.data()
        var $next     = $(options.nextselect)

        $element.addClass('show-tick')
        if (!options.style) $element.data('style', 'btn-default')
        if (!options.width) $element.data('width', 'auto')
        if (!options.container) $element.data('container', 'body')
        else if (options.container == true) $element.attr('data-container', 'false').data('container', false)

        $element.selectpicker()

        if ($next && $next.length && (typeof $next.data('val') != 'undefined'))
            bjui_select_linkage($element, $next)
    })

    /* bootstrap - select - linkage && Trigger validation */
    $selectpicker.change(function() {
        var $element    = $(this)
        var $nextselect = $($element.data('nextselect'))

        bjui_select_linkage($element, $nextselect)

        /* Trigger validation */
        if ($element.attr('aria-required')) {
            $.fn.validator && $element.trigger('validate')
        }
    })
}

