/**
 * Created by wangze on 2016/10/19.
 */


/**
 * 级联select
 * @constructor
 */
function CSelect(element, option){
    this.opt = $.extend({}, CSelect.DEFAULT_OPTION.defaultOpt, option);
    this.$element = $(element);
    this.$nextElement = $(this.opt.nextSelect);
    this.init();
}

CSelect.VERSION = '1.0.1';
CSelect.DEFAULT_OPTION = {
    defaultOpt : {
        url : '',
        emptyText : '--请选择--',
        nextSelect : '',//关联select的选择器
        refUrl : '',//关联的select,获取数据的url
        //val : '',//默认初始值
        //vals:[],
        loadSuccess : null,
        change :null
    },
    keys : {value : 'value', text : 'text'}
};

CSelect.prototype = {
    constructor : CSelect,
    init : function(){
        this.$element.data('emptyText', this.opt.emptyText);
        this.$element.data('refUrl', this.opt.refUrl);
        this.$element.data('nextSelect', this.opt.nextSelect);
        this.changeListener();
        this.ajaxLoad();
    },
    ajaxLoad : function(){
        //ajax有两种加载一种是本身有url
        //一种是refurl
        var that = this;
        var callback = function(data){
            that.opt.loadSuccess && that.opt.loadSuccess.call(that, data);
        }
        if(that.opt.url){
            that._ajaxLoad(that.$element, that.opt.url, callback);
        } else {
            that.$element.html('<option>' + that.opt.emptyText + '</option>');
        }

    },
    _cascadeLoad : function($ele, $next){
        var that = this;
        var val = $ele.data('val');
        var refUrl = $ele.data('refUrl');
        var _setEmpty = function($select){
            var $_nextselect = $($select.data('nextSelect'))
            if($_nextselect && $_nextselect.length){
                var emptytxt = $_nextselect.data('emptyText') || '&nbsp;'
                $_nextselect.html('<option>' + emptytxt + '</option>');
                _setEmpty($_nextselect);
            }
        }
        if(!val){
            val = $ele.val();
        }
        if($next && $next.length > 0 && refUrl){
            var url = refUrl.replace('{value}', encodeURIComponent(val));//注意字符串编码
            that._ajaxLoad($next, url, function(){
                var nextVal = $next.data('val');
                if(nextVal){
                    $next.val(nextVal);
                   // $next.val(nextVal).trigger('change');
                }
                $next.removeAttr('data-val').removeData('val');
            });
            _setEmpty($next);
        }
        $ele.removeAttr('data-val').removeData('val');
    },
    _ajaxLoad : function($ele, url, callback){
        $.ajax({
            url : url,
            type : 'post',
            async : false,
            dataType : 'json'
        }).done(function(data){
            var htmlArray = [];
            htmlArray.push('<option>' + $ele.data('emptyText') || '&nbsp;' + '</option>');
            $.each(data, function(i, item){
                htmlArray.push('<option  value="' + item[CSelect.DEFAULT_OPTION.keys['value']] + '">' + item[CSelect.DEFAULT_OPTION.keys['text']] + '</option>');
            });
            $ele.html(htmlArray.join(''));
            callback && callback(data);
        }).fail(function(){
            throw('加载失败');
        });
    },
    changeListener : function(){
        var that = this;
        that.$element.on('change', function(){
            //添加级联事件
            that._cascadeLoad(that.$element, that.$nextElement);
            that.opt.change && that.opt.change.call(this);
        });
    },change:function(){
        this.$element.trigger('change');
        return this ;
    },
    select : function(value){
        this.$element.data('val',value).val(value).trigger('change');
        return this;
    }
}
