
window.alert = function (name) {
  const iframe = document.createElement('IFRAME');
  iframe.style.display = 'none';
  iframe.setAttribute('src', 'data:text/plain,');
  document.documentElement.appendChild(iframe);
  window.frames[0].window.alert(name);
  iframe.parentNode.removeChild(iframe);
};

//检查topsearchbar里的表单内容是否为空，空返回false
function checkSearchBarForm(form){
    if(form.search.value==""){
        return false;
    }
    return true;
}

//用于获取cookie指定项
//下面用来获取_xsrf
function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}
//登录，以及验证登录
$("button#loginbut").click(function(){
    var email=$("input[name='email']").val().replace(/(^\s*)|(\s*$)/g,"");
//    email=email.replace(/(^\s*)|(\s*$)/g,"");
    var password=$("input[name='password']").val().replace(/(^\s*)|(\s*$)/g,"");
    if(email==""){
        alert("邮箱不能为空");
        return;
    }else if(password==""){
        alert("密码不能为空");
        return;
    }
    var reg = /\w+[@]{1}\w+[.]\w+/;
    if(!reg.test(email)){
        alert("邮箱格式不正确");
        return;
    }
    var url="/login";
    var data={
        email:email,
        password:password,
        _xsrf:getCookie("_xsrf")
    };
    $.ajax({url: url, data: data, dataType: "text", type: "POST",
        success: function(response) {
            if(response==1){
                window.location.href="/";
            }else if(response==2){
                alert("您还未激活，请去邮箱点击链接完成激活");
            }else{
                alert("用户名或者密码错误");
            }
    }});
});

//注册，以及注册验证
$("button#registerbut").click(function(){
    var username=$("#username_register").val().replace(/(^\s*)|(\s*$)/g,"");
    if(username==""){
        alert("名字不能空");
        return;
    }
    var email=$("#email_register").val().replace(/(^\s*)|(\s*$)/g,"");
    if(email==""){
        alert("邮箱不能空");
        return;
    }else{
        var reg = /\w+[@]{1}\w+[.]\w+/;
        if(!reg.test(email)){
            alert("邮箱格式不正确");
            return;
        }
    }
    var password=$("#password_register").val().replace(/(^\s*)|(\s*$)/g,"");
    if(password==""){
        alert("密码不能空");
        return;
    }
    var repassword=$("#repassword_register").val().replace(/(^\s*)|(\s*$)/g,"");
    if(repassword!=password){
        alert("两次密码不一样");
        return;
    }
    var verificationcode=$("#verificationcode_register").val().replace(/(^\s*)|(\s*$)/g,"");
    if(verificationcode==""){
        alert("验证码不能空");
        return;
    }
    var url="/adduser";
    var data={
        username:username,
        email:email,
        password:password,
        verificationcode:verificationcode,
        _xsrf:getCookie("_xsrf")
    };
    $.ajax({url: url, data: data, dataType: "text", type: "POST",
        success: function(response) {
            if(response==1){
                alert("该邮箱已经被注册");
                return;
            }else{
                window.location="/";
            }
    }});
});

//点击收藏图标添加到用户收藏
function addCollection(span){
    var value = span.getAttribute("value");
    console.log(value);
    var baseinfo=value.split('%');
//    console.log(baseinfo);
    var topicname=baseinfo[0];
    var author=baseinfo[1];
    var coverimage=baseinfo[2];
    var islogin=baseinfo[3];
    console.log(islogin);
    if(islogin=="0"){
        alert("请先登录才能收藏");
        return;
    }
    var iscollected = span.getAttribute("id");
    data={
        topicname:topicname,
        author:author,
        coverimage:coverimage,
        iscollected:iscollected,
        _xsrf:getCookie("_xsrf")
    };
    $.ajax({
        url:"/addCollection",
        data:data,
        dataType: "text",
        type: "POST",
        success:function(arg){

            if(1==arg){ //已经登录

//            console.log(arg);
//            console.log(iscollected);
                if("0"==iscollected){
                    //设置成实心
                    span.setAttribute("id","1");
                    span.setAttribute("class","fa fa-2x fa-star pull-right");
                }else{
                    span.setAttribute("id","0");
                    span.setAttribute("class","fa fa-2x fa-star-o pull-right");
                }
            }
        },
        error:function(){
//            return 0;
        }
    });
}



//查看更多按钮
function searchListAjax(direction){
    var contentholder = document.getElementById("topicname");
    var topicname = contentholder.innerText;
    var currentnum = contentholder.value;
    console.log(topicname);
    console.log(currentnum);
    console.log(direction);
    if(direction==1){

    }
    $.ajax({
        url:"/ajaxSearchList",
        type:"GET",
        data:{
            topicname:topicname,
            currentnum:currentnum,
        },
        success:function(arg){
            var result = jQuery.parseJSON(arg);
            var totalnum = result.totalnum;
            var searchresult = result.searchresult;
            var flag = result.flag;
            addSearchResult(searchresult,totalnum,flag);
        },
        error:function(){
            alert("获取数据失败");
        }
    });
}

//searchlist.html,把ajax加载来的数据添加到DOM
function addSearchResult(searchresult,totalnum,flag){
//    console.log(searchresult);
//    console.log(searchresult.length);
    var panelbody = document.getElementById("panelbody");
    var count = 0;
    var length = searchresult.length;
    var rowdiv;
    var data_toggle;
    var data_target;
    var changeIconJs;


    changeIconJs="addCollection(this)";

    for(count=0;count<length;count++){
        var onetopic = searchresult[count];
        if(count%3==0){
            rowdiv = document.createElement("div");
            rowdiv.setAttribute("class","row-fluid");
        }

    }
}

function checkRegisterForm(form){
    var username=form.username.value;
    username=username.replace(/(^\s*)|(\s*$)/g,"");
    if(username==""){
        alert("用户名不能为空");
        return false;
    }
    var email=form.email.value;
    email=email.replace(/(^\s*)|(\s*$)/g,"")
    if(email==""){
        alert("邮箱不能为空");
        return false;
    }else{
        var reg = /\w+[@]{1}\w+[.]\w+/;
        if(!reg.test(email)){
            alert("邮箱格式不正确");
            return false;
        }
    }
    var password=form.password.value;
    password=password.replace(/(^\s*)|(\s*$)/g,"");
    if(password==""){
        alert("密码不能为空");
        return false;
    }
    var repassword=form.repassword.value;
    repassword=repassword.replace(/(^\s*)|(\s*$)/g,"");
    if(password!=repassword){
        alert("两次密码不一样");
        return false;
    }

    return true;
}