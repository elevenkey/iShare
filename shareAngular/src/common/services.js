
var voteServices = angular.module('voteServices', [])

    

    //编辑新建调查
    .factory('voteData',['$rootScope', '$http', '$state', 'systemApi', function ($rootScope, $http, $state, systemApi) {
            return {
                    apiBase : systemApi.apiBase,

                    curPage : 0,

                    initData: {
                     "title":"新建调查表",                   //调查表标题
                     "userId": $rootScope.user.userid,                           //用户id
                     "pages": [                             //调查表分页
                         {
                             "title": "第1页",         //页标题
                             "sorting": 1,
                             "subjects": [                     //调查题
                                 {       
                                     "type": 0,     //调查类型 0 单选 1 多选 2 下拉 3 打分
                                     "required": 1,     //是否必填
                                     "sorting": 0,
                                     "title": "",
                                     "id": "",
                                     "description": "",
                                     "items": [    //
                                         {
                                             "title": "",    //选项
                                             "score": 0          //是否必填
                                         },
                                         {
                                             "title": "",
                                             "score": 0
                                         },
                                         {
                                             "title": "",
                                             "score": 0
                                         }
                                     ]
                                 }
                             ]
                         },
                     ]
                    },

                    data: null,

                    getRemoteData: function(vID){
                        this.curPage = 0;
                        if(vID === null){
                                this.setData(this.initData);
                        }else{
                                var that = this;
                                return $http({
                                        method: 'GET',
                                        url: that.apiBase+'/exam/'+vID,
                                        // url: 'data/item2.json',
                                        cache: false
                                }).then(function(res){
                                        that.setData(res.data);
                                        console.log(res.data)
                                        return res.data;
                                });
                        }
                    },

                    setData: function (obj) {
                            this.data = obj;  
                    },

                    getData: function () {
                            // if(this.data === null){
                            //     this.setData(this.initData);
                            // }
                            return this.data;
                    },

                    getPageLength: function(){
                            return this.data.pages.length;
                    },

                    getCurPage: function(){
                            return this.curPage;
                    },

                    setCurPage: function(n){
                        this.curPage = n;
                        $rootScope.$broadcast( 'data.update' );
                    },

                    //添加问题
                    newQuestion: function(){

                        this.data.pages[this.curPage].subjects.push(

                                {       
                                     "type": 0,     //调查类型 0 单选 1 多选 2 下拉 3 打分
                                     "required": 1,     //是否必填
                                     "sorting": 0,
                                     "title": "",
                                     "id": "",
                                     "description": "",
                                     "items": [    //
                                         {
                                             "title": "",    //选项
                                             "score": 0          //是否必填
                                         },
                                         {
                                             "title": "",
                                             "score": 0
                                         },
                                         {
                                             "title": "",
                                             "score": 0
                                         }
                                     ]
                                 }

                         )
                    },

                    delQuestion: function(i){
                            this.data.pages[this.curPage].subjects.splice(i,1);
                    },


                    delPage: function(i){
                            console.log(i);
                            this.data.pages.splice(i,1);
                            //重置当前分页
                            if(i>0){
                                this.setCurPage(i-1);
                            }else{
                                this.setCurPage(i);
                            }
                    },

                    //添加分页
                    newPage: function(){

                            var vPageNum = this.getPageLength()+1;
                            this.setCurPage(vPageNum - 1);

                            this.data.pages.push(
                                     {
                                         "title": "第"+vPageNum+"页",         //页标题
                                         "sorting": 1,
                                         "subjects": [                     //调查题
                                             {       
                                                 "type": 0,     //调查类型 0 单选 1 多选 2 下拉 3 打分
                                                 "required": 1,     //是否必填
                                                 "sorting": 0,
                                                 "title": "",
                                                 "id": "",
                                                 "description": "",
                                                 "items": [    //
                                                     {
                                                         "title": "",    //选项
                                                         "score": 0          //是否必填
                                                     },
                                                     {
                                                         "title": "",
                                                         "score": 0
                                                     },
                                                     {
                                                         "title": "",
                                                         "score": 0
                                                     }
                                                 ]
                                             }
                                         ]
                                     }
                            )
                    },

                    saveall: function(eid){

                        if(eid == undefined){
                                var d = angular.toJson(this.data);
                                $http.post(
                                    this.apiBase + '/exam/create/', d,
                                    {
                                        responseType:'json'
                                    }
                                ).
                                success(function(data, status) {
                                       $state.go('my');
                                }).
                                error(function(data, status) {
                                      
                                });
                        }else{
                                var d = angular.toJson(this.data);
                                $http.put(
                                    this.apiBase + '/exam/'+ eid, d,
                                    {
                                        responseType:'json'
                                    }
                                ).
                                success(function(data, status) {
                                       $state.go('my');
                                }).
                                error(function(data, status) {
                                      
                                });
                        }
                    }

            };
    }])


    //调查列表
    .factory('getVList', ['$http', 'systemApi', function ($http, systemApi) {
            // var that = this;
            return {
                    getList: function (userid) {
                            return $http({
                                    method: 'GET',
                                    url: systemApi.apiBase+'/user/exam/'+userid,
                                    // url: 'data/list2.json',
                                    cache: false
                            }).then(function(res){
                                    return res.data;
                            })
                    },

                    delete: function(id){
                            //根据调查id删除调查
                            console.log('delete:'+id)
                    }

            };
    }])



    //调查列表
    .factory('systemApi', [function () {
            // var that = this;
            return {
                    apiBase: 'http://123.57.12.233/training',
                    defaultPage: 'my'

            };
    }]);




    
