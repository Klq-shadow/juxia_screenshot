// const BaseUrl = 'https://download.juxia.com';
// const BaseUrl = 'http://test.download.juxia.com';
$(function () {
  //统计浏览代码
  var browse_data = {};
  var id = $("#id").val();
  var name = $("#type").val();
  var pdata = window.pdata || {};
  if (typeof pdata !== "undefined" && id && name) {
    var classify = pdata.classify;
    if (["game", "information"].indexOf(name) >= 0) {
      if (name == "game" && classify == 2) {
        name = "soft";
      }
      var i = new Image();
      i.src = BaseUrl + "/ajax/stat?type=browse&name=" + name + "&id=" + id;
    }
  }
});

function countDown()
{
  var id = $("#id").val();
  var name = $("#type").val();
  var pdata = window.pdata || {};
  if (typeof pdata !== "undefined" && id && name) {
    var classify = pdata.classify;
    if (["game", "information"].indexOf(name) >= 0) {
      if (name == "game" && classify == 2) {
        name = "soft";
      }
      var i = new Image();
      i.src = BaseUrl + "ajax/stat?type=down&name=" + name + "&id=" + id;
    }
  }
}

var ZqPage = {
  zq: "",
  tempPage: {},
  initParam: function (zq, category, json) {
    zq && (this.zq = zq);
    if (category) {
      this.category = category;
      this.tempPage[category] = {
        last: json.last || false,
        current: json.current || 0,
        html: json.html || "",
      };
    }
  },
  loadPage: function (category, page, callback) {
    var data = this.tempPage[category];

    if (!data) {
      this.tempPage[category] = {
        last: false,
        current: 0,
      };
      data = this.tempPage[category];
    }

    if (data.last || page <= data.current) {
      callback(0, data);
      return;
    }

    $.getJSON(
      "/zq/newslist.json",
      {
        zq: this.zq,
        category: category,
        page: page,
      },
      function (ret) {
        if (ret.code == 1) {
          data.last = ret.data.last;
          data.current = ret.data.page;
          var html = ZqPage.renderHTML(ret.data.list);
          ret.data.html = html;
          ZqPage.saveHTML(category, html);
          callback && callback(1, ret.data);
        } else {
          data.last = true;
          callback && callback(0, ret.msg);
        }
      }
    );
  },
  loadHTML: function (category) {
    if (category && this.tempPage[category] && this.tempPage[category].html) {
      return this.tempPage[category].html;
    } else {
      return "";
    }
  },
  saveHTML: function (category, html) {
    var list = this.tempPage[category];
    if (list) {
      if (list.html) {
        list.html += html;
      } else {
        list.html = html;
      }
    }
  },
  renderHTML: function (list) {
    var html = "";
    for (var i in list) {
      var li = `<li>
                        <a class="flex" href="${list[i].url}" title="${list[i].title}">
                            <img src="${list[i].list_img}" alt="${list[i].title}">
                            <div class="info flex_grow">
                                <p>${list[i].title}</p>
                                <p>${list[i].addtime}</p>
                            </div>
                        </a>
                    </li>
                    `;
      html += li;
    }
    return html;
  },
  initList: function (zq) {
    var li = $("#zqNewsTab li.current");
    var current = li.data("page");
    var category = li.data("cate");
    var html = $("#zqNewsList ul").html();
    ZqPage.initParam(zq, category, {
      current: current,
      html: html,
    });
  },
  getMorePage: function () {
    var li = $("#zqNewsTab li.current");
    if (li.length > 0) {
      var page = li.data("page") || 0;
      var category = li.data("cate");
      var last = li.data("last");
    }
    if (last) {
      ZqPage.showMoreBtn(false);
      return;
    }
    if (category) {
      ZqPage.loadPage(category, page + 1, function (sign, data) {
        if (sign == 1) {
          li.data("page", data.page);
          li.data("last", data.last);
          $("#zqNewsList ul").append(data.html);
          category == ZqPage.category && ZqPage.showMoreBtn(!data.last); //优化第一页是页面加载的逻辑
        } else {
          ZqPage.showMoreBtn(false);
          console.log("无更多内容", data);
        }
      });
    }
  },
  showMoreBtn: function (flag) {
    if (flag) {
      $("#game_detail_btn_more").show();
      $("#game_detail_no_more").hide();
    } else {
      $("#game_detail_btn_more").hide();
      $("#game_detail_no_more").show();
    }
  },
};

