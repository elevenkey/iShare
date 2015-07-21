

var qiaodaDirectives = angular.module('qiaodaDirectives', [
        'ui.router'
])


//屏蔽鼠标右键
.directive('ngRightClick', ['$parse', function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {  
            scope.$apply(function() {  
                event.preventDefault();  
                fn(scope, {$event:event});  
            });  
        });
    };
}])



//跳到绑定的元素
.directive('scrollTop', ['$parse', '$uiViewScroll',function($parse, $uiViewScroll) {
    return function(scope, element, attrs) {
            $uiViewScroll(element);
//            console.log($(window));
    };
}])

//打开关闭列表页的某一时间段
.directive('closeByDay', function(){
	return {
    	restrict: "A",
        link: function( $scope, element, attrs ) {
            //console.log($scope)
        	element.bind( "click", function() {
            	var c = angular.element(element).next('ul').attr('ng-hide');
                //console.log(c);
                $scope[c] = !$scope[c];
                if($scope[c]){
                    element.addClass('close');
                }else{
                    element.removeClass('close');
                }
                $scope.$apply();
            });
    	}
    };
})




//控制功能菜单
.directive('operationControl', function(){
    return {
        restrict: "A",
        link: function( $scope, element, attrs ) {
            element.bind( "click", function(e) {
                $scope.listOpertion = !$scope.listOpertion;
                if($scope.listOpertion){
                    element.addClass('active');
                }else{
                    element.removeClass('active');
                }
                $scope.$apply();
            });
        }
    };
})




//删除列表页标签
.directive('delLabel', ['$http', function($http){
    return {
        restrict: "A",
        link: function( $scope, element, attrs ) {


            element.bind( "click", function(e) {


                        $http({
                            method: 'GET',
                            url: 'http://192.168.6.71:83/Resumetag/ResumeTag/deleteResumeTagByPK',
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            params: {
                                    id: attrs.delLabel
                            }
                        }).
                        success(function(data, status, headers, config) {
                                    if(data.status){


                                    angular.forEach(($scope.userDetail?$scope.userDetail.ulable:$scope.resumeOne.ulable), function(value, key) {


                                            if(parseInt(value.id) === parseInt(attrs.delLabel) ){
                                                    //p.ulable.splice(key,1);
                                                    if($scope.userDetail){
                                                            //单页
                                                            p = $scope.userDetail.ulable.splice(key,1);
                                                    }else{
                                                            //列表
                                                            p = $scope.resumeOne.ulable.splice(key,1);
                                                    }
                                            }

                                    });

                                    }
                        }).
                        error(function(data, status, headers, config) {
                        });
            });
        }
    };
}])


