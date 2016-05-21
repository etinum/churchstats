var app = angular.module('repoFormsApp', ['ngRoute', 'ngMessages', 'ui.bootstrap', 'signature']);
app.config(["$routeProvider", "$locationProvider",
    function ($routeProvider, $locationProvider) {
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
    }]);
//# sourceMappingURL=App.js.map