$(function () {
  if (typeof Swiper !== "undefined") {
    // banner
    var homeBannerSwiper = new Swiper(".home-banner-swiper", {
      autoplay: true,
      autoplay: {
        disableOnInteraction: false,
      },
      pagination: {
        el: ".home-banner-swiper-pagination",
      },
    });
    // 首页热门游戏/应用滚动
    var hotApp = new Swiper(".home-hot-app-swiper", {
      autoplayDisableOnInteraction: false,
      observer: true, //修改swiper自己或子元素时，自动初始化swiper
      observeParents: true, //修改swiper的父元素时，自动初始化swiper
    });
    // 首页热门专区滚动
    var hotZq = new Swiper(".home-hot-zq-swiper", {
      spaceBetween: 10,
      autoplayDisableOnInteraction: false,
      observer: true, //修改swiper自己或子元素时，自动初始化swiper
      observeParents: true, //修改swiper的父元素时，自动初始化swiper
    });
  }

  // 侧边菜单
  $("#menu").click(function () {
    console.log("11111");
    $(".mask").fadeIn(300);
    $("#navList").addClass("nav-list-show ");
  });
  // 关闭侧边菜单
  $("#navList .close").click(function () {
    console.log("11111");
    $(".mask").fadeOut(300);
    $("#navList").removeClass("nav-list-show ");
  });

  // 文章展开收起
  if ($("#hiddenBox").find(".cont").height() < 300) {
    $("#detailContMask").remove();
  } else {
    $("#detailContMask span").on("click", function () {
      if ($("#detailContMask").hasClass("detailContMaskClose")) {
        var flag = $("#detailContMask").attr("data-id");
        wenzhangHideOrShow(flag);
      } else {
        var h = $("#detailCont").height();
        $("#hiddenBox").css({
          height: h + 50 + "px",
        });
      }
      $("#detailContMask").toggleClass("detailContMaskClose");
    });
  }

  // 兼容老版详情页展开收起
  if ($("#hiddenBox").find(".cont").height() < 300) {
    $("#hiddenBox").addClass("auto_box");
    $("#openHidden").remove();
  } else {
    $("#openHidden").on("click", function () {
      $("#hiddenBox").toggleClass("auto_box");
      if ($("#hiddenBox").hasClass("auto_box")) {
        $(this).html("收起更多" + '<i class="icon up"></i>');
      } else {
        $(this).html("展开更多" + '<i class="icon"></i>');
      }
    });
  }

  // 兼容老版专题页展开收起
  if ($("#hiddenBox2").find(".cont").height() < 120) {
    $("#hiddenBox2").addClass("auto_box");
    $("#openHidden2").remove();
  } else {
    $("#openHidden2").on("click", function () {
      $("#hiddenBox2").toggleClass("auto_box");
      if ($("#hiddenBox2").hasClass("auto_box")) {
        $(this).css({
          position: "static",
          width: "100%",
          "text-align": "right",
        });
        $(this).html('<i class="up"></i>' + "收起全部");
      } else {
        $(this).css({
          position: "absolute",
          width: "3rem",
        });
        $(this).html("<i></i>" + "展开全部");
      }
    });
  }

  function wenzhangHideOrShow(flag) {
    if (flag === "zq") {
      $("#hiddenBox").css({
        height: 3.7 + "rem",
      });
    } else {
      $("#hiddenBox").css({
        height: 10 + "rem",
      });
    }
  }
  // 顶部导航手势动画
  $(window).scroll(function () {
    var before = $(window).scrollTop();
    var top = $(document).scrollTop();
    var bottom =
      $(document).scrollTop() - $(document).height() - $(window).height();
    if (top == 0) {
      $(".home-nav").removeClass("top");
      return;
    }
    if (bottom == 0) {
      $(".home-nav").addClass("top");
      return;
    }
    $(window).scroll(function () {
      var after = $(window).scrollTop();
      if (top == 0 || bottom == 0) {
        $(".home-nav").addClass("top");
        return;
      }
      if (after - before > 46) {
        before = after;
        if (!$(".home-nav").hasClass("top")) {
          $(".home-nav").addClass("top");
        }
      }
      if (before - after > 46) {
        if ($(".home-nav").hasClass("top")) {
          $(".home-nav").removeClass("top");
        }
        before = after;
      }
    });
  });

  swipers();
  //专区图鉴切换
  $(".zq_six span").on("click", function () {
    var index = $(this).index();
    $(this).addClass("on").siblings().removeClass("on");
    $(this)
      .parents(".zq_six")
      .find(".zq_nav1_main_tab,.zq_nav2_main_tab")
      .hide()
      .eq(index)
      .show();
  });

  $("#headerNav .mask").click(function () {
    headerNav();
  });
  // tab切换
  $(".tab_menu")
    .find("span")
    .on("click", function () {
      var a = $(this).index();
      $(this).addClass("current").siblings().removeClass();
      $(this)
        .parents(".tab_box")
        .find(".sub_box")
        .eq(a)
        .show()
        .siblings()
        .hide();
    });

  //优化详情页下载链-old
  // var link = $('.downlink');
  // var client = core.isAndroid ? 'android' : (core.isIos ? 'ios' : '');
  // var pdata = window.pdata || {};
  // var dlink = pdata['dlink'] || 0;
  // if (link.length > 0) {
  //     var lock = false;
  //     var appid = link.data('appid');
  //     var durl = "";
  //     var rurl = "";
  //     //var wdj_url = "http://ucan.wandoujia.com/Wandoujia_WDM_482.apk";
  //     var wdj_url = "http://down2.uc.cn/wandj/down.php?id=211&pub=leiz35";
  //     var nlink = function () {
  //         $.getJSON(BaseUrl + '/downs/url?callback=?', {
  //             "id": appid,
  //             "type": client
  //         }, function (r) {
  //             if (r && r.status == 'success') {
  //                 data = r.data;
  //                 if (!data.url) {
  //                     $('.game_detail .cont .rec').hide();
  //                     link.text('预约').removeClass('nodown').addClass('reserve').attr('href', 'javascript:;');
  //                     var appid = link.attr('data-appid');
  //                     var appname = link.attr('data-appname');
  //                     $('#reserve-app-pop').attr('data-appid', appid);
  //                     $('#reserve-app-pop').attr('data-appname', appname);
  //                     link.click(function () {
  //                         var reserve = core.get_env("reserve-app");
  //                         if (reserve) {
  //                             core.toast('已预约');
  //                         } else {
  //                             core.show_pop_panel('#reserve-app-pop');
  //                         }
  //                     });
  //                 } else {
  //                     durl = data.url;
  //                     rurl = data.report;
  //                     if (dlink == 0 || (dlink == 2 && client === 'ios')) {
  //                         link.click(function () {
  //                             if (rurl && !core.get_env("down_reported")) {
  //                                 var i = new Image();
  //                                 i.src = rurl;
  //                                 $.getJSON(BaseUrl + '/ajax/stat?callback=?', {
  //                                     "id": appid,
  //                                     "name": 'down',
  //                                     "classify": pdata['classify']
  //                                 }, function (r) {
  //                                     console.log(r)
  //                                 });
  //                                 core.set_env({
  //                                     'down_reported': 1
  //                                 });
  //                             }
  //                             location.href = durl;

  //                         });
  //                     } else {
  //                         link.click(function () {
  //                             if (rurl && !core.get_env("wdj_reported")) {
  //                                 var i = new Image();
  //                                 i.src = "https://zlink.dahualan.com/d/report?id=75164&site=40407&type=" + client + "&ad_id=20245";
  //                                 core.set_env({
  //                                     'wdj_reported': 1
  //                                 });
  //                             }
  //                             location.href = wdj_url;
  //                         });
  //                         $('.game_detail .cont .rec span').click(function () {
  //                             if (rurl && !core.get_env("down_reported")) {
  //                                 var i = new Image();
  //                                 i.src = rurl;
  //                                 $.getJSON(BaseUrl + '/ajax/stat?callback=?', {
  //                                     "id": appid,
  //                                     "name": 'down',
  //                                     "classify": pdata['classify']
  //                                 }, function (r) {
  //                                     console.log(r)
  //                                 });
  //                                 core.set_env({
  //                                     'down_reported': 1
  //                                 });
  //                             }
  //                             location.href = durl;
  //                         });
  //                     }
  //                 }
  //             } else {
  //                 link.text('暂无下载').removeClass('reserve').addClass('nodown');
  //                 $('.game_detail .cont .rec').hide();
  //             }
  //         });
  //         lock = true;
  //     }

  //     if (!appid) {
  //         link.text('暂无下载').removeClass('reserve').addClass('nodown');
  //         $('.game_detail .cont .rec').hide();
  //     } else if (dlink == 1) {
  //         link.text('已下架').removeClass('reserve').addClass('nodown');
  //         $('.game_detail .cont .rec').hide();
  //     } else {
  //         if (core.isIos) {
  //             link.html('苹果下载<p>需要跳转至官网进行下载</p>').removeClass('reserve').addClass('ios');
  //         }else if (dlink == 2 && !core.isIos) {
  //             link.text('安全下载');
  //             $('.game_detail .cont .rec').show();
  //         }
  //         lock || nlink();
  //     }

  // }

  //优化详情页下载链
  var links = $(".downlinks");
  if (links.length > 0) {
    var appid = links.data("appid");
    var data = {};
    var lock = false;
    var report_a = false;
    var report_i = false;
    var report_w = false;
    var pdata = window.pdata || {};
    var dlink = pdata["dlink"] || 0;
    if (dlink == 1) {
      $(".downlinks .no").show();
      $(".downlinks .android").hide();
      $(".downlinks .ios").hide();
      $(".downlinks .pc").hide();
    } else if (!lock && appid && !isNaN(appid)) {
      $.getJSON(
        BaseUrl + "/downs/url?callback=?",
        {
          id: appid,
        },
        function (r) {
          if (r && r.status == "success") {
            data = r.data;
          }
          if (!data.ios_url && !data.android_url) {
            $(".downlinks .no").show();
          } else {
            $(".downlinks .no").hide();
          }

          if (data.pc_url) {
            $(".downlinks .pc")
              .show()
              .click(function () {
                if (!report_w && data.pc_report) {
                  var i = new Image();
                  i.src = data.pc_report;
                  report_w = true;

                  countDown()
                }
                //location.href = data.pc_url;
                window.open(data.pc_url);
              });
          }

          if (data.ios_url) {
            $(".downlinks .ios")
              .show()
              .click(function () {
                if (data.report && !report_i) {
                  var i = new Image();
                  i.src = data.report + "&type=ios";
                  report_i = true;

                  countDown()
                }
                //location.href = data.ios_url;
                window.open(data.ios_url);
              });
          } else {
            $(".downlinks .ios").hide();
          }
          if (data.android_url) {
            $(".downlinks .android")
              .show()
              .click(function () {
                if (data.report && !report_a) {
                  var i = new Image();
                  i.src = data.report + "&type=android";
                  report_a = true;

                  countDown()
                }
                //location.href = data.android_url;
                // window.open(data.android_url);
                window.open(base_url + "downloads/" + appid);
              });
          } else {
            $(".downlinks .android").hide();
          }
        }
      );
      lock = true;
    }
  }

  // 优化专区页跳转按钮
  var jumpLinkBtn = $(".jumpLinkBtn");
  if (jumpLinkBtn.length > 0) {
    var appid = jumpLinkBtn.data("appid");
    if (!appid) {
      jumpLinkBtn.text("暂无下载").removeClass("reserve").addClass("nodown");
    } else {
      if (dlink == 1) {
        jumpLinkBtn.text("已下架").removeClass("reserve").addClass("nodown");
      } else {
        $.getJSON(
          BaseUrl + "/downs/url?callback=?",
          {
            id: appid,
            type: client,
          },
          function (r) {
            if (r && r.status == "success") {
              var data = r.data;
              if (!data.url) {
                jumpLinkBtn
                  .text("预约")
                  .removeClass("nodown")
                  .addClass("reserve")
                  .attr("href", "javascript:;");
                var appid = link.attr("data-appid");
                var appname = link.attr("data-appname");
                $("#reserve-app-pop").attr("data-appid", appid);
                $("#reserve-app-pop").attr("data-appname", appname);
                jumpLinkBtn.click(function () {
                  var reserve = core.get_env("reserve-app");
                  if (reserve) {
                    core.toast("已预约");
                  } else {
                    core.show_pop_panel("#reserve-app-pop");
                  }
                });
              } else {
                if (client === "android") {
                  jumpLinkBtn
                    .text("安卓下载")
                    .removeClass("reserve")
                    .addClass("android");
                } else if (data.url && client === "ios") {
                  jumpLinkBtn
                    .text("IOS下载")
                    .removeClass("reserve")
                    .addClass("ios");
                }
              }
            }
          }
        );
      }
    }
  }

  //预约
  $("#reserve-app-submit").click(function () {
    var form = core.get_from(this);
    var phone = form.find(".mobile-text").val();
    var appid = form.attr("data-appid") || "";
    var name = form.attr("data-appname") || "";
    var reserve = core.get_env("reserve-app");
    if (reserve) {
      core.toast("已预约");
      core.hide_pop_panel(this);
    } else if (!core.is_phone_number(phone)) {
      core.toast("手机号错误");
    } else {
      var url = core.urlBuild("https://zlink.dahualan.com/d/reserve", {
        site: "40407",
        appid: appid,
        name: name,
        phone: phone,
      });
      var i = new Image();
      i.src = url;

      core.set_env({
        "reserve-app": 1,
      });
      core.toast("预约成功");
      core.hide_pop_panel(this);
    }
  });

  $(".close-panel").click(function () {
    core.hide_pop_panel(this);
  });

  $(".goTop").click(function (e) {
    $("body,html").animate(
      {
        scrollTop: 0,
      },
      300
    );
  });

  // 返回顶部
  $(".back_top").on("click", function () {
    $("body,html").scrollTop(0);
  });

  $("#typeBtn").on("click", function () {
    $("#typeBox").toggleClass("hide");
    $(this).find("i").toggleClass("up");
  });

  function bigImg(imgList, node, id) {
    if (!imgList || !imgList.length) {
      return;
    }
    var id = id || "xzImgBig";
    var imgDiv =
      '<div class="xzImgBig" id="' + id + '"><div class="swiper-wrapper">';
    for (var i = 0; i < imgList.length; i++) {
      var src = imgList.eq(i).attr("src");
      imgDiv +=
        '<div class="swiper-slide"><div class="swiper-zoom-container"><img src="' +
        src +
        '"/></div></div>';
    }
    imgDiv += '</div><div class="pic-mask"></div></div>';
    $(".wrap").append(imgDiv);
    var ImgBig = $("#" + id);
    var swiper = new Swiper("#" + id, {
      zoom: true,
      toggle: true,
      slidesPerView: "auto",
      on: {
        tap: function () {
          ImgBig.addClass("hide");
        },
      },
    });
    ImgBig.addClass("hide");

    $(node).on("click", function () {
      swiper.slideTo($(node).index(this));
      ImgBig.removeClass("hide");
    });
  }

  //游戏截图
  $(function () {
    var imgList = $("#xzImg img");
    if (imgList.length > 0) {
      // var jtw, jth;
      // var oimg = $('.swiper-container1 img');
      // var odiv = $('.swiper-container1 .swiper-slide');
      // jtw = oimg.first().width(),jth = oimg.first().height();
      // if (jtw > jth) {
      //     odiv.width(200);
      //     odiv.height(120);
      // } else {
      //     odiv.width(120);
      //     odiv.height(200);
      // }
      var swiper = new Swiper("#xzImg", {
        /*  slidesOffsetBefore: 0,
            slidesOffsetAfter: 0,
            slidesPerView: 2.5, */
        slidesPerView: "auto",
        spaceBetween: 10,
        freeMode: true,
      });

      // bigImg(imgList, "#xzImg .swiper-slide");
    }
  });

  //资讯页下载
  function getSess(key) {
    if (!key) {
      return null;
    }
    var his = sessionStorage.getItem(key) || null;
    if (his) {
      his = JSON.parse(his);
    }
    return his;
  }
  /*
    function update_news_down() {
        var news_down = $('.news_zq_entrance');
        var rec = getSess('news_down') || {};
        $.getJSON(BaseUrl + '/downs/ad/?callback=?', {
            id: 23
        }, function (r) {
            if (r.code == 1 && r.data) {
                var data = r.data;
                var html = '<div class="content clearfix"><img src="' + data.img + '"><div class="info"><p class="title">' + data.remark + '</p></div></div><div class="btn">下载</div>';
                news_down.attr('href', data.url).html(html);
                rec[news_id] = !0;
                sessionStorage.setItem('news_down', JSON.stringify(rec));
            }
        });
    }
    var news_down = $('.news_zq_entrance');
    var news_id = $('#id').val() || 0;
    var lim = [12, 18];
    var h = new Date().getHours();
    var rec = getSess('news_down') || {};
    var alc = getSess('news_are') || {};
    if (news_down.length > 0 && news_id && !rec[news_id] && !alc['pb']) {
        if (alc.hasOwnProperty('pb')) {
            update_news_down();
        } else {
            window.PbFun = function () {
                core.isPb = true
            };
            $.getScript("https://zlink.dahualan.com/static/js/jbzCgdMB8AsDByVks7IWwnTX.js", function () {
                sessionStorage.setItem('news_are', JSON.stringify({
                    "pb": core.isPb
                }));
                if (!core.isPb) {
                    update_news_down();
                }
            });
        }
    }
*/
  //详情页图片预览
  // var imgList2 = $('#detailCont img');
  // bigImg(imgList2, '#detailCont img', 'xzImgBig2');

  var baseUrl = $.trim($("#base_url").val());
  var keyword = $.trim($("#searchKey").val());

  // 点赞
  $("#like").one("click", function (event) {
    var obj = $(this);
    if ($(this).parents("#detailLike").find("#unlike").hasClass("current")) {
      event.preventDefault();
      layer.open({
        content: "您已经反对过了~请勿再次点击",
        skin: "msg",
        time: 2, //2秒后自动关闭
      });
    } else {
      var original = parseInt($(this).text()),
        nowNum;

      if (!isNaN(original)) {
        // 是数字
        nowNum = original + 1;
      } else {
        // 不是数字
        original = 0;
        nowNum = original + 1;
      }

      $(this).addClass("current");

      var id = $(this).attr("data-id");

      $.getJSON(
        BaseUrl + "/downs/count/?callback=?",
        {
          id: id,
          type: 2,
        },
        function (r) {
          if (r.code == 1) {
            obj
              .parents(".detail_like")
              .find(".like")
              .html('<i><span class="icon"></span></i>' + nowNum);
          } else {
            layer.open({
              content: r.data,
              skin: "msg",
              time: 2, //2秒后自动关闭
            });
          }
        }
      );
    }
  });

  // 反对
  $("#unlike").one("click", function (event) {
    var obj = $(this);
    if ($(this).parents("#detailLike").find("#like").hasClass("current")) {
      event.preventDefault();
      layer.open({
        content: "您已经支持过了~请勿再次点击",
        skin: "msg",
        time: 2, //2秒后自动关闭
      });
    } else {
      var original = parseInt($(this).text()),
        nowNum;

      if (!isNaN(original)) {
        // 是数字
        nowNum = original + 1;
      } else {
        // 不是数字
        original = 0;
        nowNum = original + 1;
      }

      var id = $(this).attr("data-id");
      $.getJSON(
        BaseUrl + "/downs/count/?callback=?",
        {
          id: id,
          type: 2,
          unlike: 1,
        },
        function (r) {
          if (r.code == 1) {
            obj
              .parents(".detail_like")
              .find(".unlike")
              .html('<i><span class="icon"></span></i>' + nowNum);
          } else {
            layer.open({
              content: r.data,
              skin: "msg",
              time: 2, //2秒后自动关闭
            });
          }
        }
      );
    }
  });

  // 分享
  $("#share").on("click", function () {
    $(".share_wrap").removeClass("hide");
    $(".share_wrap_bg").removeClass("hide");
  });
  $(".share_wrap").on("click", ".close", function () {
    $(".share_wrap").addClass("hide");
    $(".share_wrap_bg").addClass("hide");
    $(".txttip").addClass("hide");
  });
  $("#bds_wx").on("click", function () {
    $(".txttip").removeClass("hide");
  });

  // pageBtn
  if ($(".game_detail .cont .btn").length > 0) {
    var pageBtnTop = $(".game_detail .cont .btn").offset().top;
    $(window).scroll(function () {
      var wTop = $(window).scrollTop();
      if (wTop >= pageBtnTop) {
        $(".pageBtn2").removeClass("hide");
      } else {
        $(".pageBtn2").addClass("hide");
      }
    });
  }

  // 搜索
  $("#closeTxt").on("click", function () {
    $(this).siblings("input").val("");
    clearInterval(searchzidong);
  });

  //搜索轮播
  var searchTxt = 0;

  function searchRun() {
    searchTxt++;
    if (searchTxt >= $(".search_ul_txt li").length) {
      searchTxt = 0;
    }
    searchSlider();
  }

  function searchSlider() {
    $(".search_ul_txt").find("li").eq(searchTxt).show().siblings().hide();
    $(".search_txt .text").val(
      $(".search_ul_txt").find("li").eq(searchTxt).text()
    );
  }

  var searchzidong = setInterval(searchRun, 2500);
  if (keyword) {
    clearInterval(searchzidong);
    $(".search_txt .text").val(keyword);
  } else {
    $(".search_txt .text").val($(".search_ul_txt").find("li").eq(0).text());
  }
  $(".search_txt input").focus(function () {
    clearInterval(searchzidong);
  });

  //动态搜索
  function liftSearch() {
    var keyword = $.trim($("#searchKey").val());
    var baseurl = $.trim($("#baseUrl").val());
    if (keyword) {
      $.ajax({
        url: baseurl + "search/search/",
        type: "POST",
        data: {
          keyword: keyword,
        },
        success: function (data) {
          $(".search_wrap").hide();
          $(".search_list_wrap_div").show();
          $(".search_list_wrap").html(data);
        },
      });
    } else {
      $(".search_wrap").show();
    }
  }

  //点击搜索
  $("#dosearch").click(function () {
    var keyword = $("#searchKey").val();
    if (keyword) {
      window.location.href = baseurl + "search/?key=" + encodeURI(keyword);
    }
  });

  $(document).keyup(function (event) {
    if (event.keyCode == 13) {
      $("#dosearch").click();
    }
  });

  $("#search_more").click(function () {
    var more = $(this);
    var baseurl = $.trim($("#baseUrl").val());
    var keyword = $.trim($("#searchKey").val());
    var page = parseInt($(this).attr("page"));
    var totpage = parseInt($(this).attr("totpage"));
    $.ajax({
      url: baseurl + "search/",
      type: "get",
      data: {
        key: keyword,
        page: page,
      },
      success: function (res) {
        $(".search_list_wrap2").append(res);
        more.attr("page", page + 1);
        if (page + 1 >= totpage) {
          more.remove();
        }
      },
    });
  });

  //专区
  $("#zqNewsTab li").click(function () {
    var category = $(this).data("cate");
    var last = $(this).data("last");
    var index = $(this).index();
    $("#zqNewsTab li")
      .eq(index)
      .addClass("current")
      .siblings()
      .removeClass("current");
    var html = ZqPage.loadHTML(category);
    $("#zqNewsList ul").html(html);
    ZqPage.showMoreBtn(!last);
    last || html || ZqPage.getMorePage();
  });

  $("#game_detail_btn_more").click(function () {
    ZqPage.getMorePage();
  });

  //新闻详情页

  //新闻详情视频自动播放
  if ($("#vedioAd").length > 0 && $("#vedioAd video").length > 0) {
    var vedioAdTop = $("#vedioAd").offset().top - 490;
    $(window).scroll(function () {
      var wTop = $(window).scrollTop();
      if (wTop >= vedioAdTop && $("#vedioAd video").attr("data-play") != 1) {
        var promise = $("#vedioAd video")[0].play();
        $("#vedioAd video").attr("data-play", "1");
        if (promise !== undefined) {
          promise
            .catch((error) => {
              console.log("1");
            })
            .then(() => {
              // Auto-play started
              console.log("2");
            });
        } else {
          console.log("3");
        }
      }
    });
    $("#vedioAd video").on("ended", function () {
      $(".vback").show();
    });
  }

  if ($("#video").length > 0) {
    $(".game-video video").on("ended", function () {
      $(".vback").show();
    });
    $("#replay").on("click", function () {
      $(this).parents(".game-video").find("video")[0].play();
      $(this).parents(".vback").hide();
    });
  }

  function videoResize() {
    var video = $("#detailCont iframe.video");
    if (video.length) {
      var w = $("#detailCont").width();
      video.width(w);
      video.height(w / 1.5);
    }
  }
  videoResize();

  $(window).resize(function () {
    videoResize();
  });
});