//添加列表页标签
.directive('addNewlabel', ['$modal', '$http', function($modal, $http){
    return {
        restrict: "A",
        link: function( $scope, element, attrs ) {
            var el = element.find('input');
            var saveLabel = function(val){
                    //检测是单份操作还是列表页操作
                    var p;
                    if($scope.userDetail){
                           //单页
                           p = $scope.userDetail;
                    }else{
                            //列表
                            p = $scope.resumeOne;
                    }
                    return $http({
                            method: 'POST',
                            url: 'http://192.168.6.71:83/Resumetag/ResumeTag/add_NewTag_ResumtTag',
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            data:{
                                    "data": {
                                            person_id: p.person_id,
                                            job_id: p.job_id,
                                            from_id: p.from_id,
                                            job_folder_id: p.job_folder_id
                                    },
                                    "label": val
                            }
                    }).
                    success(function(data, status, headers, config) {

                                //console.log(data);
                                if(data.status && !data.is_repeat){
                                        if($scope.userDetail){
                                                $scope.userDetail.ulable.push({id:data.id, str:val, type:'custom'});
                                        }else{
                                                $scope.resumeOne.ulable.push({id:data.id, str:val, type:'custom'});
                                        }
                                }else{

                                }
                                setTimeout(function(){element.css('display','inline-block');}, 500);
                        }).
                    error(function(data, status, headers, config) {
                                //console.log('网络错误')
                    });


            };



//            element.bind('mouseenter', function(e){
//                    el[0].focus();
//                    el.val('');
//                    el.css('width','100px');
//            });

            element.bind('focusin', function(e){
                    el[0].focus();
                    el.val('');
                    el.css('width','100px');
            });

            element.bind('focusout', function(e){

                    var val = el.val();
                    if(val !== '' && val !== '+'){
                        saveLabel(val);
                        element.css('display','none');
                    }
                    el.val('+');
                    el[0].blur();
                    el.css('width','20px');
            });

            element.bind('keydown', function(e){
                switch(e.keyCode) {
                        case 13:
                                var val = element.find('input').val();
                                if(val !== '' && val !== '+'){
                                        saveLabel(val);
                                        element.css('display','none');
                                }
                                el.val('+');
                                el[0].blur();
                                el.css('width','20px');
                                break;


                }
            });




//            element.bind( "ddclick", function(e) {
//
//                    var parentScope = $scope;
//                    var modalInstance = $modal.open({
//                            templateUrl: 'app/common/pop-label.html',
//                            controller: ['$scope', '$modalInstance', function($scope, $modalInstance){
//
//                                    $scope.cancel = function () {
//                                            $modalInstance.dismiss('cancel');
//                                    };
//                                    $scope.ok = function () {
//
//                                            //检测是否填写了标签
//                                            if($scope.label === ""){return;}
//
//                                            //检测是单份操作还是列表页操作
//                                            if(parentScope.userDetail){
//                                                   //单页
//                                                   var p = parentScope.userDetail;
//                                            }else{
//                                                    //列表
//                                                    var p = parentScope.resumeOne;
//                                            }
//
//                                            $http({
//                                                    method: 'POST',
//                                                    url: 'http://192.168.6.71:83/Resumetag/ResumeTag/add_NewTag_ResumtTag',
//                                                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
//                                                    data:{
//                                                            "data": {
//                                                                    person_id: p.person_id,
//                                                                    job_id: p.job_id,
//                                                                    from_id: p.from_id,
//                                                                    job_folder_id: p.job_folder_id
//                                                            },
//                                                            "label": $scope.label
//                                                    }
//                                            }).
//                                            success(function(data, status, headers, config) {
//                                                        if(data.status && !data.is_repeat){
//                                                                if(parentScope.userDetail){
//                                                                        parentScope.userDetail.ulable.push({id:data.id, str:$scope.label, type:'custom'});
//                                                                }else{
//                                                                        parentScope.resumeOne.ulable.push({id:data.id, str:$scope.label, type:'custom'});
//                                                                }
//                                                                $modalInstance.close('');
//                                                        }else{
//
//                                                        }
//                                                }).
//                                            error(function(data, status, headers, config) {
//                                                        //console.log('网络错误')
//                                            });
//                                    };
//                            }]
//
//                        });
//                    modalInstance.result.then(function(ret){
//                            //点击确认之后，执行
//                            //console.log('ret2'+ret);
//
//                    }, function(){
//                            //点击取消之后执行
//                            //console.log(new Date());
//
//                    });
//            });
        }
    };
}])








//弹窗：查看简历
.directive('popView', ['resumesTransfer', function(resumesTransfer){
    return {
            restrict: "A",
            link: function( $scope, element, attrs ) {
                    element.bind( "click", function(e) {


                            //测试是否选择了用户
                            if(!resumesTransfer.testUser()){
                                    return;
                            }

                            var user = resumesTransfer.getData('person_id,job_id');

                            var url = '';
                            for(var i = 0, j = user.length; i < j; i++){
                                    url += user[i].person_id + ',' + user[i].job_id + ":";
                            }

                            //return;
                            //for(var p in $scope.selectedUrl){
                            //        url += $scope.selectedUrl[p] + ":";
                            //}

                            if(url !== ''){$scope.seeDetail(url);}
                    });
            }
    };
}])






