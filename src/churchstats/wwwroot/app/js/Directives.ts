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
    var directive = ($timeout) => {
        return {
            restrict: 'A',
            link($scope, $elm, $attrs) {
                $elm.bind('touchstart', evt => {
                    // Locally scoped variable that will keep track of the long press
                    $scope.longPress = true;

                    // We'll set a timeout for 600 ms for a long press
                    $timeout(() => {
                        if ($scope.longPress) {
                            // If the touchend event hasn't fired,
                            // apply the function given in on the element's on-long-press attribute
                            $scope.$apply(() => {
                                $scope.$eval($attrs.onLongPress)
                            });
                        }
                    }, 600);
                });

                $elm.bind('touchend', evt => {
                    // Prevent the onLongPress event from firing
                    $scope.longPress = false;
                    // If there is an on-touch-end function attached to this element, apply it
                    if ($attrs.onTouchEnd) {
                        $scope.$apply(() => {
                            $scope.$eval($attrs.onTouchEnd)
                        });
                    }
                });
            }
        };
    }


    directive.$inject = ['$timeout'];
    app.directive('onLongPress', directive);
})(angular.module("repoFormsApp"));