function swipers() {
  $(".zq_nav1_main_tab,.zq_nav2_main_tab").hide();
  $(".zq_nav1_main_tab0,.zq_nav2_main_tab0").show();

  //联动轮播（导航按钮切换tab功能）
  var NavDoms = $(".zq_nav");
  for (var i = 0; i < NavDoms.length; i++) {
    new Swiper(".zq_nav" + (i + 1), {
      spaceBetween: 0,
      slidesPerView: "auto",
      freeMode: true,
    });
  }

  //无联动轮播
  var tabDoms = $(".tab_box");
  for (var i = 0; i < tabDoms.length; i++) {
    new Swiper(".tab_box" + (i + 1), {
      autoplay: false, //可选选项，自动滑动
      observer: true,
      pagination: {
        el: ".swiper-pagination",
      },
    });
  }
  var zq_nav1_main_tab = $(".zq_nav1_main_tab");
  for (var i = 0; i < zq_nav1_main_tab.length; i++) {
    new Swiper(".zq_nav1_main_tab" + i, {
      autoplay: false, //可选选项，自动滑动
      observer: true,
      pagination: {
        el: ".swiper1-pagination" + i,
      },
    });
  }
  var zq_nav2_main_tab = $(".zq_nav2_main_tab");
  for (var i = 0; i < zq_nav2_main_tab.length; i++) {
    new Swiper(".zq_nav2_main_tab" + i, {
      autoplay: false, //可选选项，自动滑动
      observer: true,
      pagination: {
        el: ".swiper2-pagination" + i,
      },
    });
  }
}
