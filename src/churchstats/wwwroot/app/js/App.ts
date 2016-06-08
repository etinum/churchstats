/// <reference path="../typings/angular.d.ts" />
/// <reference path="../typings/angular-resource.d.ts" />
/// <reference path="../typings/angular-environment.d.ts" />


var myApp = angular.module('repoFormsApp', ['ngRoute', 'ngMessages', 'ui.bootstrap', 'environment', 'smart-table']);



(app => {
    var config = ($routeProvider, $envServiceProvider) => {
        $routeProvider
            .when("/home", {
                templateUrl: "app/html/Home.html",
                controller: "homeCtrl"
            })
            .when("/repoform", {
                templateUrl: "app/html/RepoForm.html",
                controller: "repoCtrl"
            })
            .when("/repoform/:id", {
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

        $envServiceProvider.config({
            domains: {
                development: ['localhost', 'dev.local'],
                iisexpress: ['localhost:12345'],
                production: ['plsf', 'plsf.portfoliorecovery.com']
                // anotherStage: ['domain1', 'domain2'],
                // anotherStage: ['domain1', 'domain2']
            },
            vars: {
                development: {
                    apiUrl: '//localhost/webapi/',
                    staticUrl: '//localhost/'
                    // antoherCustomVar: 'lorem',
                    // antoherCustomVar: 'ipsum'
                },
                iisexpress: {
                    apiUrl: '//localhost:12345/webapi/',
                    staticUrl: '//localhost:12345/'
                    // antoherCustomVar: 'lorem',
                    // antoherCustomVar: 'ipsum'
                },
                production: {
                    apiUrl: '//plsf/webapi/',
                    staticUrl: '//plsf/'
                    // antoherCustomVar: 'lorem',
                    // antoherCustomVar: 'ipsum'
                }
                // anotherStage: {
                //  customVar: 'lorem',
                //  customVar: 'ipsum'
                // } --
            }
        });

        $envServiceProvider.check();


    };

    config.$inject = ['$routeProvider', 'envServiceProvider'];
    app.config(config);
})(angular.module("repoFormsApp"));