//弹窗：转发简历
.directive('popForward', ['$http', '$modal', 'resumesTransfer', function($http, $modal, resumesTransfer){
    return {
            restrict: "A",
            link: function( $scope, element, attrs ) {
                    element.bind( "click", function(e) {




                            //测试是否选择了用户及是单用户还是多用户
                            var listCache;
                            if($scope.userDetail){
                                    listCache = [{
                                            job_id: $scope.userDetail.job_id,
                                            person_id: $scope.userDetail.person_id
                                    }];
                            }else if(resumesTransfer.testUser()){
                                    //获取简历缓存对象
                                    listCache = resumesTransfer.getData('job_id,person_id');
                            }else{
                                    return;
                            }

                            var modalInstance = $modal.open({
                                    templateUrl: 'app/common/pop-forward.html',

                                    controller: ['$scope', '$modalInstance', function($scope, $modalInstance){
                                            $scope.pop = {};
                                            $scope.pop.type = 'html';
                                            $scope.pop.title = '请评审应聘者简历';
                                            $scope.pop.titlere =  /^([0-9a-zA-Z_]+@[0-9a-zA-Z_]+((\.)[0-9a-zA-Z_]+)+[;]*){1,3}$/;
                                            $scope.pop.detail = '您好！\n这是一些应聘者的简历，我觉得还不错。请您评审一下。您若觉得合适，我们再进行下一步安排';


                                            $scope.cancel = function () {
                                                    $modalInstance.dismiss('cancel');
                                            };
                                            $scope.ok = function () {
                                                    if(!$scope.pop.rec||!$scope.pop.title||!$scope.pop.detail){
                                                         return;
                                                    }
//                                                    $http({
//                                                            method: 'POST',
//                                                            url: 'http://192.168.6.71:83/Resume/ResumeForward/executeForward',
//                                                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
//                                                            data:{
//                                                                    "data": listCache,
//                                                                    "rec": $scope.pop.rec,
//                                                                    "title": $scope.pop.title,
//                                                                    "type": $scope.pop.type,
//                                                                    "detail": $scope.pop.detail
//                                                            }
//                                                    }).
//                                                        success(function(data, status, headers, config) {
//                                                                if(data.status){
//                                                                        $modalInstance.close('');
//                                                                }else{
//
//                                                                }
//                                                        }).
//                                                        error(function(data, status, headers, config) {
//                                                                //console.log('网络错误')
//                                                        });
                                                    //$modalInstance.close('发送消息：ok');
                                            };
                                    }]
                            });

                            //promise
                            modalInstance.result.then(function(ret){
                                    //点击确认之后，执行
                                    //console.log('ret2'+ret);

                            }, function(){
                                    //点击取消之后执行
                                    //console.log(new Date());

                            });
                    });
            }
    };
}])





//弹窗：下载
.directive('popExport', ['$http', '$modal', 'resumesTransfer', function($http, $modal, resumesTransfer){
    return {
            restrict: "A",
            link: function( $scope, element, attrs ) {
                    element.bind( "click", function(e) {

//                            //测试是否选择了用户
//                            if(!resumesTransfer.testUser()){
//                                    //console.log('没有选择用户');
//                                    return;
//                            }
//
//                            //获取简历缓存对象
//                            var listCache = resumesTransfer.getData('job_id,person_id');
////                            console.log(listCache);

                            //测试是否选择了用户及是单用户还是多用户
                            var listCache;
                            if($scope.userDetail){
                                    listCache = [{
                                            job_id: $scope.userDetail.job_id,
                                            person_id: $scope.userDetail.person_id
                                    }];
                            }else if(resumesTransfer.testUser()){
                                    //获取简历缓存对象
                                    listCache = resumesTransfer.getData('job_id,person_id');
                            }else{
                                    return;
                            }




                            var modalInstance = $modal.open({
                                    templateUrl: 'app/common/pop-multiExport.html',
                                    controller: ['$scope', '$modalInstance', function($scope, $modalInstance){

                                            $scope.pop = {};
                                            $scope.pop.export = 'html';
                                            $scope.cancel = function () {
                                                    $modalInstance.dismiss('cancel');
                                            };
                                            $scope.ok = function () {

                                                    window.open('http://192.168.6.71:83/Resume/ResumeExport/executeExport/info/' + encodeURI(JSON.stringify(listCache)) + '/type/'+$scope.pop.export);
//                                                    $http({
//                                                            method: 'POST',
//                                                            url: 'http://192.168.6.71:83/Resume/ResumeExport/executeExport',
//                                                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
//                                                            data:{
//                                                                    "data": listCache,
//                                                                    "type": $scope.pop.export
//                                                            }
//                                                    }).
//                                                    success(function(data, status, headers, config) {
//                                                                if(data.status){
//                                                                        $modalInstance.close('');
//                                                                }else{
//
//                                                                }
//                                                    }).
//                                                    error(function(data, status, headers, config) {
//                                                           console.log('网络错误')
//                                                    });
                                            };
                                    }]
                            });

                            //promise
                            modalInstance.result.then(function(ret){
                                    //点击确认之后，执行
                                    //console.log('ret2'+ret);

                            }, function(){
                                    //点击取消之后执行
                                    //console.log(new Date());

                            });
                    });
            }
    };
}])







