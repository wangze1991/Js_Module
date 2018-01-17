;(function () {
    $.fn.pagination = function (option) {
        return this.each(function () {
            var p = new Pagination($(this), option);
            p.init();
        });

    };

    $.fn.pagination.defaults = {
        totalPage: 0,
        count: 0,//总条数
        limit: 10,//每页显示的总条数
        prev: '上一页',
        next: '下一页',
        first: '首页',
        last: '尾页',
        showPage: 5,
        isAjax: true,
        isHash: false,
        jump: function (page) {
        }//回调事件
    };

    function Pagination(ele, option) {
        this.opt = $.extend({}, $.fn.pagination.defaults, option);
        this.ele = ele;
        console.log(this.opt);
    }


    var proto = Pagination.prototype;
    /**
     * 初始化分页控件
     */
    proto.init = function () {
        var that = this,
            opt = that.opt;
        appendHtml(1, opt, that.ele);
        /**
         * 跳转事件
         */
        $(that.ele).on('click', 'span.jump,span.gobtn', function () {
            var $me = $(this);
            var jumpPage = parseInt($me.text(), 10);
            var totalPage = opt.totalPage ? opt.totalPage : Math.ceil(opt.count / opt.limit);//获取总页数
            if (!jumpPage) {
                var currentPageNumber = parseInt($('span.jump.bgprimary').text(), 10);
                if ($me.text() === opt.prev) {
                    jumpPage = currentPageNumber - 1;
                }
                else if ($me.text() === opt.next) {
                    jumpPage = currentPageNumber + 1;
                }
                if ($me.hasClass('gobtn')) {
                    var inputJumpPage = $('.jumpinp>:text', that.ele).val();
                    jumpPage = parseInt(inputJumpPage, 10);
                }
            }
            if (!jumpPage || jumpPage < 0 || jumpPage > totalPage) {
                return false;
            }
            appendHtml(jumpPage, opt, that.ele);
        });

    };

    function enumerate(begin, end) {
        var array = [];
        for (var i = begin; i <= end; i++) {
            array.push(i);
        }
        return array;
    }

    /***
     * 添加html
     * @param currentPage
     * @param totalPage
     * @param jump
     */
    function appendHtml(currentPage, opt, ele) {
        var totalPage = opt.totalPage ? opt.totalPage : Math.ceil(opt.count / opt.limit);//获取总页数
        var showPage = opt.showPage;
        var interval = Math.floor(showPage/2);
        console.log(interval)
        var html = [
            '<div class="page">',
            '<div class="pagelist">'
        ];
        //判断当前是首页
        var prevDisabled = currentPage === 1 ? 'disabled' : '';
        html.push('<span class="jump ' + prevDisabled + '">' + opt.prev + '</span>');
        html.push('<span class="jump ">1</span>');
        if (showPage >= totalPage) {
            enumerate(2, totalPage-1).forEach(function (i) {
                html.push('<span class="jump">' + i + '</span>');
            });
        } else {
            //判断前面不需要...
            if (currentPage - interval - 1 <= 1) {
                enumerate(2, showPage).forEach(function (i) {
                    html.push('<span class="jump">' + i + '</span>');
                });
                html.push('<span class="ellipsis" style="">...</span>');
            }
            else {
                html.push('<span class="ellipsis" style="">...</span>');
                //判断是否分页到末尾
                if (totalPage - currentPage - interval > 1) {
                    enumerate(currentPage - interval, currentPage + interval >= totalPage ? totalPage : currentPage + interval).forEach(function (i) {
                        html.push('<span class="jump">' + i + '</span>');
                    });
                    if (totalPage - currentPage - interval > 1) {
                        html.push('<span class="ellipsis" style="">...</span>');
                    }
                }
                else {
                    enumerate(totalPage - showPage + 1, totalPage - 1).forEach(function (i) {
                        html.push('<span class="jump">' + i + '</span>');
                    });
                }
            }
        }
        var nextDisabled = currentPage === totalPage ? 'disabled' : '';
        html.push('<span class="jump ' + nextDisabled + '">' + opt.next + '</span>');
        html.push('<span class="jump">' + totalPage + '</span>');
        html.push('<span class="jumppoint">跳转到：</span>');
        html.push('<span class="jumpinp"><input type="text"></span>');
        html.push('<span class="jump gobtn">确定</span>');
        html.push('</div>');
        html.push('</div>');
        ele.html(html.join(''));
        ele.find('span:contains("' + currentPage + '")').eq(0).addClass('bgprimary');
        if (opt.jump) {
            opt.jump(currentPage);
        }
    }


})();
