(app => {
    var directive = ($timeout) => {
        return {
            restrict: 'A',
            require: '^form',
            link: (scope, el, attrs, formCtrl) => {

                // find the text box element, which has the 'name' attribute --
                var inputEl = el[0].querySelector("[name]");

                // convert the native text box element to an angular element
                var inputNgEl = angular.element(inputEl);

                // get the name on the text box so we know the property to check
                // on the form controller
                var inputName = inputNgEl.attr('name');

                scope.$on('show-errors-event', () => {
                    el.toggleClass('has-error', formCtrl[inputName].$invalid);
                });

                scope.$on('hide-errors-event', () => {
                    $timeout(() => {
                        el.removeClass('has-error');
                    }, 0, false);
                });
            }
        }
    };
    directive.$inject = ['$timeout'];
    app.directive('showErrors', directive);
})(angular.module("repoFormsApp"));



(app => {
    var directive = ($parse, $timeout) => {
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
                    //To handle click event properly
                    $scope.longPressSent = false;
                    // We'll set a timeout for 600 ms for a long press
                    timer = $timeout(function () {
                        $scope.longPressSent = true;
                        // If the touchend event hasn't fired,
                        // apply the function given in on the element's on-long-press attribute
                        $scope.$apply(function () {
                            functionHandler($scope, {
                                $event: evt
                            });
                        });
                    }, 600);

                }

                function onExit(evt) {
                    var functionHandler = $parse($attrs.onTouchEnd);
                    // Prevent the onLongPress event from firing
                    $timeout.cancel(timer);
                    // If there is an on-touch-end function attached to this element, apply it
                    if ($attrs.onTouchEnd && $scope.longPressSent) {
                        $scope.$apply(function () {
                            functionHandler($scope, {
                                $event: evt
                            });
                        });
                    }
                }

                function onMove(evt) {
                    // Prevent the onLongPress event from firing
                    $timeout.cancel(timer);
                }


                function onClick(evt) {
                    //If long press is handled then prevent click
                    if ($scope.longPressSent && (!$attrs.preventClick || $attrs.preventClick === "true")) {
                        evt.preventDefault();
                        evt.stopPropagation();
                        evt.stopImmediatePropagation();
                    }

                }
            }
        };
    }


    directive.$inject = ['$parse', '$timeout'];
    app.directive('onLongPress', directive);
})(angular.module("repoFormsApp"));


