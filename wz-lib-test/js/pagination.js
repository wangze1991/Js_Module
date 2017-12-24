;(function () {
    $.fn.pagination = function (option) {
        return this.each(function () {
            var p = new Pagination($(this), option);
            p.init();
        });

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

    $.fn.pagination.defaults = {
        totalPage: 0,
        count: 0,//总条数
        limit: 10,//每页显示的总条数
        prev: '上一页',
        next: '下一页',
        first: '首页',
        last: '尾页',
        showPage: 7,
        jump: function (page) {
        }//回调事件
    };


    /***
     * 添加html
     * @param currentPage
     * @param totalPage
     * @param jump
     */
    function appendHtml(currentPage, opt, ele) {
        var totalPage = opt.totalPage ? opt.totalPage : Math.ceil(opt.count / opt.limit),//获取总页数
            halfPage = Math.floor(opt.showPage / 2),
            largePage = totalPage - opt.showPage + halfPage;
        var html = [
            '<div class="page">',
            '<div class="pagelist">'
        ];
        var prevDisabled = currentPage === 1 ? 'disabled' : '';
        html.push('<span class="jump ' + prevDisabled + '">' + opt.prev + '</span>');
        //判断跳转是否大于5或者跳转页数  totalpage-showpage+Math.floor(showpage/2)
        //当 当前页 大于5的时候，才考虑特殊分页
        // if (currentPage <= 5 || totalPage <= opt.showPage) {
        if (currentPage <=opt.showPage || totalPage <= opt.showPage) {
            for (var i = 0; i < opt.showPage; i++) {
                html.push('<span class="jump">' + (i + 1) + '</span>');
            }
            if (totalPage > opt.showPage) {
                html.push('<span class="ellipsis" style="">...</span>');
            }
        } else {
            //当页数大于5的时候，默认显示第一页
            html.push('<span class="jump">1</span>');
            html.push('<span class="ellipsis" style="">...</span>');
            //当前页数在总页数的前半段的时候
            if (currentPage < largePage) {
                for (var j = currentPage - halfPage; j <= currentPage + halfPage; j++) {
                    html.push('<span class="jump">' + j + '</span>');
                }
                html.push('<span class="ellipsis">...</span>');
            } else {
                for (var k = totalPage - opt.showPage + 1; k <= totalPage; k++) {
                    html.push('<span class="jump">' + k + '</span>');
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
