var app = angular.module('shuDesign', ['ngRoute', 'ngAnimate', 'ngSanitize']); // "ngAnimate",

app.config(['$compileProvider', "$routeProvider", "$interpolateProvider",

    function($compileProvider, $routeProvider, $interpolateProvider) {
        $interpolateProvider.startSymbol('{[{');
        $interpolateProvider.endSymbol('}]}');
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|viber|tel|mailto|chrome-extension):/);
        $routeProvider
            .when('/main', {
                templateUrl: 'main.html'
            })
            .when('/project', {
                templateUrl: 'project.html'
            })

            .otherwise({
                redirectTo: '/main'
            });
    }
]);

app.controller('shuDesignCtrl', function($scope, $http, $route, $routeParams, $location, $timeout) {


    $scope.$on('$viewContentLoaded', function(event) {
        $scope.whatView();
        $timeout(function() {
            if ($route.current.templateUrl == 'project.html') {
                $location.search({ id: $scope.selectedProject.id });

            }
        }, 200);
    });


    var urlQuery = $location.search();

    $http.get("assets/data/data.json").then(function(response) {
        $scope.data = response.data;
        if (urlQuery.cat) {
            $scope.selectedCat = urlQuery.cat;
        } else {
            $scope.selectedCat = $scope.data.cats[0].id;

        }
        $scope.data.cats.forEach(function(obj) {
            obj.name = obj.ua;
        });

    });
    $http.get("assets/data/projects.json").then(function(response) {
        $scope.projects = response.data;
        $scope.sortKey = 'year';
        $scope.reverse = true;

        $scope.projects.forEach(function(obj) {
            obj.txtPreview = obj.txtPreviewUA;
        });
        $scope.data.cats.forEach(function(obj) {
            obj.name = obj.ua;
        });

        if (urlQuery.id) {
            for (var i = $scope.projects.length - 1; i >= 0; i--) {
                var proj = $scope.projects[i];

                if (proj.id == urlQuery.id) {
                    $scope.selectedProject = proj;
                    break;
                }

            }
        } else {
            $scope.selectedProject = $scope.projects[0];
        }

    });

    $scope.setLang = "en";

    $scope.whatView = function() {
        if ($route.current.templateUrl !== 'main.html') {
            $scope.mainView = false;
        } else {
            $scope.mainView = true;
        }

    };
    $scope.changeLang = function() {
        if ($scope.setLang == "en") {
            $scope.projects.forEach(function(obj) {
                obj.txtPreview = obj.txtPreviewEN;
            });
            $scope.data.cats.forEach(function(obj) {
                obj.name = obj.en;
            });
            $scope.setLang = "ua";

        } else {
            $scope.projects.forEach(function(obj) {
                obj.txtPreview = obj.txtPreviewUA;
            });
            $scope.data.cats.forEach(function(obj) {
                obj.name = obj.ua;
            });
            $scope.setLang = "en";
        }
    };

    $scope.selectProject = function(proj) {
        $scope.selectedProject = proj;
        $location.search({ id: proj.id });


    };

    $scope.selectCat = function(cat) {
        $scope.selectedCat = cat;
        if ($route.current.templateUrl !== 'main.html') {
            $location.url('/main');
        }
        $location.search({ cat: cat });

    };



    $scope.sort = function(keyname) {
        $scope.sortKey = keyname; //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    };

    $scope.nextProject = function() {
        arr = $scope.projects;
        index = arr.indexOf($scope.selectedProject);
        if (index < arr.length - 1) {
            $scope.selectedProject = arr[index + 1];
        } else {
            $scope.selectedProject = arr[0];
        };

        $location.search({ id: $scope.selectedProject.id });

    };

    $scope.prevProject = function() {
        arr = $scope.projects;
        index = arr.indexOf($scope.selectedProject);
        if (index !== 0) {
            $scope.selectedProject = arr[index - 1];

        } else {
            $scope.selectedProject = arr[arr.length - 1];
        };
        $location.search({ id: $scope.selectedProject.id });

    };

    $scope.key = function($event) {
        // nреба додати ng-keyup="key($event)" в html
        if ($event.keyCode == 37) { // left arrow
            $scope.prevProject();
            console.log("йо");


        } else if ($event.keyCode == 39) { // right arrow
            $scope.nextProject();
        }
    };

});