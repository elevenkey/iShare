var qiaodaFilter = angular.module('qiaodaFilter', [])


.filter('trusted', ['$sce', function ($sce) {
        return function (text) {
                return $sce.trustAsHtml(text);
        };
}]);