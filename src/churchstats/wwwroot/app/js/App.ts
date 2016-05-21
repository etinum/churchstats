/// <reference path="../typings/angular.d.ts" />
/// <reference path="../typings/angular-resource.d.ts" />


var app = angular.module('repoFormsApp', ['ngRoute', 'ngMessages', 'ui.bootstrap', 'signature']);

app.config(["$routeProvider", "$locationProvider",
    ($routeProvider, $locationProvider) => {
        $routeProvider
            .when("/home", {
                templateUrl: "app/html/Home.html",
                controller: "homeCtrl"
            })
            .when("/repoform", {
                templateUrl: "app/html/RepoForm.html",
                controller: "repoCtrl"
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

