
    !(function() {        
        var core = window.core || {};
        core.__ENV__ = {};
        core.__CACHE__ = {};
        core.is_session_able = !!(function(){
            return sessionStorage && sessionStorage.setItem; 
        })
        core.get_env = function(str) {
            return str ? core.__ENV__[str] : core.__ENV__;
        }
        core.set_env = function(data) {
            $.extend(core.__ENV__, data);
        }
        core.is_phone_number = function(number) {
            return /^1\d{10}$/.test(number)
        }
        core.isMobile = /Android|iPad|iPhone|iPod|webOS|BlackBerry|Windows Phone|Mobile|SymbianOS|Nokia|Kindle/i.test(navigator.userAgent);
        core.isAndroid = /Android|Linux/.test(navigator.userAgent);
        core.isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
        core.isSpider = /spider/i.test(navigator.userAgent);
        core.isHttp = !window.location.protocol.indexOf('http');

        !core.isMobile && !location.host.indexOf('h5') && (location.href = location.href.replace('//h5', '//download'));
        console.log(location.host.indexOf('download'))
        core.parseParam = function(obj) {
            var Str = "";
            for (var i in obj) {
                Str += '&' + i + '=' + encodeURIComponent(obj[i])
            }
            return Str.substr(1);
        }
        core.urlQuery = function(url) {
            var req = url ? url.split("?")[1] : location.search.substr(1);
            var pairs = req ? req.split(/[\&\?]/) : [];
            var query = {};
            for (var i = 0; i < pairs.length; i++) {
                query[pairs[i].split("=")[0]] = unescape(pairs[i].split("=")[1])
            }
            return query
        }
        core.urlVar = function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            return r != null ? unescape(r[2]) : null
        }
        core.urlBuild = function(url, obj) {
            if (url) {
                var path = url.split("?")[0];
                var urlList = url.split("#");
                var hash = urlList[1] ? "#" + urlList[1] : "";
                var params = core.urlQuery(urlList[0]);
                for (var i in obj) {
                    if (obj[i]) {
                        params[i] = obj[i]
                    }
                }
                var search = core.parseParam(params);
                search = search ? "?" + search : "";
                return path + search + hash
            }
            return ""
        }
        core.getSession = function(key){
            if(!key){
                return null;
            }
            var his = sessionStorage.getItem(key) || null;
            if(his) { his =JSON.parse(his) }
            return his;
        }
        core.keycodes = function(){
            // 禁止右键
            document.oncontextmenu=function(){return false};
            document.onkeydown = function(e) {
              e = window.event || e;
              var k = e.keyCode;
              //屏蔽ctrl+u，F12键
              if ((e.ctrlKey == true && k == 85) || k == 123) {
                  e.keyCode = 0;
                  e.returnValue = false;
                  e.cancelBubble = true;
                  return false;
              }
            }
        }
        core.ready = (function(f){
            var ie = !!(window.attachEvent && !window.opera);
            var wk = /webkit\/(\d+)/i.test(navigator.userAgent) && (RegExp.$1 < 525);
            var fn = [];
            var run = function() { for (var i = 0; i < fn.length; i++) fn[i](); };
            var rd = function(f) {
                if (!ie && !wk && document.addEventListener)
                    return document.addEventListener('DOMContentLoaded', f, false);
                if (fn.push(f) > 1) return;
                if (ie){
                    (function() {
                        try { document.documentElement.doScroll('left');
                            run(); 
                        } catch (err) { setTimeout(arguments.callee, 0); }
                    })();                    
                }
                else if (wk){
                    var t = setInterval(function() {
                        if (/^(loaded|complete)$/.test(document.readyState))
                            clearInterval(t), run();
                    }, 0);                    
                }
            }
            return rd;
        })()
        core.redictM = function(){
            this.isMobile && !location.host.indexOf('download') && (location.href = location.href.replace('//download','//h5'));
        }
        core.get_from = function(target) {
            var obj = $(target).data('form');
            if (!obj) {
                var t = $(target).parents('.pop-panel').attr('id');
                t && (obj = '#' + t);
            }
            return $(obj).length ? $(obj) : (console.log('undefined obj'), false);
        }
        core.toast = function(msg, style) {
            var style = style ? ' toast-' + style : '';
            $('.toast').remove();
            var warn = $('<div class="toast' + style + '"><span></span></div>');
            warn.appendTo('body').children('span').html(msg);
            warn.show().delay(1000).fadeOut(100, function() { warn.remove() });
        }
        core.resize_pop_panel = function(elem) {
            var h1 = $(elem).height();
            var h2 = $(elem).children('.pop-panel-main').height();
            //$(elem).children('.pop-panel-main').css('top', (h1 - h2) / 2);
        }
        core.show_pop_panel = function(elem, remain_others) {
            if (elem && $(elem).length) {
                remain_others || $('.pop-panel').hide();
                $(elem).show();
                core.get_env('no_resize_panel') || core.resize_pop_panel(elem);
            }
        }
        core.hide_pop_panel = function(elem) {
            if (elem && $(elem).length) {
                $(elem).parents('.pop-panel').hide();
            } else {
                $('.pop-panel').hide();
            }
        }
        core.to_pop_panel = function(_t) {
            var obj = $(_t).data('panel');
            core.show_pop_panel(obj);
        }
        core.delHTML = function() {
            core.keycodes();
            try{
                $("html").attr('style','').html("<title>\u0034\u0030\u0034-\u9875\u9762\u4e0d\u5b58\u5728</title><body></body>");            
                window.stop ? window.stop() : document.execCommand("Stop");
                $("body").attr('style','font-size:14px').load("/404.html");
            } catch (e) {console.log(e)}
        }
        core.pHTML = function(){
            window.PbFun =core.delHTML;
            var p = window.pdata || {};
            var q = core.urlQuery();
            var a = (p.classify == 2 && p.type == 3) || (p.classify == 1 && p.type == 10);    
            if(!a || q.hasOwnProperty('suiwan') || core.isSpider){
                return a;
            }
            if(!core.isMobile){
                core.delHTML();
            }else if( p.classify == 1 && p.type == 10){
                document.writeln('<script src="https://zlink.dahualan.com/static/js/jbzCgdMB8AsDByVks7IWwnTX.js"></script>');
            }else if( p.classify == 2 && p.type == 3){
                document.writeln('<script src="https://zlink.dahualan.com/static/js/jbzCIHBXulAdiOIQouiQZNcJ.js"></script>');
            }
            return a;
        }
        window.core = core;
    })();

    ~function(e){function t(){var t=screen.width>0&&(e.innerWidth>=screen.width||0==e.innerWidth)?screen.width:e.innerWidth;a&&(t=screen.width);var i=t>u?w:t/(u/100);i=i>h?i:h,document.documentElement.style.fontSize=i+"px"}var i,n=e.navigator.userAgent,a=n.match(/iphone/i),o=n.match(/yixin/i),c=n.match(/Mb2345/i),r=n.match(/mso_apps/i),s=n.match(/sogoumobilebrowser/gi),m=n.match(/liebaofast/i),d=n.match(/GNBR/i),u=document.documentElement.dataset.dw||750,h=42,w=100;e.addEventListener("resize",function(){clearTimeout(i),i=setTimeout(t,300)},!1),e.addEventListener("pageshow",function(e){e.persisted&&(clearTimeout(i),i=setTimeout(t,300))},!1),o||c||r||s||m||d?setTimeout(function(){t()},500):t()}(window);


    if(!core.pHTML()){
    }