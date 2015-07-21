module.exports = function(grunt) {

    grunt.initConfig({
        distdir: 'dist',
        pkg: grunt.file.readJSON('package.json'),
        banner:
        '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n'+
        '*/\n',
        src: {
            js: ['src/**/*.js'],
            jsTpl: ['<%= distdir %>/templates/**/*.js'],
            //specs: ['test/**/*.spec.js'],
            //scenarios: ['test/**/*.scenario.js'],
            html: ['src/index.html'],
            tpl: {
                    app: ['src/app/**/*.html'],
                    common: ['src/common/**/*.html']
            },
            less: ['src/less/*.less'], // recess:build doesn't accept ** in its file patterns
            lessWatch: ['src/less/**/*.less']
        },
        jshint:{
            files:['Gruntfile.js', '<%= src.js %>'],
            options:{
                    curly:true,
                    eqeqeq:true,
                    immed:true,
                    latedef:true,
                    newcap:true,
                    noarg:true,
                    sub:true,
                    boss:true,
                    eqnull:true,
                    globals:{}
            }
        },
        clean: ['<%= distdir %>/*'],
        html2js: {
            app: {
                    options: {
                            base: 'src/'
                    },
                    src: ['<%= src.tpl.app %>'],
                    dest: '<%= distdir %>/templates/app.js',
                    module: 'templates.app' //指定模块名称
            },
            common: {
                    options: {
                            base: 'src/'
                    },
                    src: ['<%= src.tpl.common %>'],
                    dest: '<%= distdir %>/templates/common.js',
                    module: 'templates.common' //指定模块名称
            }
        },
        concat:{
            dist:{
                    options: {
                            banner: "<%= banner %>"
                    },
                    src:['<%= src.js %>', '<%= src.jsTpl %>'],
                    dest:'<%= distdir %>/<%= pkg.name %>.js'
            },
            index: {
                    src: ['src/index.html'],
                    dest: '<%= distdir %>/index.html',
                    options: {
                            process: true
                    }
            },
            angular: {
                    src:['vendor/angular/angular.js', 'vendor/angular/angular-animate.js'],
                    dest: '<%= distdir %>/angular.js'
            },
            jquery: {
                    src:['vendor/jquery/*.js'],
                    dest: '<%= distdir %>/jquery.js'
            },
                angularui: {
                        src:['vendor/angular-ui/*.js'],
                        dest: '<%= distdir %>/angular-ui.js'
                },
                uibootstrap: {
                        src:['vendor/ui-bootstrap/*.js'],
                        dest: '<%= distdir %>/ui-bootstrap.js'
                }
        },
        uglify: {
            dist:{
                    options: {
                            banner: "<%= banner %>"
                    },
                    src:['<%= src.js %>' ,'<%= src.jsTpl %>'],
                    dest:'<%= distdir %>/<%= pkg.name %>.js'
            },
            angular: {
                    src:['<%= concat.angular.src %>'],
                    dest: '<%= distdir %>/angular.js'
            },

                jquery: {
                        src:['vendor/jquery/*.js'],
                        dest: '<%= distdir %>/jquery.js'
                },
                angularui: {
                        src:['vendor/angular-ui/*.js'],
                        dest: '<%= distdir %>/angular-ui.js'
                },
                uibootstrap: {
                        src:['vendor/ui-bootstrap/*.js'],
                        dest: '<%= distdir %>/ui-bootstrap.js'
                }
        },
        recess: {
            build: {
                    files: {
                            '<%= distdir %>/<%= pkg.name %>.css': ['<%= src.less %>'] },
                    options: {
                            compile: true
                    }
            },
            min: {
                    files: {
                            '<%= distdir %>/<%= pkg.name %>.css': ['<%= src.less %>']
                    },
                    options: {
                            compress: true
                    }
            }
        },
        copy: {
            assets: {
                    files: [
                            { dest: '<%= distdir %>', src : '**', expand: true, cwd: 'src/assets/' },
                            { dest: '<%= distdir %>/data/', src : '**', expand: true, cwd: 'src/data/' }
                    ]
            }
        },

        connect: {
            options: {
                port: 9500,
                hostname: '127.0.0.1', //默认就是这个值，可配置为本机某个 IP，localhost 或域名
                //livereload: 35729 //声明给 watch 监听的端口
                livereload: 35739 //声明给 watch 监听的端口
            },
            server: {
                options: {
                    open: true, //自动打开网页 http://
                    base: [
                        './dist' //主目录 设置为当前目录
                    ]
                }
            },
            serverDev: {
                options: {
                    open: true, //自动打开网页 http://
                    base: [
                        '.' //主目录 设置为当前目录
                    ]
                }
            }
        },
//        less: {
//            compile: {
//                files: [{
//                    'src/less/common.css': 'src/less/common.less',
//                    'src/less/base.css'  : 'src/less/base.less'
//                }]
//            },
//            cleancss: {
//                files: [
//                        {
//                            'src/less/common-min.css': 'src/less/common.css',
//                            'src/less/base-min.css'  : 'src/less/base.css'
//                        }
//                ],
//                options: {
//                    cleancss: true
//                }
//            }
//        },

        watch: {
//            scripts: {
//                files: [
//                        'dist/{,*/}*.{html,js,css}',
//                        'dist/img/{,*/}*.{png,jpg,gif}'
//                ],
////                tasks: ['jshint', 'clean', 'html2js', 'concat', 'recess:build', 'copy:assets']
//                tasks: ['clean']
//            },
            livereload: {
                files: [
                    //下面文件的改变就会实时刷新网页
                    'dist/{,*/}*.{html,js,css}',
                    'dist/{,*/}*.{png,jpg,gif}'
                ],
                options: {
                    livereload: true
                }
            },
            livereloadDev: {
                files: [
                    //下面文件的改变就会实时刷新网页
                    'src/**/*.{html,js,css,less}',
                    'src/**/*.{png,jpg,gif}',
                    'src/*.{html,js,css,less}'
                ],
                
                options: {
                    livereload: '<%=connect.options.livereload%>'  //监听前面声明的端口  35729
                }
            }
        }

        // uglify: {
        //     alias: {
        //         'kit/util': 'kit/util'
        //     },
        //     target: {
        //         expand: true,
        //         cwd: 'Public/Default/js/plugins/resumechart/',
        //         src: 'resumechart-act.js',
        //         dest: 'Public/Default/js/dest/'
        //     }
        // }

    });

    require('load-grunt-tasks')(grunt); //加载所有的任务

//    grunt.registerTask('serve', ['connect:server', 'watch']);
    grunt.registerTask('dev',           ['connect:serverDev', 'watch:livereloadDev']);
    grunt.registerTask('serve',         ['connect:server', 'watch:livereload']);
    grunt.registerTask('build',         ['jshint', 'clean', 'html2js', 'concat', 'recess:build', 'copy:assets']);
    grunt.registerTask('release',       ['jshint', 'clean', 'html2js', 'uglify', 'concat:index', 'recess:min', 'copy:assets']);
};