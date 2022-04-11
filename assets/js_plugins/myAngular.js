var app = angular.module('shuDesign', ['ngRoute', 'ngAnimate', 'ngSanitize', 'slickCarousel']); // "ngAnimate",

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
        $scope.mainView = ($route.current.templateUrl !== 'main.html') ? false : true;

        $timeout(function() {
            if ($route.current.templateUrl == 'project.html') {
                $location.search({ id: $scope.selectedProject.id });

            }
        }, 200);
    });

    $scope.mainSlickConfig = {
        arrows: false,
        autoplay: true,
        pauseOnHover: false,
        autoplaySpeed: 2400,
        speed: 1200,
        fade: true,
    };

    var urlQuery = $location.search();

    $http.get("assets/data/data.json").then(function(response) {
        $scope.data = response.data;
        $scope.selectedCat = urlQuery.cat ? urlQuery.cat : $scope.data.cats[0].id;

    });
    $http.get("assets/data/projects.json").then(function(response) {
        $scope.projects = response.data;
        $scope.heroCat = 'cmplx';
        $scope.sortKey = 'year';
        $scope.reverse = true;
        //language select
        if (navigator.language == "uk" || navigator.language == "ua") {
            $scope.setLang = "en";
            $scope.changeLang();
            
        }
        //END language select

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


    $scope.changeLang = function() {
        if ($scope.setLang == "en") {
            $scope.projects.forEach(function(obj) {
                obj.title = obj.titleEN;
                obj.heroTitle = obj.heroTitleEN;

            });
            $scope.data.cats.forEach(function(obj) {
                obj.name = obj.en;
            });
            $scope.setLang = "ua";

        } else {
            $scope.projects.forEach(function(obj) {
                obj.title = obj.titleUA;
                obj.heroTitle = obj.heroTitleUA;

            });
            $scope.data.cats.forEach(function(obj) {
                obj.name = obj.ua;
            });
            $scope.setLang = "en";
        }
    }

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
        var arr = $scope.projects;
        var i = arr.indexOf($scope.selectedProject);
        $scope.selectedProject = (i < arr.length - 1) ? arr[i + 1] : arr[0];
        /*
                if (index < arr.length - 1) {
                    $scope.selectedProject = arr[index + 1];
                } else {
                    $scope.selectedProject = arr[0];
                };
        */
        $location.search({ id: $scope.selectedProject.id });

    };

    $scope.prevProject = function() {
        var arr = $scope.projects;
        var i = arr.indexOf($scope.selectedProject);
        $scope.selectedProject = (i !== 0) ? arr[i - 1] : arr[arr.length - 1];
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