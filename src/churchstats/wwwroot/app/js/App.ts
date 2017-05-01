/// <reference path="../typings/angular.d.ts" />
/// <reference path="../typings/angular-resource.d.ts" />
/// <reference path="../typings/angular-environment.d.ts" />


angular.module('repoFormsApp', ['ngRoute', 'ngMessages', 'ui.bootstrap', 'environment', 'smart-table', 'cgBusy', 'ngStorage']);



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
                development: ['localhost:911', 'dev.local'],
                iisexpress: ['localhost:12345'],
                mac: ['erictdev'],
                box: ['attendance.etpics.com'],
                dev: ['devstats.etpics.com'],
                production: ['cstats.etpics.com', 'plsf.portfoliorecovery.com']
                // anotherStage: ['domain1', 'domain2'],
                // anotherStage: ['domain1', 'domain2']
            },
            vars: {
                development: {
                    apiUrl: '//localhost:911/webapi/',
                    staticUrl: '//localhost:911/'
                    // antoherCustomVar: 'lorem',
                    // antoherCustomVar: 'ipsum'
                },
                iisexpress: {
                    apiUrl: '//localhost:12345/webapi/',
                    staticUrl: '//localhost:12345/'
                    // antoherCustomVar: 'lorem',
                    // antoherCustomVar: 'ipsum'
                },
                dev: {
                    apiUrl: '//devstats.etpics.com/webapi/',
                    staticUrl: '//devstats.etpics.com/'
                },
                mac: {
                    apiUrl: '//erictdev/webapi/',
                    staticUrl: '//erictdev.local/'
                    // antoherCustomVar: 'lorem',
                    // antoherCustomVar: 'ipsum'
                },
                box: {
                    apiUrl: '//attendance.etpics.com/webapi/',
                    staticUrl: '//attendance.etpics.com/'
                },
                production: {
                    apiUrl: '//cstats.etpics.com/webapi/',
                    staticUrl: '//cstats.etpics.com/'
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

