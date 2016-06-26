(function (app) {
    var controller = function ($scope, $window, $dataService, $envService, $rootScope) {
        $scope.baseWebApiUrl = $envService.read('apiUrl');
    };
    controller.$inject = ['$scope', '$window', 'dataService', 'envService', '$rootScope'];
    app.controller('masterCtrl', controller);
})(angular.module("repoFormsApp"));
(function (app) {
    var controller = function ($scope, $location, $dataService, $window) {
        $scope.rf = {};
        $scope.haveRecorder = false;
        $scope.recorderFieldDisable = false;
        $scope.meetingFieldDisable = false;
        $scope.isNewUser = false;
        $scope.isNewMeeting = false;
        $scope.haveMeeting = false;
        $scope.selectedUserId = 0;
        var recorderFieldTimeout;
        $('#recorderName')
            .keypress(function () {
            if (recorderFieldTimeout) {
                clearTimeout(recorderFieldTimeout);
                recorderFieldTimeout = null;
            }
            recorderFieldTimeout = setTimeout($scope.onBlurRecorder, 1500);
        });
        var meetingFieldTimeout;
        $('#meetingName')
            .keypress(function () {
            if (meetingFieldTimeout) {
                clearTimeout(meetingFieldTimeout);
                meetingFieldTimeout = null;
            }
            meetingFieldTimeout = setTimeout($scope.onBlurMeeting, 1500);
        });
        $scope.onBlurRecorder = function () {
            if (!$scope.recorderName) {
                return;
            }
            var index = $dataService.arrayObjectIndexOf($scope.userList, $scope.recorderName, "fullName", false);
            $scope.$evalAsync(function () {
                if (index === -1) {
                    $scope.haveRecorder = false;
                    $scope.isNewUser = true;
                }
                else {
                    $scope.recorderName = $scope.userList[index].fullName;
                    $scope.haveRecorder = true;
                    $scope.isNewUser = false;
                    $scope.selectedUserId = $scope.userList[index].id;
                }
            });
        };
        $scope.onBlurMeeting = function () {
            if (!$scope.meetingName) {
                return;
            }
            var index = $dataService.arrayObjectIndexOf($scope.meetingNameOptions, $scope.meetingName, "name", false);
            $scope.$evalAsync(function () {
                if (index === -1) {
                    $scope.isNewMeeting = true;
                    $scope.haveMeeting = false;
                }
                else {
                    $scope.meetingName = $scope.meetingNameOptions[index].name;
                    $scope.recorderFieldDisable = true;
                    $scope.meetingFieldDisable = true;
                    $scope.haveMeeting = true;
                    $scope.isNewMeeting = false;
                }
            });
        };
        var getCounts = function (data) {
            $scope.totalPossible = data.length;
        };
        $scope.createNewUser = function () {
            var user = {};
            user.firstName = $scope.recorderName.split(' ')[0];
            user.lastName = $scope.recorderName.split(' ')[1];
            user.fullName = $scope.recorderName;
            $dataService.saveUser(user)
                .then(function (data) {
                user.id = data;
                $scope.userList.push(user);
                $scope.onBlurRecorder();
            });
        };
        $scope.meetingTypeChanged = function () {
            alert('hi: ' + $scope.meetingTypeOptions.filter(function (item) { return item.id === parseInt($scope.meetingTypeId); })[0].label);
        };
        $scope.memberSelected = function (item) {
            alert('Update database for: ' + item.fullName + ", present: " + item.isAttend);
        };
        var hub = $.connection.attendHub;
        hub.client.ClientCall = function () {
            alert('hello value, world');
        };
        $.connection.hub.start()
            .done(function () {
            $dataService.getAllUsers().then(function (data) {
                $scope.userList = data;
                getCounts(data);
            });
            ;
            $dataService.getAllMeetings().then(function (data) {
                $scope.meetingNameOptions = data;
            });
            ;
            $dataService.getAllMeetingTypes().then(function (data) {
                $scope.meetingTypeOptions = data;
            });
            ;
        });
    };
    controller.$inject = ['$scope', '$location', 'dataService', '$window'];
    app.controller('homeCtrl', controller);
})(angular.module("repoFormsApp"));
//# sourceMappingURL=Ctrl.js.map