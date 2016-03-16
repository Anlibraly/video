/**
 * @author Anlibraly
 * @class  活动列表模板
 */
 AV.initialize('nWlsDnfd9sa2y8nCa5ct1BE2-gzGzoHsz','DFHJGPcAg3mfweB4X1LSarJa');
 var myAct = angular.module("myComment",[]);
 myAct.controller("commentList",function($scope){
        $scope.comments = [];
        $scope.actid = GetQueryString('actid'); 
        $scope.cmt_content = "";
        $scope.local = "";
        $scope.page = 0;
        $scope.more = true;

        $scope.addComments = function(){
                var loc = "";
                if (remote_ip_info.province == remote_ip_info.city) {
                    loc = remote_ip_info.province+"市";
                }else{
                    loc = remote_ip_info.province+"省"+remote_ip_info.city+"市";
                }
                var param = {"content":$scope.cmt_content,"userid":"网友","loc":loc,"actid":$scope.actid};
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
            var param = {"page":$scope.page,"actid":$scope.actid}
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