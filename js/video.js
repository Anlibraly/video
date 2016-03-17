/**
 * @author Anlibraly
 * @class  活动列表模板
 */
AV.initialize('jwqTrDH9FnXPw4NwTMb2GUXj-gzGzoHsz','gDiSE2aOLAgfxTVOG1Uby5sn');
var myVideo = angular.module("myVideo",[]);
myVideo.config(function($sceDelegateProvider) {
$sceDelegateProvider.resourceUrlWhitelist([
// Allow same origin resource loads.
'self',
// Allow loading from our assets domain. Notice the difference between * and **.
'http://ac-jwqtrdh9.clouddn.com/**']);
});
 myVideo.controller("video",function($scope){
        $scope.comments = [];
        $scope.actid = GetQueryString('ser')==undefined?1:parseInt(GetQueryString('ser')); 
        $scope.cmt_content = "";
        $scope.local = "";
        $scope.page = 0;
        $scope.more = true;
        $scope.votes = null;
        $scope.more_videos = true;
        $scope.video = {"v_url":""};
        $scope.sers = {}; 
        var param = {"ser":$scope.actid};
        AV.Cloud.run('getVideo', param).then(function(res) {
            $scope.video = res;
            $(".media-box").html("<video id='media' width='100%' height='100%' controls='' name='media' "
            +"style='display: inline-block;'><source src='"
            +res.v_url+"' type='video/mp4'></video>");
            var media = document.getElementById("media");
            media.addEventListener("ended",function(){
                     $(".display").removeClass("d_none");
            },false);

            mobShare.config( {
                debug: false, // 开启调试，将在浏览器的控制台输出调试信息
                appkey: '10394e3acfaad', // appkey
                params: {
                    url: window.location.href, // 分享链接
                    title: res.title+":   ", // 分享标题
                    description: res.desc, // 分享内容
                    pic: '', // 分享图片，使用逗号,隔开
                }
            } );   
            $scope.$apply();
        },function(error) {
            showModel('系统错误');
            console.log(error);
        });        
        param = {};
        AV.Cloud.run('queryVote', param).then(function(res) {
            $scope.votes = res.acts;
            $scope.$apply();
             $(".vote_item").bind("click",function(){
                param = {"actid":$(this).attr("data-vid")};
                AV.Cloud.run('vote', param).then(function(res) {
                    $(".display").addClass("d_none");
                },function(error) {
                    showModel('系统错误');
                    console.log(error);
                }); 
            });            
        },function(error) {
            showModel('系统错误');
            console.log(error);
        });     

        AV.Cloud.run('queryVideos', param).then(function(res) {
            $scope.sers = res.acts;
            $scope.$apply();
            $("."+$scope.actid).addClass("on");
        },function(error) {
            showModel('系统错误');
            console.log(error);
        });  


        $scope.zan = function(){
            param = {"actid":$scope.actid};
            AV.Cloud.run('zan_video', param).then(function(res) {
                $scope.video.zan_num++;
                $(".icons-addFav").addClass("on");
                $scope.$apply();
            },function(error) {
                showModel('系统错误');
                console.log(error);
            });           
        };
        $scope.showAll = function(){
            $(".lst").addClass("initialized");
            $scope.more_videos = false;
            //$scope.$apply();
        };
        $scope.addComments = function(){
                var loc = "";
                if (remote_ip_info.province == remote_ip_info.city) {
                    loc = remote_ip_info.province+"市";
                }else{
                    loc = remote_ip_info.province+"省"+remote_ip_info.city+"市";
                }
                param = {"content":$scope.cmt_content,"userid":"网友","loc":loc,"actid":"video_"+$scope.actid,"aware":2};
                AV.Cloud.run('addComment', param).then(function(res) {
                    var a = [];
                    a.push(res);
                    $scope.comments = a.concat($scope.comments);
                    console.log($scope.comments);
                    $scope.cmt_content = "";
                    showModel('评论成功');
                    $scope.$apply();
                },function(error) {
                    showModel('系统错误');
                    console.log(error);
                });
        };

        $scope.getComments = function(){
                param = {"page":$scope.page,"actid":"video_"+$scope.actid}
                AV.Cloud.run('getComments', param).then(function(res) {
                    var result = res.acts; 
                    if (result!=[]&&result.length>0) {
                        for (var i in result) {
                            $scope.comments.push(result[i]);
                        }
                        if(result.length<10){
                            $scope.more = false;
                        }
                        $scope.page++;
                    }else{
                        showModel('没有更多评论了');
                        $scope.more = false;
                    }
                    $scope.$apply();
                },function(error) {
                    showModel('系统错误');
                    $scope.more = false;
                    console.log(error);
                });
        };              

        createModel();
        $scope.getComments();
 });
function GetQueryString(name) 
{ 
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); 
    var r = window.location.search.substr(1).match(reg); 
    if (r!=null) return unescape(r[2]); return null; 
} 
/**
 * 显示提示框
 * @param {Object} id
 */
function showModel(content){
    $(".md-content").html(content) ;
    $("#modalCustom").addClass("md-show");
    t = setTimeout('hideModel("modalCustom")', 3000);
}
/**
 * 隐藏提示框
 * @param {Object} id
 */
function hideModel(){
    $("#modalCustom").removeClass("md-show");
    clearTimeout(t);
}
/**
 * 创建弹窗
 */
function createModel(){
    var modelDiv = document.createElement('DIV');
    modelDiv.setAttribute('class','md-modal md-effect-1');
    modelDiv.setAttribute('id','modalCustom');
     
    var modelDivSpan = document.createElement('SPAN');
    modelDivSpan.setAttribute('class','md-content');
    modelDiv.appendChild(modelDivSpan);
     
    document.body.appendChild(modelDiv);
}
