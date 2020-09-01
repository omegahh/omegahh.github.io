/********************************
 * author: Omega (Origin: PiZn) *
 ********************************/
$(document).ready(function() {
    var iLotus = {
        Version: "1.0",
        Author: "Omega"
    };
    /******************
     * goTop Function *
     ******************/
    iLotus.goTop = {
        nodeName: "J-backTop",
        scrollHeight: "100",
        linkBottom: "120px",
        linkRight: 30,
        linkWidth: 32,
        contentWidth: 720,
        contenBigtWidth: 1024,
        _scrollTop: function() {
            if(jQuery.scrollTo) {
                jQuery.scrollTo(0, 800, {queue:true});
            }
        },
        _scrollScreen: function() {
            var that = this, topLink = $('#' + that.nodeName);
            if(jQuery(document).scrollTop() <= that.scrollHeight) {
                topLink.hide();
                return true;
            }  else {
                topLink.fadeIn();
            }
        },
        _resizeWindow: function(right) {
            var that = this, topLink = $('#' + that.nodeName);
            topLink.css({
                'right' : right + 'px',
                'bottom': that.linkBottom
            });
        },
        _changeRight: function() {
            var that = this, right;
            if(jQuery(window).width() > 1440) {
                right = parseInt((jQuery(window).width() - that.contenBigtWidth + 1)/2 - that.linkWidth - that.linkRight, 10);
            } else {

                right = parseInt((jQuery(window).width() - that.contentWidth + 1)/2 - that.linkWidth - that.linkRight, 10);
            }
            if( right < 20 ) {
                right = 20;
            }
            return right;
        },
        run: function() {
            var that = this, topLink = $('<a id="' + that.nodeName + '" href="#" class="lotus-backtop"><i class="icon-circle-arrow-up"></i></a>');
            topLink.appendTo($('body'));
            topLink.css({
                'display': 'none',
                'position': 'fixed',
                'right': that._changeRight() + 'px',
                'bottom': that.linkBottom
            });
            if(jQuery.scrollTo) {
                topLink.click(function() {
                    that._scrollTop();
                    return false;
                });
            }
            jQuery(window).resize(function() {
                that._resizeWindow(that._changeRight());
            });
            jQuery(window).scroll(function() {
                that._scrollScreen();

            });

        }
    }
    /**********************
     * iLotus.changeTheme *
     **********************/
    iLotus.changeTheme = {
        A: function() {
            if(this.check() == "A") {
                $("#J-html").addClass("iLight");
                jQuery.cookie('iTheme', 'B', { expires: 7, path: '/' });
            } else {
                $("#J-html").removeClass("iLight");
                jQuery.cookie('iTheme', 'A', { expires: 7, path: '/' });
            }
        },
        B: function() {
            if(this.check() == "B") {
                $("#J-html").addClass("iLight");
            } else {
                $("#J-html").removeClass("iLight");
            }
        },
        check: function() {
            var iThemeCookie = jQuery.cookie("iTheme");
            if(iThemeCookie != null) {
                return iThemeCookie;
            } else {
                jQuery.cookie('iTheme', 'A', { expires: 7, path: '/' });
                return "A";
            }
        },
        init: function() {
            var that = this;
            $("#J-changeTheme").toggle(function(e) {
                that.A();
            }, function(e) {
                that.A();
            });
            this.B();
        }
    }
    /*******************
     * Search Function *
    ********************/
    iLotus.search = {
        _show: function(){
            $("#search-btn").click(function(){
                $(".search-tool").css("display", "block");
                $("#search-content").val("");
                $("#search-content").focus();
                isShow = true;
            });
        },
        _fade: function(){
            $("#close-btn").click(function(){
                $(".search-tool").css("display", "none");
                isShow = false;
            });
        },
        _keyup: function(){
            $(document).keyup(function(e){
                var nextTime = new Date().getTime();
                if (e.keyCode == 17) {
                    var gap = nextTime - prevTime;
                    prevTime = nextTime;
                    if (gap < 500) {
                        if (isShow) {
                            $(".search-tool").css("display", "none");
                            isShow = false;
                        } else {
                            $(".search-tool").css("display", "block");
                            $("#search-content").val("");
                            $("#search-content").focus();
                            isShow = true;
                        }
                        prevTime = 0;
                    }
                } else if (e.keyCode == 27) {
                    $(".search-tool").css("display", "none");
                    isShow = false;
                    prevTime = 0;
                }
            });
        },
        _get: function(){
            var names = new Array();
            var urls = new Array();
            $.getJSON("/blog/search.json").done(function(data){
                if (data.code == 0) {
                    for (var index in data.data) {
                        var item = data.data[index];
                        names.push(item.title);
                        urls.push(item.url);
                    }
                    $("#search-content").typeahead({
                        source: names,
                        afterSelect: function(item) {
                            $(".search-tool").css("display", "none");
                            isShow = false;
                            window.location.href = ("http://omegaxy.com/blog/" + urls[names.indexOf(item)]);
                        }
                    });
                }
            });
        },
        run: function(){
            var that = this;
            isShow = false;
            prevTime = 0;
            that._show();
            that._fade();
            that._keyup();
            that._get();
        }
    }
    /******************
     * iLotus JS init *
     ******************/
    iLotus.init = {
        run: function() {
            iLotus.goTop.run();
            iLotus.changeTheme.init();
            iLotus.search.run();
        }
    };
    iLotus.init.run();
});
