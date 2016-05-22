var app = angular.module('formsApp', ['ngRoute', 'ngMessages', 'ui.bootstrap']);
app.config(["$routeProvider", "$locationProvider",
    function ($routeProvider, $locationProvider) {
        $routeProvider
            .when("/home", {
            templateUrl: "app/html/Home.html",
            controller: "homeCtrl"
        })
            .when("/attendance", {
            templateUrl: "app/html/Attendance.html",
            controller: "attendanceCtrl"
        })
            .when("/viewReports", {
            templateUrl: "app/html/ViewReports.html",
            controller: "viewCtrl"
        })
            .otherwise({
            redirectTo: "/home"
        });
    }]);
//# sourceMappingURL=App.js.map