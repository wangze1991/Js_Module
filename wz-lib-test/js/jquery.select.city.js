/**
 * Created by lydia on 2017/7/11.
 */

/**
 * 三级下拉框(省市区)
 * http://jquerywidget.com/jquery-citys/
 */
;(function () {
    'use strict';
    var defaults = {
        url: 'http://passer-by.com/data_location/list.json',     //数据库地址
        //crossDomain: true,        //是否开启跨域
        dataType: 'json',          //数据库类型:'json'或'jsonp'
        provinceField: 'province', //省份字段名
        cityField: 'city',         //城市字段名
        areaField: 'area',         //地区字段名
        valueType: 'code',         //下拉框值的类型,code行政区划代码,name地名
        code: 0,                   //地区编码
        province: 0,               //省份,可以为地区编码或者名称
        city: 0,                   //城市,可以为地区编码或者名称
        area: 0,                   //地区,可以为地区编码或者名称
        required: false,            //是否必须选一个
        nodata: 'hidden',          //当无数据时的表现形式:'hidden'隐藏,'disabled'禁用,为空不做任何处理
        emptyText: '--请选择--',
        onChange: function () {
        }     //地区切换时触发,回调函数传入地区数据
    };


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
        $.ajax({
            type: 'get',
            cache: false,
            dataType: opt.dataType,
            url: opt.url
        }).done(function (data) {
            if (!data) {
                alert('数据加载失败');
                return;
            }
            setSelectedValue();
            setEmpty();
            provinceChange();

            $province.on('change', function () {
                cityChange();
            });
            $city.on('change', function () {
                areaChange($(this).val());
            });

            /* $area.on('change', function () {
                 // areaChange();
             });*/

            function provinceChange() {
                var values = getProvinceData(data);
                $province.html(renderHtml(values));
                if (opt.province) {
                    $province.val(opt.province);
                    opt.province = 0;
                }
                cityChange();
            }

            function cityChange() {
                var provinceValue = $province.val();
                if (provinceValue) {
                    $city.empty();
                    //这里需要判断所选中的省市是直辖市
                    var cities = getCityData(data, provinceValue);
                    //如果获取城市为空，则表明是直辖市
                    if ($.isEmptyObject(cities)) {
                        /* if ($city.is(':hidden') === false) {
                             $city.hide();
                         }*/
                        $province.find('option:selected').clone().appendTo($city);
                        noDataHandler(false, $city);
                        areaChange(provinceValue);

                    } else {
                        /* if ($city.is(':hidden') === true) {
                             $city.show();
                         }*/
                        noDataHandler(true,$city);
                        $city.html(renderHtml(cities));
                        if (opt.city) {
                            $city.val(opt.city);
                            opt.city = 0;
                        }
                        areaChange($city.val());
                    }
                } else {
                    setEmpty();
                    noDataHandler(false, $city);
                    noDataHandler(false, $area);
                    /* if (opt.nodata === 'hidden') {
                         //$city.hide();
                         $area.hide();
                     } else if (opt.nodata === 'disabled') {
                         $area.prop('disabled', true);
                     }*/
                }
            }

            function areaChange(cityValue) {
                $area.empty();
                if (cityValue) {
                    noDataHandler(true, $area);
                    /*if($area.is('disabled')){
                        $area.prop('disabled',true);
                    }
                    if ($area.is(':hidden')) {
                        $area.show();
                    }*/
                    var areas = getAreaData(data, cityValue);
                    $area.html(renderHtml(areas));
                    if (opt.area) {
                        $area.val(opt.area);
                        opt.area = 0;
                    }
                } else {
                    if (opt.required === false) {
                        $area.html(renderHtml());
                    }
                    noDataHandler(false, $area);
                    /*     if (opt.nodata === 'hidden') {
                             $area.hide();
                         }*/
                }

            }

            /**
             * 展示数据
             * @param obj
             * @returns {string}
             */
            function renderHtml(obj) {
                var html = [];
                if (opt.required === false) {
                    html.push('<option value="">' + opt.emptyText + '</option>');
                }
                $.each((obj || {}), function (key, value) {
                    html.push('<option value="' + key + '">' + value + '</option>');
                });
                return html.join('');
            }

            /**
             * 设置为空html
             */
            function setEmpty() {
                if (opt.required === false) {
                    $city.html(renderHtml());
                    $area.html(renderHtml());
                }
            }

            /**
             * 获取默认选中项的值
             */
            function setSelectedValue() {
                var code = opt.code;
                if (code) {
                    opt.province = parseInt(Math.floor(code / 1e4).toString() + '0000', 10);
                    opt.city = parseInt(Math.floor(code / 1e2).toString() + '00', 10);
                    opt.area = code;
                } else {
                    //如果设置中文
                    if (opt.province && typeof opt.province === 'string') {
                        opt.province = getCodeByChineseName(opt.province);
                    }
                    if (opt.city && typeof  opt.city === 'string') {
                        opt.city = getCodeByChineseName(opt.city);
                    }
                    if (opt.area && typeof  opt.area === 'string') {
                        opt.area = getCodeByChineseName(opt.area);
                    }
                }
            }

            /**
             * 根据中文名称，获取code
             * @param name
             * @returns {number}
             */
            function getCodeByChineseName(name) {
                var result = 0;
                $.each(data, function (k, v) {
                    if (v === name) {
                        result = k;
                        return false;
                    }
                });
                return result;
            }

            /**
             *
             * @param currentNode
             */
            function noDataHandler(isShow, node) {
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
                nValue[opt.nodata][isShow ? 0 : 1].call(node);
            }

        }).fail(function () {

        });
    };

    /**
     * 获取省数据
     * @param data
     * @returns {{}}
     */
    function getProvinceData(data) {
        var province = {};
        for (var code in data) {
            if (code % 1e4 === 0) {
                province[code] = data[code];
            }
        }
        return province;
    }

    /**
     * 获取区的数据
     * @param data
     * @param selectProvince
     * @returns {{}}
     */
    function getCityData(data, selectProvince) {
        var city = {};
        if (!selectProvince) {
            return city;
        }
        for (var code in data) {
            if (code % 1e2 === 0 && code % 1e4 !== 0 && (Math.floor(code / 1e4).toString() + '0000') === selectProvince) {
                city[code] = data[code];
            }
        }
        return city;
    }

    /**
     * 获取乡镇数据
     * @param data
     * @param selectedCity
     * @returns {{}}
     */
    function getAreaData(data, selectedCity) {
        var area = {};
        if (!selectedCity) {
            return area;
        }
        selectedCity = parseInt(selectedCity, 10);
        //判断是否是直辖市
        if (selectedCity % 1e4 === 0) {
            $.each(data, function (code) {
                if (code % 1e2 !== 0 && (Math.floor(code / 1e4).toString() + '0000') === selectedCity.toString()) {
                    area[code] = data[code];
                }
            });

        } else {
            $.each(data, function (code) {
                if (code % 1e2 !== 0 && (Math.floor(code / 1e2).toString() + '00') === selectedCity.toString()) {
                    area[code] = data[code];
                }
            });
        }
        return area;
    }


})();