//弹窗：移动
.directive('popRec', ['$http', '$modal', 'resumesTransfer', 'getComList', 'getJobList', function($http, $modal, resumesTransfer, getComList, getJobList){
    return {
            restrict: "A",
            link: function( $scope, element, attrs ) {
                    element.bind( "click", function(e) {
                              //console.log('click:'+new Date());
//                            //测试是否选择了用户
//                            if(!resumesTransfer.testUser()){
//                                    //console.log('没有选择用户');
//                                    return;
//                            }
//
//
//                            //获取简历缓存对象
//                            var listCache = resumesTransfer.getData('resume_job_id');


                            //测试是否选择了用户及是单用户还是多用户
                            var listCache;
                            if($scope.userDetail){
                                    listCache = [{
                                            resume_job_id: $scope.userDetail.resume_job_id
                                    }];
                            }else if(resumesTransfer.testUser()){
                                    //获取简历缓存对象
                                    listCache = resumesTransfer.getData('resume_job_id');
                            }else{
                                    return;
                            }




                            var modalInstance = $modal.open({
                                    templateUrl: 'app/common/pop-recommend.html',
//                                    resolve: {
//                                            items: function () {
//                                                    //return $scope.items;
//                                                    return getJobList.loadJobPop({}).then(function (data) {
//                                                            return data.data;
//                                                    }, function () {
//                                                            return {};
//                                                    });;
//                                            }
//                                    },
                                    controller: ['$scope', '$modalInstance', function($scope, $modalInstance){

                                            //console.log(items.jobList);
                                            //return;

                                            //console.log('controller:'+new Date());

                                            $scope.loading = true;
                                            $scope.jobselect = {};

                                            //初始化读取列表数据
                                            getComList.loadCom({}, function(ret){

                                                    //console.log('showdata:'+new Date());
                                                    $scope.enterprise = ret;
                                            });

                                            //初始化读取职位列表数据
                                            getJobList.loadJobPop({}, function(ret){
                                                    $scope.joblist = ret;
                                                    $scope.loading = !$scope.loading;
                                            });


                                            //弹窗交互操作
                                            $scope.cancel = function () {
                                                    $modalInstance.dismiss('cancel');
                                            };
                                            $scope.ok = function () {

                                                    if(!$scope.jobselect.a){
                                                            return;
                                                    }

                                                    $http({
                                                            method: 'POST',
                                                            url: 'http://192.168.6.71:83/Resume/ResumeRecommend/recommendResumeToJob',
                                                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                                                            data:{
                                                                    "data": listCache,
                                                                    "jobinof": $scope.jobselect.a
                                                            }
                                                    }).
                                                    success(function(data, status, headers, config) {
                                                                if(data.status){
                                                                        $modalInstance.close('');
                                                                }else{

                                                                }
                                                    }).
                                                    error(function(data, status, headers, config) {
                                                                 //console.log('网络错误')
                                                    });
                                            };
                                    }]
                            });

                            //promise
                            modalInstance.result.then(function(ret){
                                    //点击确认之后，执行
                                    //console.log('ret2'+ret);

                            }, function(){
                                    //点击取消之后执行
                                    //console.log(new Date());

                            });
                    });
            }
    };
}])







//弹窗：打印
.directive('popPrint', ['$http', '$modal', 'resumesTransfer', function($http, $modal, resumesTransfer){
    return {
            restrict: "A",
            link: function( $scope, element, attrs ) {
                    element.bind( "click", function(e) {

//                            //测试是否选择了用户
//                            var _num = resumesTransfer.testUser();
//                            if(_num > 1 || _num === false){
//                                    //console.log('一次只能打印一份简历');
//                                    return;
//                            }
//
//
//                            //获取简历缓存对象
//                            var listCache = resumesTransfer.getData('job_id,person_id,ujob');


                            //测试是否选择了用户及是单用户还是多用户
                            var listCache;
                            if($scope.userDetail){
                                    listCache = [{
                                            job_id: $scope.userDetail.job_id,
                                            person_id: $scope.userDetail.person_id,
                                            ujob: $scope.userDetail.ujob
                                    }];
                            }else if(resumesTransfer.testUser()===1){
                                    //获取简历缓存对象
                                    listCache = resumesTransfer.getData('job_id,person_id,ujob');
                            }else{
                                    return;
                            }





                            var modalInstance = $modal.open({
                                    templateUrl: 'app/common/pop-print.html',
                                    controller: ['$scope', '$modalInstance', function($scope, $modalInstance){

                                            $scope.pop = {};
                                            $scope.pop.print = {
                                                    self: 1,
                                                    work: 1,
                                                    pro: 1,
                                                    edu: 1,
                                                    other: 1
                                            };



                                            $scope.cancel = function () {
                                                    $modalInstance.dismiss('cancel');
                                            };
                                            $scope.ok = function () {
                                                    //$modalInstance.close('发送消息：ok');
                                                    //http://192.168.6.71:83/Resume/ResumePrint/executePrint
                                                    $scope.pop.print.jobname = listCache[0].ujob;
                                                    $scope.pop.print.personid = listCache[0].person_id;
                                                    $scope.pop.print.jobid = listCache[0].job_id;

                                                    // console.log(encodeURI(JSON.stringify($scope.pop.print)));

                                                    window.open('http://192.168.6.71:83/Resume/ResumePrint/executePrint/info/' + encodeURI(JSON.stringify($scope.pop.print)));

                                            };
                                    }]
                            });

                            //promise
                            modalInstance.result.then(function(ret){
                                    //点击确认之后，执行
                                    //console.log('ret2'+ret);

                            }, function(){
                                    //点击取消之后执行
                                    //console.log(new Date());

                            });
                    });
            }
    };
}])









