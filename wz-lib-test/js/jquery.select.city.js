/**
 * Created by lydia on 2017/7/11.
 */

/**
 * 三级下拉框(省市区)
 */
;(function () {
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
        required: true,           //是否必须选一个
        nodata: 'hidden',         //当无数据时的表现形式:'hidden'隐藏,'disabled'禁用,为空不做任何处理
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

            $area.on('change', function () {
                // areaChange();
            });
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
                    var citys = getCityData(data, provinceValue);
                    if ($.isEmptyObject(citys)) {
                        if ($city.is(':hidden') === false) {
                            $city.hide();
                        }
                        areaChange(provinceValue);
                    } else {
                        if ($city.is(':hidden') === true) {
                            $city.show();
                        }
                        $city.html(renderHtml(citys));
                        if (opt.city) {
                            $city.val(opt.city);
                            opt.city = 0;
                        }
                        areaChange($city.val());
                    }
                } else {
                    setEmpty();
                    if (opt.nodata === 'hidden') {
                        $city.hide();
                        $area.hide();
                    }
                }
            }

            function areaChange(cityValue) {
                $area.empty();
                if (cityValue) {
                    if ($area.is(':hidden')) {
                        $area.show();
                    }
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
                    if (opt.nodata === 'hidden') {
                        $area.hide();
                    }
                }

            }

            function renderHtml(obj) {
                var html = [];
                if (opt.required === false) {
                    html.push('<option value="">--请选择--</option>');
                }

                $.each((obj || {}), function (key, value) {
                    html.push('<option value="' + key + '">' + value + '</option>');
                });
                return html.join('');
            }

            function setEmpty() {
                if (opt.required === false) {
                    $city.html(renderHtml());
                    $area.html(renderHtml());
                }
            }

            function setSelectedValue() {
                var code = opt.code;
                if (code) {
                    opt.province = parseInt(Math.floor(code / 1e4).toString() + '0000', 10);
                    opt.city = parseInt(Math.floor(code / 1e2).toString() + '00', 10);
                    opt.area = code;
                } else {
                    //如果设置中文
                    if (opt.province && typeof  opt.province === 'string') {
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

        }).fail(function () {

        });
    };


    function getProvinceData(data) {
        var province = {};
        for (var code in data) {
            if (code % 1e4 === 0) {
                province[code] = data[code];
            }
        }
        return province;
    }

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