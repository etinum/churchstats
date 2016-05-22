/// <reference path="../typings/angular.d.ts" />
/// <reference path="../typings/angular-resource.d.ts" />


var app = angular.module('formsApp', ['ngRoute', 'ngMessages', 'ui.bootstrap']);

app.config(["$routeProvider", "$locationProvider",
    ($routeProvider, $locationProvider) => {
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
        //$locationProvider.html5Mode(true);;
    }]);

