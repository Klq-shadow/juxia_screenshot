
$(function () {
    const tabs = $(".search-app-tab");
    const tabApps = $(".search-app-tab-apps");
    const tabArticles = $(".search-app-tab-articles");
    const listTitle = $(".list-title");
    const firstApk = $(".first-apk");
    const list = $(".all-list");
    const cs1 = $(".cs1");
    const cs2 = $(".cs2");
    const saAppsDiv = $(".sa-apps-div");
    const saArticlesDiv = $(".sa-articles-div");

    tabs.click(function () {
      tabs.removeClass("activeTab");
      $(this).addClass("activeTab");

      const index = $(this).index();
      if (index === 0) {
        listTitle.add(firstApk).add(list).show();
        $(".a").hide();
      } else if (index === 1) {
        cs1.add(saAppsDiv).add(firstApk).show();
        list.add(cs2).hide();
      } else if (index === 2) {
        cs2.show().add(saArticlesDiv);
        list.add(cs1).add(saAppsDiv).add(firstApk).hide();
      }
    });

    $(".showmore-apps").click(function () {
      cs1.add(saAppsDiv).add(firstApk).show();
      list.add(cs2).hide();
      tabApps.addClass("activeTab").siblings().removeClass("activeTab");
      
      var key = $(".search-key").val();
      if (key == '') {
          key = 'JUXIA';
      }
      var page = $(this).attr('page');
      if (page == undefined) {
        page = 1;
      } 
      var page_new = parseInt(page)+1;
      $(this).attr('page', page_new);

      var baseurl = $(this).attr('data-url');
      
      $.ajax({
        url: baseurl + 'search/ajax',
        type: 'post',
        data: {page:page_new,key:key,type:1},
        success:function (res) {
          result = JSON.parse(res)
            if (result.code == -1) {
                $('.showmore-apps1').remove();
                return false;
            } 
            if(result.code != 1){
                alert(result.msg); return false;
            }
            if (result.data.length > 0) {
              var arr = result.data;
              var html = '';
              $.each(arr, function(i, item){ 
                    html += '<li class="f-list">'
                        + '<a href="' + item.path_url + '" class="dd">'
                        + '<div class="l"><img src="' + item.icon + '" alt="' + item.keyname + '" width="64px" height="64px"/></div>'
                        + '<div class="r"><p class="p1">' + item.keyname + '</p><p class="p2">' + item.describe + '</p>'
                        + '<div class="tags"><span class="tag">' + item.typeinfo + '</span></div></div></a>'
                        + '<div class="right_button"><a href="' + item.path_url + '" class="da"><div class="b"><div class="button">' + item.button + '</div></div></a></div></li>';
              }); 
              $("#search-res-app").append(html);
              if (result.data.length < 10) {
                $('.showmore-apps1').remove();
              }
            }
        }
      });
    });

    $(".showmore-articles").click(function () {
      cs2.show().add(saArticlesDiv);
      list.add(cs1).add(saAppsDiv).add(firstApk).hide();
      tabArticles.addClass("activeTab").siblings().removeClass("activeTab");

      var key = $(".search-key").val();
      if (key == '') {
          key = 'JUXIA';
      }
      var page = $(this).attr('page');
      if (page == undefined) {
        page = 1;
      } 
      var page_new = parseInt(page)+1;
      $(this).attr('page', page_new);
      
      var baseurl = $(this).attr('data-url');

      $.ajax({
        url: baseurl + 'search/ajax',
        type: 'post',
        data: {page:page_new,key:key,type:2},
        success:function (res) {
          result = JSON.parse(res)
            if (result.code == -1) {
              $('.showmore-articles1').remove();
              return false;
            }
            if(result.code != 1){
                alert(result.msg); return false;
            }
            if (result.data.length > 0) {
              var arr = result.data;
              var html = '';
              $.each(arr, function(i, item){
                html += '<li class="article-list-item swiper-slide">'
                      + '<a href="' + item.path_url + '" class="article-image-link">'
                      + '<img src="' + item.list_img + '" alt="' + item.title + '" /></a>'
                      + '<div class="info"><a href="' + item.path_url + '" class="type type-howto">' + item.add_time + '</a>'
                      + '<a href="' + item.path_url + '" class="title">' + item.keyname + '</a><div class="desc">' + item.describe + '</div></div></li>';
              }); 
              $("#search-res-article").append(html);
              if (result.data.length < 10) {
                $('.showmore-articles1').remove();
              }
            }
        }
      });
    })

    $('.serach-but').on('click', function() {
      var dataurl = $(this).attr('data-url');
      var key = $(".search-key").val();
      
      if (key == undefined) {
        var searchUrl = dataurl;
        location.href = searchUrl;
        return;
      }
      
      if (key == '') {
          key = 'JUXIA';
      }
      var searchUrl = dataurl + '?q=' + key;
      location.href = searchUrl;
    });

    $(document).keypress(function(event) {
      var keycode = (event.keyCode ? event.keyCode : event.which);
      if(keycode == '13') {
        var dataurl = $('.serach-but').attr('data-url');
        var key = $(".search-key").val();
        
        if (key == undefined) {
          var searchUrl = dataurl;
          location.href = searchUrl;
          return;
        }
        
        if (key == '') {
            key = 'JUXIA';
        }
        var searchUrl = dataurl + '?q=' + key;
        location.href = searchUrl;
      }
    });
});

  