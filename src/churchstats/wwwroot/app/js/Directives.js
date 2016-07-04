(function (app) {
    var directive = function ($timeout) {
        return {
            restrict: 'A',
            require: '^form',
            link: function (scope, el, attrs, formCtrl) {
                var inputEl = el[0].querySelector("[name]");
                var inputNgEl = angular.element(inputEl);
                var inputName = inputNgEl.attr('name');
                scope.$on('show-errors-event', function () {
                    el.toggleClass('has-error', formCtrl[inputName].$invalid);
                });
                scope.$on('hide-errors-event', function () {
                    $timeout(function () {
                        el.removeClass('has-error');
                    }, 0, false);
                });
            }
        };
    };
    directive.$inject = ['$timeout'];
    app.directive('showErrors', directive);
})(angular.module("repoFormsApp"));
(function (app) {
    var directive = function ($parse, $timeout) {
        return {
            restrict: 'A',
            link: function ($scope, $elm, $attrs) {
                var timer;
                $elm.bind('touchstart', onEnter);
                $elm.bind('touchend', onExit);
                $elm.bind('touchmove', onMove);
                $elm.bind('mousedown', onEnter);
                $elm.bind('mouseup', onExit);
                $elm.bind('click', onClick);
                function onEnter(evt) {
                    var functionHandler = $parse($attrs.onLongPress);
                    $timeout.cancel(timer);
                    $scope.longPressSent = false;
                    timer = $timeout(function () {
                        $scope.longPressSent = true;
                        $scope.$apply(function () {
                            functionHandler($scope, {
                                $event: evt
                            });
                        });
                    }, 600);
                }
                function onExit(evt) {
                    var functionHandler = $parse($attrs.onTouchEnd);
                    $timeout.cancel(timer);
                    if ($attrs.onTouchEnd && $scope.longPressSent) {
                        $scope.$apply(function () {
                            functionHandler($scope, {
                                $event: evt
                            });
                        });
                    }
                }
                function onMove(evt) {
                    $timeout.cancel(timer);
                }
                function onClick(evt) {
                    if ($scope.longPressSent && (!$attrs.preventClick || $attrs.preventClick === "true")) {
                        evt.preventDefault();
                        evt.stopPropagation();
                        evt.stopImmediatePropagation();
                    }
                }
            }
        };
    };
    directive.$inject = ['$parse', '$timeout'];
    app.directive('onLongPress', directive);
})(angular.module("repoFormsApp"));
//# sourceMappingURL=Directives.js.map