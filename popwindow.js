/*Created by WunG on 2014/12/11.*/
/*这是一个弹窗控件*/
/*参数为argumentsObj对象，包含： 标题，内容（html代码），初始宽度、高度 */
/*标题居中*/
/*表单为水平*/
/*label居左，右对齐*/
/*form-control居右，左对齐，最长400px*/
/*argumentsObj是一个包含结构的内容
* 这首先是一个优先支持表单的内容.
* 所以会有一个属性argumentsObj.form
* 这里采用了类似bootstrap的构造
* form.labels label，可以使文本也可以是代码
* form.inputs 什么元素都随便咯，可以使文本也可以是代码
* */

function formWindow(arg){
    this.title = sNUtF(arg.title);
    this.color = sNUtF(arg.color);
    this.link = sNUtF(arg.link);
    this.buttons = sNUtF(arg.buttons);
    this.words = sNUtSN(arg.words);
    this.labels = sNUtF(arg.labels);
    this.inputs= sNUtF(arg.inputs);
    this.method = sNUtSN(arg.method);
    this.action = sNUtSN(arg.action);
    this.ajax_success_fun = sNUtF(arg.ajax_success_fun);


    //创建窗口主要内容
    this.create_window = function (){
        this.code_arr = [
        '<div id="pop-window">',
            '<div id="window-wrap">',
                '<div id="window-title">',
                    this.title,
                '</div>',
                '<div id="window-close" onclick="remove_window()">×</div>',
                '<div id="form-wrap">',
                    '<div id="warn-box">',

                    '</div>',
                    '<form action="',this.action,'" method="',this.method,'">',
                        '<table>',
                            '<thead>',
                                '<th>','</th>',
                                '<th>','</th>',
                            '</thead>',
                            '<tbody>',
                                '<tr>',
                                    '<td colspan="2" style="text-align: center;font-weight: normal">',
                                        this.words,
                                    '</td>',
                                '</tr>',
                            '</tbody>',
                        '</table>',
                    '</form>',
                '</div>',
            '</div>',
        '</div>'
        ];
        $("body").append(this.code_arr.join(''));
        this.inputs_arr_str = "";
        for(var i=0; i<this.labels.length;i++){
            temp = [
                '<tr>',
                    '<td>',
                        this.labels[i],
                    '</td>',
                    '<td>',
                        this.inputs[i],
                    '</td>',
                '</tr>'
            ];
            this.inputs_arr_str+=temp.join('');
        }
        $("#form-wrap tbody").append(this.inputs_arr_str);


        if(this.buttons!=false) {
            var last_tr = [
                '<tr>',
                    this.buttons,
                    this.link,
                '</tr>'
            ].join('');
            $("#form-wrap tbody").append(last_tr);

        }
        else{
            var last_tr = '<tr><td colspan="2" style="text-align: center;"><button type="submit" class="btn window-btn">确定</button><button type="button" class="btn window-btn">取消</button>'+this.link+' </td></tr>';
            $("#form-wrap tbody").append(last_tr);
        }



    };
    //绑定事件

    this.binds = function(){
        var the_window = this;
        if(this.buttons==false) {
            //控制按键行为
            $('.window-btn:first-child').click(
                function () {
                    the_window.check_form();
                    the_window.submit();
                }
            );
            $('.window-btn:last-child').click(
                function () {
                    warn('关闭','关闭','f',false,'确认关闭',function(){the_window.remove_window();});
                }
            );
        }
        //事件捕获实现模态框窗口关闭
        document.getElementById('pop-window').addEventListener('click', function (event) {
            if(event.target.id=='pop-window'){
                remove_window();
            }
        }, false);

        $('#pop-window form').submit(function(){
            this.preventDefault();
            the_window.ajax_submit();
        });

    };
    //设置样式
    this.setStyle = function(){
        if (this.color != "") {
            if (this.color == "f") {
                this.color = "#a00";
            }
            else if (this.color == "s") {
                this.color = "#264D7B";
            }
            $("#window-title").css({"background-color": this.color});
            $("#window-close").css({"background-color": this.color});
            //$("#warning-content").css({"color": this.color});
            $("#form-wrap").css({"border-color": this.color});
            $("#form-wrap button").css({"background-color": this.color});
            //控制按键样式
            var brighter_color = get_brighter_color(this.color);
            var color =this.color;
            var window_btn =document.getElementsByClassName('window-btn');
            for(var x=0 ;x< window_btn.length;x++){
                window_btn[x].addEventListener('mouseover',function (event) {
                    $(event.target).css({"background-color": brighter_color});
                });
                window_btn[x].addEventListener('mouseleave',function (event) {
                    $(event.target).css({"background-color": color});
                });
            }
            x=0;
        }



    };
    //全面初始化
    this.init = function(){
        this.create_window();
        this.setStyle();
        this.binds();
    };

    this.showWindow = function(){
        var windowHeight = document.documentElement.clientHeight;
        var mt = (Math.floor((windowHeight - 280) / 2)).toString() + "px";
        $('#pop-window').animate({left: 0, opacity: 1}, 200);
        $('#window-wrap').delay(200).animate({marginTop: mt, opacity: 1}, 300);
    };



    //关闭窗口
    this.remove_window = function(Callback) {
        $('#window-wrap').animate({marginTop:0,opacity:0},300);

        setTimeout(function(){$('#pop-window').animate({opacity:0},200);},300);

        setTimeout(function(){
            $('#pop-window').remove();
        },500);
        if(Callback!=null){
            setTimeout(function(){
                Callback();
                return true;
            },510);
        }
        return true;
    };

    //检查表单
    this.check_form = function(){

    };
    //表单提交
    this.ajax_submit = function(method,url) {
        this.form = $("#form-data form").get();
        this.formdata = new FormData(this.form);
        var form_data = this.formdata;
        this.check_form();
        $.ajax({
                type: method,
                url: url,
                data: {formdata:this.formdata},
                dataType: "json",
                success: function (data) {
                    if(data.status==0){
                        warn('提示','修改成功','f',true);
                        this.ajax_success_fun(data);
                    }
                    else{
                        warn('提示','修改失败,请稍后再试','f',true);
                    }

                }
            }
        );
    };


    this.init();
    return this;
}

function remove_window(Callback){
    $('#window-wrap').animate({marginTop:0,opacity:0},300);

    setTimeout(function(){$('#pop-window').animate({opacity:0},200);},300);

    setTimeout(function(){
        $('#pop-window').remove();
    },500);
    if(Callback!=null){
        setTimeout(function(){
            Callback();
            return true;
        },510);
        function sNUtF(arg){
            if(arg==null ||typeof(arg) == undefined){
                return false;
            }
    }
    return true;
}
//set Null undefined to false
    else{
        return arg;
    }
}
//set Null undefined to ''
function sNUtSN(arg){
    if(arg==null ||typeof(arg) == undefined){
        return '';
    }
    else{
        return arg;
    }
}
function test(){
    var arg = new Object();
    arg.title = "宋子明的博客！";
    arg.color = "#f60";
    arg.link = "<a href='#'>没有账户？注册</a>"
    arg.words = "登录";
    arg.labels = ['用户名','密码'];
    arg.inputs = ['<input type="text" class="form-control" placeholder="请输入您的用户名">','<input type="password" class="form-control" placeholder="请输入您的密码">'];
    window.mmm = new formWindow(arg);
    mmm.showWindow();
}