app.directive('showErrors', ['$timeout', function ($timeout) {
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
    }]);
//# sourceMappingURL=Directives.js.map