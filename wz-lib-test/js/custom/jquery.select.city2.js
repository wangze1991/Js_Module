/**
 * @author wangze
 * @date 2017-11-23 9:17.
 * @email 595702583@qq.com
 *参考  https://gitee.com/Agger/codes/ednq2b367g4fu8rk5tosy20
 **/


;(function () {
    'use strict';
    var defaults = {
        url: '',     //数据库地址
        //crossDomain: true,        //是否开启跨域
        dataType: 'json',          //数据库类型:'json'或'jsonp'
        provinceField: 'province', //省份字段名
        cityField: 'city',         //城市字段名
        areaField: 'area',         //地区字段名
        //valueType: 'code',         //下拉框值的类型,code行政区划代码,name地名
        code: 0,                   //地区编码
        province: 0,               //默认值
        city: 0,                   //默认值
        area: 0,                   //默认值
        required: false,            //是否必须选一个
        nodata: '',          //当无数据时的表现形式:'hidden'隐藏,'disabled'禁用,为空不做任何处理
        emptyText: '--请选择--',
        onChange: function () {
        }     //地区切换时触发,回调函数传入地区数据
    };

    var typeEnum = {
        province: 'province',
        city: 'city',
        area: 'area'
    };
/*    var noDataEnum = {
        hidden: 'hidden',
        disabled: 'disabled'
    }*/

    $.fn.city = function (option) {
        return this.each(function () {
            var cs = new CSelect($(this), option);
            cs.init();
        });
    }

    /**
     * 级联选择
     * @param ele
     * @param option
     * @constructor
     */
    function CSelect(ele, option) {
        this.opt = $.extend({}, defaults, option);
        this.ele = ele;
    }

    CSelect.VERSION = '0.0.1';
    /**
     *初始化
     */
    CSelect.prototype.init = function () {
        var that = this,
            opt = that.opt,
            $province = that.ele.find('[name=' + opt.provinceField + ']'),
            $city = that.ele.find('[name=' + opt.cityField + ']'),
            $area = that.ele.find('[name=' + opt.areaField + ']');

        var setEmpty = function setEmpty(currentNode) {
            currentNode.nextAll('select').html('<option>' + opt.emptyText + '</option>');
        };
        $province.on('change', function () {
            setEmpty($(this));
            that.updateData($(this).val(), $city, typeEnum.city);
            that.hideHandler($province,false);
        });

        $city.on('change', function () {
            setEmpty($(this));
            that.updateData($(this).val(), $area, typeEnum.area);
            that.hideHandler($city,false);
        });
        setEmpty($province);
        that.hideHandler($province);
        that.updateData('',$province, typeEnum.province);
    };

    CSelect.prototype.updateData = function (selectValue, nextNode, urlType) {
        var that = this,
            opt = that.opt;
        var renderHtml = function renderHtml(data) {
            var html = '';
            if (!opt.required) {
                html = '<option  value="">' + opt.emptyText + '</option>';
            }
            //es5 特性 array.foreach
            data.forEach(function (v) {
                html += '<option value="' + v.value + '">' + v.text + '</option>';
            });
            return html;
        };
        //所选值为空，则不用ajax获取数据
        /* if(!selectValue){
             return;
         }*/

        $.ajax({
            url: opt.url,
            data: {type: urlType, parentId: (selectValue || '')},
            type: 'get',
            dataType:opt.dataType
        }).done(function (data) {
            if(selectValue&&data){
                that.noDataHandler(nextNode,true);
            }
            nextNode.html(renderHtml(data));
            //todo 如果是直辖市，这边要额外操作
            if (opt[urlType]) {
                nextNode.val(opt[urlType]);
                if(nextNode.next('select').length>0){
                    nextNode.trigger('change');
                }
                opt[urlType] = 0;
            }
        }).fail(function () {
            console && console.error('网络链接失败');
        });
    };

    CSelect.prototype.hideHandler=function (node) {
        var that = this;
        //如果当前选中项有值，那么第三个select开始要隐藏
        //如果当前选中项没有值，则第二个select开始要隐藏
        if(node.val()){
            var nextNextNode= node.next('select').next('select');
            if(nextNextNode.length>0){
                node.next('select').nextAll('select').each(function () {
                    that.noDataHandler($(this),false);
                });
            }
        }else{
            node.nextAll('select').each(function () {
                that.noDataHandler($(this),false);
            });
        }
    }
    /**
     * 显示隐藏操作
     * @param noDataType
     * @param node
     * @param isShow
     */
    CSelect.prototype.noDataHandler=function (node,isShow) {
        var that = this,
            opt = that.opt;
        var nValue = {
            hidden: {
                0: function show() {
                    this.show();
                },
                1: function hide() {
                    this.hide();
                }
            },
            disabled: {
                0: function show() {
                    this.prop('disabled', false);
                },
                1: function hide() {
                    this.prop('disabled', true);
                }

            }
        };
        if(opt.nodata){
            nValue[opt.nodata][isShow ? 0 : 1].call(node);
        }

    };


})();