//弹窗：屏蔽
.directive('popDisabled', ['$http', '$modal', 'resumesTransfer', function($http, $modal, resumesTransfer){
        return {
            restrict: "A",
            link: function( $scope, element, attrs ) {

                    element.bind( "click", function(e) {

//                            //测试是否选择了用户
//                            if(!resumesTransfer.testUser()){
//                                //console.log('没有选择用户');
//                                return;
//                            }
//
//                            //获取简历缓存对象
//                            var listCache = resumesTransfer.getData('job_id,person_id');

                            //测试是否选择了用户及是单用户还是多用户
                            var listCache;
                            if($scope.userDetail){
                                    listCache = [{
                                            job_id: $scope.userDetail.job_id,
                                            person_id: $scope.userDetail.person_id
                                    }];
                            }else if(resumesTransfer.testUser()){
                                    //获取简历缓存对象
                                    listCache = resumesTransfer.getData('job_id,person_id');
                            }else{
                                    return;
                            }



                            var modalInstance = $modal.open({
                                    templateUrl: 'app/common/pop-disable.html',
                                    controller: ['$rootScope', '$scope', '$modalInstance', function($rootScope, $scope, $modalInstance){

                                            $scope.cancel = function () {
                                                    $modalInstance.dismiss('cancel');
                                            };
                                            $scope.ok = function () {
                                                    //简历id(person_id)和职位id(job_id)  post：
                                                    //$modalInstance.close('发送消息：ok');
                                                    //todo post跨域传数据，接收不到 急需解决，get传数据太麻烦，需要拼字符串
                                                    $http({
                                                            method: 'POST',
                                                            url: 'http://192.168.6.71:83/Search/SearchResume/shieldResume',
                                                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                                                            data:{
                                                                    "data":listCache
                                                            }
                                                    }).
                                                    success(function(data, status, headers, config) {
                                                            if(data.status){
                                                                    $modalInstance.close('');
                                                                    $rootScope.$broadcast('modifyResumeList', listCache);

                                                            }else{

                                                            }
                                                    }).
                                                    error(function(data, status, headers, config) {
                                                            //console.log('网络错误')
                                                    });
                                            };
                                    }]
                            });


                            //promise
                            modalInstance.result.then(function(ret){
                                    //点击确认之后，执行
                                    //console.log('ret2'+ret);

                            }, function(){
                                    //点击取消之后执行
                                    //console.log(new Date());

                            });
                    });
            }
        };
}])

