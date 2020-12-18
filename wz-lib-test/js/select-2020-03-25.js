/**
 * @author wangze
 * @date 2020-03-20 13:03.
 **/

(function () {
    function initSearchSelect() {
        var selects = [
            {id: 'collegeId', initSelect: getSpecial, selected: null},
            {id: 'specialId', initSelect: getClasses, selected: null},
            {id: 'classId', initSelect: null, selected: null}];

        var collegeUrl = '../../college/college/list/all',
            specialUrl = '../../college/special/list/search',
            classUrl = '../../college/tclass/list/search';

        //select 事件初始化
        function selectInit() {
            for (var i = 0; i < selects.length - 1; i++) {
                (function (key) {
                    form.on('select(' + getSelectName(key) + ')', function (data) {
                        //console.log(data.elem); //得到select原始DOM对象
                        //console.log(data.value); //得到被选中的值
                        //console.log(data.othis); //得到美化后的DOM对象
                        if (data.value) {
                            $(getSelectSelector(key + 1)).removeClass('layui-disabled').prop('disabled', false);
                            selects[key].initSelect(data.value);
                        } else {
                            for (var j = key + 1; j < selects.length; j++) {
                                $(getSelectSelector(j)).val('')
                                    .prop('disabled', true)
                                    .addClass('layui-disabled');

                            }
                        }
                        form.render('select');
                    });
                })(i);
            }
        }

        function getSelectSelector(index) {
            return '[name=' + getSelectName(index) + ']';
        }

        function getSelectName(index) {
            return selects[index].id;
        }

        // 获取院系列表
        function getCollege() {
            var opt = {
                index: 0,
                url: collegeUrl,
                text: 'name',
                value: 'id',
                emptyText: '请选择院系'
            };
            getSelectHtml(opt);
        }

        // 获取专业
        function getSpecial(collegeId) {
            var opt = {
                index: 1,
                url: specialUrl + '?collegeId=' + collegeId,
                text: 'name',
                value: 'id',
                emptyText: '请选择专业'
            };
            getSelectHtml(opt);
        }

        //获取班级
        function getClasses(specialId) {
            var opt = {
                index: 2,
                url: classUrl + '?specialId=' + specialId,
                text: 'name',
                value: 'id',
                emptyText: '请选择班级'
            };
            getSelectHtml(opt);
        }

        //获取select列表
        function getSelectHtml(option) {
            common.ajax({
                url: option.url,
                async: option.async,
                success: function (data) {
                    var r = ['<option  value="">' + option.emptyText + '</option>'];
                    layui.each(data.list, function (i, item) {
                        r.push('<option  value="' + item[option.value] + '" >' + item[option.text] + '</option>');
                    });
                    //option.success && option.success(r.join(''));
                    $(getSelectSelector(option.index)).html(r.join(''));
                    form.render();
                    if (selects[option.index].selected) {
                        $(getSelectSelector(option.index)).val(selects[option.index].selected);
                        form.render();
                        selects[option.index].selected = null;
                    }
                }
            });
        }


        getCollege();
        selectInit();


    }


    var defaultOpt = {};

    var ajaxOption = {
        url: '',
        async: false,
        res: {
            value: 'value',
            text: 'text',
            data: 'data',
            searchKey: ''
        },
        success: function () {

        }
    };

    var defaultSelectOpt = {
        emptyText: '--请选择--',
        selected: ''

    };
    //id: 'collegeId', initSelect: getSpecial, selected: null


    // 传入的参数
    // var data = [{
    //     id: '',
    //     ajaxOption: {
    //         url: '',
    //         async: false,
    //         res: {
    //             value: 'value',
    //             text: 'text',
    //             searchKey:'',
    //             data: 'data'
    //         }
    //     },
    //     selected:null,
    //     emptyText
    // }]

    /**
     * data={
     *
     *
     *
     * }
     * @param data
     * @constructor
     */
    var CSelect = function (data) {
        /**
         *  默认配置
         */
        this.selectData = data;
        this.v = '1.0.0';
    };

    // 绑定事件
    CSelect.init = function () {
        var that = this;
        var i = 1;
        that.renderList(that.data[0]);
        for (; i < that.data.length; i++) {
            that.change(that.data[i]);
        }
    };
    CSelect.formatData = function () {
    };
    //手动设置选中值
    //[{id:'',value:'' }] 长度必须一致,//顺序必须一致
    CSelect.set = function (selectArr) {
        var that = this;
        //第一个直接选中;
        //$(selectArr[0].id).val(selectArr[0].value);
        for (var i = 0; i < that.data.length; i++) {
        }
        $.each(that.data, function (i, item) {
            if (selectArr.length > i) {
                item['selected'] = selectArr[i].selected;
                if (i === 0) {
                    that.renderList(item);
                } else {
                    var preValue = selectArr[i - 1].selected;
                    if (preValue) {
                        that.renderList(item, preValue)
                    }
                }
            } else {
                // 设置disabled
            }
        });
    };
    /**
     * 绑定事件
     */
    CSelect.change = function (selectOpt) {
        var that = this;
        $(selectOpt.id).on('change', function () {
            //that.renderList(selectOpt, selectOpt.ajaxOption);
            var _selectedValue = $(this).val();
            if (_selectedValue) {
                renderNext(_selectedValue);
            } else {
                // 设置后面的全部disabled
            }
        });


        function renderNext(value) {
            var nextId = that.getIndex(selectOpt.id) + 1;
            if (nextId >= that.data.length) {
                return;
            }
            var nextSelect = that.data[nextId];
            that.renderList(nextSelect, value);
        }


    };
    /**
     * 获取select在data中的位置
     * @param selectOptId
     * @returns {number}
     */
    CSelect.getIndex = function (selectOptId) {
        var that = this;
        var i = 0;
        for (; i < that.data.length; i++) {
            if (that.data[i].id === selectOptId) {
                return i;
            }
        }
    };


    // 获取option的html
    CSelect.renderList = function (selectOpt, prevValue) {
        var that = this;
        var ajaxOpt = selectOpt.ajaxOption;
        var url = ajaxOpt.url;
        var combineStr = url.indexOf('?') > -1 ? '&' : '?';
        if (prevValue) {
            url += combineStr + ajaxOpt.searchKey + '=' + encodeURIComponent(prevValue)
        }
        $.ajax({
            url: url,
            async: ajaxOpt.async,
            success: function (data) {
                var r = ['<option  value="">' + selectOpt.emptyText + '</option>'];
                $.each(data[ajaxOpt.res.data], function (i, item) {
                    r.push('<option  value="' + item[selectOpt.value] + '" >' + item[selectOpt.text] + '</option>');
                });

                $(selectOpt.id).html(r.join(''));
                //$(getSelectSelector(data.index)).html(r.join(''));
                //form.render();

                // 初始化时设置选中值
                if (selectOpt.selected) {
                    $(selectOpt.id).val(selectOpt.selected);
                    that.data[that.getIndex(selectOpt)].selected = null;
                }

            }
        });
    }


})();