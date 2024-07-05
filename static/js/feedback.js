$(function () {
            var feedback = {
                feedbackBtn: '.feedback-btn',
                feedbackBox: '.feedback-box',
                feedbackClose: '.feedback-close',
                feedbackToast:'.feedback-toast',
                li: '.feedback-box .xuanxiang li',
                xuanxiang: '建议',
                kuang: '.feedback-box .xuanxiang .kuang',
                textarea: '#feedback-desc',
                ipt: '#feedback-ipt',
                submitBtn: '.submit-feedback',
                html:'',
                flag:true,
                init: function () {
                    this.renderHtml()
                    this.open()
                    this.close()
                    this.liChoose()
                    this.submit()
                },
                renderHtml:function(){
                    this.html = `<div class="feedback-btn">反馈</div>
                    <div class="feedback-box">
                        <div class="feedback-mask"></div>
                        <div class="feedback-content">
                            <div class="feedback-close-box">
                                <div class="feedback-close">✖️</div>
                            </div>
                            <p class="feedback-title">反馈原因</p>
                            <ul class="xuanxiang clearfix">
                                <li data-id="建议"><span class="kuang"></span><span class="text">建议</span></li>
                                <li data-id="不能下载"><span class="kuang"></span><span class="text">不能下载</span></li>
                                <li data-id="网站错误"><span class="kuang active"></span><span class="text">网站错误</span></li>
                                <li data-id="涉及违规"><span class="kuang"></span><span class="text">涉及违规</span></li>
                            </ul>
                            <p class="feedback-title">填写建议</p>
                            <textarea placeholder="填写您的宝贵建议" name="desc" id="feedback-desc" cols="30" rows="5"></textarea>
                            <p class="feedback-title">联系方式</p>
                            <input id="feedback-ipt" type="text" value="" placeholder="留下您的QQ或手机号码">
                            <div class="submit-feedback">提交</div>
                            <div class="kefu">投诉邮箱：qujieri@hotmail.com</div>
                        </div>
                        <div class="feedback-toast"></div>
                    </div>`
                    $('body').append(this.html)
                },
                open: function () {
                    var that = this
                    $('body').on('click',this.feedbackBtn,function(){
                        that.reset()
                        $(that.feedbackBtn).fadeOut(100)
                        $(that.feedbackBox).fadeIn(300)
                    })
                },
                liChoose: function () {
                    var that = this
                    $('body').on('click',this.li,function(){
                        $(that.kuang).removeClass('active')
                        $(this).find('.kuang').addClass('active')
                        that.xuanxiang = $(this).attr('data-id')
                    })
                },
                submit: function () {
                    
                    var that = this
                    $('body').on('click',this.submitBtn,function(){
                        var title = $('title').text()
                        var desc = $(that.textarea).val()
                        var iptVal = $(that.ipt).val()
                        if(!that.flag){
                            that.toast('请不要重复提交')
                            return
                        }
                        if (that.xuanxiang === '建议' && desc.length == 0) {
                            that.toast('请填写完"具体建议"之后提交')
                            return
                        }
                        if (iptVal.length == 0) {
                            that.toast('请输入您的联系方式')
                            return
                        }
                        var url = window.location.href
                        // site url title reason suggesiont contact [client
                        $.ajax({
                            url: 'https://zlink.dahualan.com/d/feedback',
                            type: 'post',
                            dataType: "jsonp",
                            // jsonp: "jsonpCallback",
                            data: {
                                site:'40407',
                                url: url,
                                title: title,
                                reason: that.xuanxiang,
                                suggestion: desc,
                                contact: iptVal,
                                client: navigator.userAgent
                                // navigator: navigator
                            },
                            success:function(res){
                                if(res.code == 1){
                                    that.flag = false
                                    that.toast('提交成功')
                                }else{
                                    that.toast('提交失败，请重新提交')
                                }
                                
                            },
                            error:function(err){
                                console.log(err)
                                that.toast('网络错误，请重新提交')
                            }
                        })
                    })
                },
                close: function () {
                    var that = this
                    $('body').on('click',this.feedbackClose,function(){
                        $(that.feedbackBtn).fadeIn(300)
                        $(that.feedbackBox).fadeOut(100)
                    })
                },
                toast:function(text){
                    var that = this
                    $(that.feedbackToast).fadeIn(200).text(text)
                    var timer = setTimeout(() => {
                        $(that.feedbackToast).fadeOut(200)
                        clearTimeout(timer)
                    }, 2000);
                },
                reset: function () {
                    this.xuanxiang = '建议'
                    $(this.textarea).val('')
                    $(this.ipt).val('')
                    $(this.kuang).removeClass('active')
                    $(this.li).eq(0).find('.kuang').addClass('active')
                }
            }
            feedback.init()
        })