//删除
.directive('popDelete', ['$http', '$modal', 'resumesTransfer', function($http, $modal, resumesTransfer){
        return {
            restrict: "A",
            link: function( $scope, element, attrs ) {

                    element.bind( "click", function(e) {

//                            //测试是否选择了用户
//                            if(!resumesTransfer.testUser()){
//                                //console.log('没有选择用户');
//                                return;
//                            }
//
//                            //获取简历缓存对象
//                            var listCache = resumesTransfer.getData('job_id,person_id');

                            //测试是否选择了用户及是单用户还是多用户
                            var listCache;
                            if($scope.userDetail){
                                    listCache = [{
                                            job_id: $scope.userDetail.job_id,
                                            person_id: $scope.userDetail.person_id
                                    }];
                            }else if(resumesTransfer.testUser()){
                                    //获取简历缓存对象
                                    listCache = resumesTransfer.getData('job_id,person_id');
                            }else{
                                    return;
                            }



                            var modalInstance = $modal.open({
                                    templateUrl: 'app/common/pop-del.html',
                                    controller: ['$rootScope', '$scope', '$modalInstance', function($rootScope, $scope, $modalInstance){

                                            $scope.cancel = function () {
                                                    $modalInstance.dismiss('cancel');
                                            };
                                            $scope.ok = function () {
                                                    //简历id(person_id)和职位id(job_id)  post：
                                                    //$modalInstance.close('发送消息：ok');
                                                    //todo post跨域传数据，接收不到 急需解决，get传数据太麻烦，需要拼字符串
                                                    $http({
                                                            method: 'POST',
                                                            url: 'http://192.168.6.71:83/Resume/ResumeDelete/executeDelete',
                                                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                                                            data:{
                                                                    "data":listCache
                                                            }
                                                    }).
                                                    success(function(data, status, headers, config) {
                                                            if(data.status){
                                                                    $modalInstance.close('');
                                                                    $rootScope.$broadcast('modifyResumeList', listCache);

                                                            }else{

                                                            }
                                                    }).
                                                    error(function(data, status, headers, config) {
                                                            //console.log('网络错误')
                                                    });
                                            };
                                    }]
                            });


                            //promise
                            modalInstance.result.then(function(ret){
                                    //点击确认之后，执行
                                    //console.log('ret2'+ret);

                            }, function(){
                                    //点击取消之后执行
                                    //console.log(new Date());

                            });
                    });
            }
        };
}])













//弹窗：删除
/*.directive('popDelete', function($modal){
    return {
            restrict: "A",
            link: function( $scope, element, attrs ) {
                    element.bind( "click", function(e) {
                            var modalInstance = $modal.open({
                                    templateUrl: 'app/common/pop-del.html',
                                    controller: ['$scope', '$modalInstance', function($scope, $modalInstance){

                                            //console.log($modalInstance);

                                            $scope.cancel = function () {
                                                    $modalInstance.dismiss('cancel');
                                            };
                                            $scope.ok = function () {
                                                    $modalInstance.close('发送消息：ok');
                                            };
                                    }]
                            });

                            //promise
                            modalInstance.result.then(function(ret){
                                    //点击确认之后，执行
                                    //console.log('ret2'+ret);

                            }, function(){
                                    //点击取消之后执行
                                    //console.log(new Date());

                            });
                    });
            }
    };


})*/













//禁止冒泡
.directive('returnFalse', function(){
    return {
        restrict: "A",
        link: function( $scope, element, attrs ) {
            element.bind( "click", function(e) {
               e.stopPropagation();
            });
        }
    };
})











//控制职位列表高度的工作
.directive('setJoblist', function(){
    return {
        restrict: "A",
        link: function( $scope, element, attrs ) {
            
            var win = angular.element(window),
                winH = win[0].innerHeight;
            element.css('height', (winH-215)+"px");
            win.on('resize',function(){
                var winH = win[0].innerHeight;
                element.css('height', (winH-215)+"px");
            });

        }
    };
})














//功能菜单具体功能
.directive('operationCommond', ['resumesTransfer', function(resumesTransfer){
    return {
        restrict: "A",
        link: function( $scope, element, attrs ) {
            element.bind( "click", function(e) {
//                if($scope.selected.length===0) return false;
//                console.log($scope.selected.length);
//            var arr = [];
//            for(var n in $scope.selected){
//                    arr.push(n);
//            }




            //console.log(arr);
            if(resumesTransfer.testUser()<1) {return false;}
                var txt = e.srcElement.innerText;
                switch (txt) {
                    case '查看' :
                        //console.log($scope.selectedUrl);
                        var url = '';
                        for(var p in $scope.selectedUrl){
                                url += $scope.selectedUrl[p] + ":";
                        }
                        //console.log(url);
                        $scope.seeDetail(url);
                        break;
//                    case '转发' :
//                        console.log('a');
//                        break;
                    case '导出' :
                        //console.log('b');
                        break;
                    case '推荐' :
                        //console.log('c');
                        break;
                    case '移动' :
                        //console.log('d');
                        break;
                    case '下载' :
                        //console.log('e');
                        break;
                    case '打印' :
                        //console.log('f');
                        break;
//                    case '屏蔽' :
//                        console.log('g');
//                        break;
                    case '删除' :
                        //console.log('h');
                        break;
                    default :
                        //console.log('other');
                } 

                //console.log(attrs)
                // $scope.listOpertion = !$scope.listOpertion;
                // if($scope.listOpertion){
                //     element.addClass('active');
                // }else{
                //     element.removeClass('active');
                // }
                // $scope.$apply();
                // console.log(txt);
            });
        }
    };
}])




















