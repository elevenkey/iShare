

var app = angular.module('miniMe', [
    'ngRoute', 'ngAnimate'
]);

/**
 * Configure the Routes
 */
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        // Home
        .when("/", { templateUrl: "app/partials/home.html", controller: "PageCtrl" })
        // Pages
        .when("/share", { templateUrl: "app/partials/share.html", controller: "PageCtrl" })
        .when("/wish", { templateUrl: "app/partials/wish.html", controller: "PageCtrl" })
        .when("/donation", { templateUrl: "app/partials/donation.html", controller: "PageCtrl" })
        .when("/contact", { templateUrl: "app/partials/contact.html", controller: "PageCtrl" })
        .when("/login", { templateUrl: "app/partials/login.html", controller: "PageCtrlLogin" })
        .when("/reg", { templateUrl: "app/partials/reg.html", controller: "PageCtrlReg" })

        // else 404
        .otherwise("/error", { templateUrl: "app/partials/404.html", controller: "PageCtrl" });
} ]);


app.controller('PageCtrl', function ( $scope/*, $location, $http */) {
    $scope.pageClass = 'page-effect';

});

app.controller("dataImagesWork", function ($scope) {
    $scope.images_work = [
        { num: 1, category: 'marketing', src: "1.jpg", description: 'Oscar is a decent man. He used to clean porches with pleasure. ', url_details: "details.html" },
        { num: 2, category: 'branding', src: "1.jpg", description: 'Oscar is a decent man. He used to clean porches with pleasure. ', url_details: "details.html" },
        { num: 3, category: 'design', src: "1.jpg", description: 'Oscar is a decent man. He used to clean porches with pleasure. ', url_details: "details.html" },
        { num: 4, category: 'photo', src: "1.jpg", description: 'Oscar is a decent man. He used to clean porches with pleasure. ', url_details: "details.html" },
        { num: 5, category: 'marketing', src: "1.jpg", description: 'Oscar is a decent man. He used to clean porches with pleasure. ', url_details: "details.html" },
        { num: 6, category: 'design', src: "1.jpg", description: 'Oscar is a decent man. He used to clean porches with pleasure. ', url_details: "details.html" },
        { num: 7, category: 'photo', src: "1.jpg", description: 'Oscar is a decent man. He used to clean porches with pleasure. ', url_details: "details.html" },
        { num: 8, category: 'marketing', src: "1.jpg", description: 'Oscar is a decent man. He used to clean porches with pleasure. ', url_details: "details.html" },
        { num: 9, category: 'design', src: "1.jpg", description: 'Oscar is a decent man. He used to clean porches with pleasure. ', url_details: "details.html"}];
});


//'use strict';
app.directive('autoActive', ['$location', function ($location) {
    return {
        restrict: 'A',
        scope: false,
        link: function (scope, element) {
            function setActive() {
                var path = $location.path();
                if (path) {
                    angular.forEach(element.find('li'), function (li) {
                        var anchor = li.querySelector('a');
                        if (anchor.href.match('#' + path + '(?=\\?|$)')) {
                            angular.element(li).addClass('current');
                        } else {
                            angular.element(li).removeClass('current');
                        }
                    });
                }
            }

            setActive();
            scope.$on('$locationChangeSuccess', setActive);
        }
    }
} ]);