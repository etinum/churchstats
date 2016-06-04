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