//显示可选择的全国地区
.directive('qdShowCity', function(){
    $('html').on('click.qdShowCity.data-api', function(){
        //console.log('clear');
    });
    return {
        scope: {},
        restrict: "AE",
        replace: 'true',  
        template: "<ul class=\"showcity\"><li ng-repeat=\"(k,v) in citys\"><span class=\"sss\">{{k}}</span><ul class=\"shi clearfix\"><li ng-repeat=\"(k1, v1) in v\"><span class=\"ss\">{{k1}}</span><ul class=\"qu clearfix\"><li ng-repeat=\"v2 in v1\"><span class=\"s\">{{v2}}</span></li></ul></li></ul></li></ul>",
        link: function( $scope, element, attrs ) {
            $scope.citys = {

                    "北京市": {
                        "北京市": ["东城区", "西城区", "崇文区", "宣武区", "朝阳区", "丰台区", "石景山区", "海淀区", "门头沟区", "房山区", "通州区", "顺义区", "昌平区", "大兴区", "怀柔区", "平谷区", "密云县", "延庆县"]
                    }, 
                    "上海市": {
                        "上海市": ["黄浦区", "卢湾区", "徐汇区", "长宁区", "静安区", "普陀区", "闸北区", "虹口区", "杨浦区", "闵行区", "宝山区", "嘉定区", "浦东新区", "金山区", "松江区", "青浦区", "南汇区", "奉贤区", "崇明县"]
                    }
                };
            element.bind( "click", function(e) {
                var $this = $(e.srcElement);


                //$this.parents('ul').find('open2').removeClass('open2');
                //$this.parents('ul').find('open3').removeClass('open3');
//                console.log($this.parents('.showcity').find('.open2').html());

                if($this.hasClass('sss')){
                        $this.parents('.showcity').find('.open2').removeClass('open2');
                        $this.parents('.showcity').find('.open3').removeClass('open3');
                        $this.parents('.showcity').find('.selected').removeClass('selected');


                        if($this.hasClass('selected')){
                                $this.removeClass('selected');
                                $this.parent('li').removeClass('open2');
                        }else{
                                $this.addClass('selected');
                                $this.parent('li').addClass('open2');
                        }
                }
               if($this.hasClass('ss')){

                    if($this.hasClass('selected')){
                               $this.removeClass('selected');
                               $this.parent('li').removeClass('open3');
                    }else{
                               $this.addClass('selected');
                               $this.parent('li').addClass('open3');
                    }
               }
               if($this.hasClass('s')){
                    if($this.hasClass('selected')){
                            $this.removeClass('selected');
                    }else{
                            $this.addClass('selected');
                    }

               }
            });
        }
    };
})


