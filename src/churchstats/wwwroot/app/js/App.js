angular.module('repoFormsApp', ['ngRoute', 'ngMessages', 'ui.bootstrap', 'environment', 'smart-table', 'cgBusy']);
(function (app) {
    var config = function ($routeProvider, $envServiceProvider) {
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
                production: ['cstats.etpics.com', 'plsf.portfoliorecovery.com']
            },
            vars: {
                development: {
                    apiUrl: '//localhost:911/webapi/',
                    staticUrl: '//localhost:911/'
                },
                iisexpress: {
                    apiUrl: '//localhost:12345/webapi/',
                    staticUrl: '//localhost:12345/'
                },
                production: {
                    apiUrl: '//cstats.etpics.com/webapi/',
                    staticUrl: '//cstats.etpics.com/'
                }
            }
        });
        $envServiceProvider.check();
    };
    config.$inject = ['$routeProvider', 'envServiceProvider'];
    app.config(config);
})(angular.module("repoFormsApp"));
//# sourceMappingURL=App.js.map