//简历详情图表
.directive('resumeChart', function(){
    return {
            restrict: "A",
            link: function( $scope, element, attrs ) {

                    //var win = angular.element(window);               // windows对象
                    var winW = 900;                                  // 图表总宽
                    var groupUL = element.find('ul');                // ul
                    var mWidth = 20;                                 // 月宽度
                    var yWidth = 30;                                 // 年宽度
                    var ctWidth = 10;                                // 冲突宽度
                    $scope.ulWidth = 0;
                    $scope.workshow = {};


                    $scope.showworkdiv = function(index){
                                    $scope.workshow[index] = true;

                    };

                    $scope.hideworkdiv = function(index){
                                    $scope.workshow[index] = false;
                    };

                    $scope.sumWidth = function(m, sp, index){

                            var liWidth = 0;
                            if(!m){
                                    m = 10;
                            }

                            if(m  < 12){
                                    if(sp){
                                            liWidth = ctWidth*m;

                                    }else{
                                            liWidth = mWidth*m;
                                    }
                            }else{
                                    if(sp){
                                            liWidth = ctWidth*m;
                                    }else{
                                            liWidth = yWidth*m;
                                    }
                            }
                            //liWidth += 4;
                            if(liWidth > 220){
                                    liWidth = 220;
                            }else if(liWidth < 40){
                                    liWidth = 40;
                            }
                            $scope.ulWidth += (liWidth + 3);

                            groupUL.css('width', $scope.ulWidth+'px');
                            groupUL.css('margin-left', '0');
                            groupUL.find('li').eq(index).css('width', liWidth+"px");
                            groupUL.find('li').eq(index).find('div').eq(0).css('width', liWidth+"px");

                    };

                    //ng-mouseenter="showworkdiv($index)" ng-mouseleave="hideworkdiv($index)"
                    // todo 这里的算法不太准确 需要改进
                    element.bind('mouseenter', function($e){
                            var _this = this;
                            //console.log($e);
                            if($e.layerX < (winW/2)){
                                    $(_this).find('.moreinfo').css({'left':'auto', 'right':0});
                            }else{
                                    $(_this).find('.moreinfo').css({'left':0, 'right':'auto'});
                            }
                            //$scope.workshow[index] = true;
                    });

//                    element.bind('mouseleave', function($e){
//                            console.log($e);
//                            //$scope.workshow[index] = true;
//                    });

                    // groupUL.css({'width': (contentW)+'px'});

                    // if((contentW - winW) <= 0){
                    //        $('.goright').addClass('disabled');
                    // }

                    $('.goleftR').on('click', function(){
                            var _this = $(this);
                            var ulleft = parseInt($(groupUL).css('margin-left').replace('px',''));

                            if((-ulleft) > winW){
                                    $(groupUL).animate({'margin-left': ulleft+winW}, 300);
                                    $('.gorightR').removeClass('disabled');
                            }else if((-ulleft) > 0){
                                    $(groupUL).animate({'margin-left':0},300);
                                    _this.addClass('disabled');
                                    $('.gorightR').removeClass('disabled');
                            }
                    });
                    $('.gorightR').on('click', function(){
                            var ulleft = parseInt($(groupUL).css('margin-left').replace('px',''));
                            var _this = $(this);

                            var rightCha = $scope.ulWidth - winW + ulleft ;  //右侧剩余宽度

                            if(rightCha > winW){
                                    $(groupUL).animate({'margin-left':ulleft-winW},300);
                                    $('.goleftR').removeClass('disabled');
                            }else if(rightCha > 0){
                                    $(groupUL).animate({'margin-left':-rightCha},300);
                                    _this.addClass('disabled');
                                    $('.goleftR').removeClass('disabled');
                            }else{
                                    _this.addClass('disabled');
                            }
                    });
            }
    };
})







//控制职位列表高度的工作
.directive('horizontalScroll', function(){
        return {
                restrict: "A",
                link: function( $scope, element, attrs ) {

                        var win = angular.element(window);               //windows对象
                        var winW = document.documentElement.clientWidth; //页面宽度
                        var group = element.find('div');                //底部盒子
                        var groupUL = element.find('ul');               //ul
                        var liWidth = 296;
                        var contentW = $scope.uinfos.length * liWidth;
                        var timeoutHandle;

                        group.css({'width': (winW-100)+'px'});
                        groupUL.css({'width': (contentW)+'px'});

                        if((contentW - winW) <= 0){
                                $('.goright').addClass('disabled');
                        }

                        $('.goleft').on('click', function(){
                                var _this = $(this);
                                var ulleft = parseInt($(groupUL).css('left').replace('px',''));
                                if((-ulleft) > liWidth){
                                        $(groupUL).animate({'left':ulleft+liWidth},300);
                                        $('.goright').removeClass('disabled');
                                }else if((-ulleft) > 0){
                                        $(groupUL).animate({'left':0},300);
                                        _this.addClass('disabled');
                                        $('.goright').removeClass('disabled');
                                }
                        });
                        $('.goright').on('click', function(){
                                var ulleft = parseInt($(groupUL).css('left').replace('px',''));
                                var _this = $(this);
                                var rightCha = contentW - winW + ulleft ;  //右侧剩余宽度
                                if(rightCha > liWidth){
                                        //console.log(1);
                                        $(groupUL).animate({'left':ulleft-liWidth},300);
                                        $('.goleft').removeClass('disabled');
                                }else if(rightCha > 0){
                                        console.log(rightCha);
                                        $(groupUL).animate({'left':ulleft-rightCha-65},300);
                                        _this.addClass('disabled');
                                        $('.goleft').removeClass('disabled');
                                }else{
                                        _this.addClass('disabled');
                                }
                        });
                        win.on('resize',function(){
                                winW = document.documentElement.clientWidth;
                                if(timeoutHandle){
                                        clearTimeout(timeoutHandle);
                                }
                                timeoutHandle = setTimeout(function(){
                                        group.css({'width': (winW-100)+'px'});
                                        if((contentW - winW) <= 0){
                                                $('.goright').addClass('disabled');
                                        }else{
                                                $('.goright').removeClass('disabled');
                                        }

                                },150);
                        });

                }
        };
});