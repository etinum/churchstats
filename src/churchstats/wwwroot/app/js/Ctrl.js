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
        $scope.haveRecorder = true;
        $scope.recorderFieldDisable = false;
        $scope.meetingFieldDisable = false;
        $scope.isNewUser = false;
        $scope.isNewMeeting = false;
        $scope.haveMeeting = true;
        $scope.selectedUserId = 0;
        $scope.selectedMeetingId = 0;
        $scope.globalSearchString = '';
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
            if (recorderFieldTimeout) {
                clearTimeout(recorderFieldTimeout);
                recorderFieldTimeout = null;
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
            if (meetingFieldTimeout) {
                clearTimeout(meetingFieldTimeout);
                meetingFieldTimeout = null;
            }
            var index = $dataService.arrayObjectIndexOf($scope.meetingList, $scope.meetingName, "name", false);
            $scope.$evalAsync(function () {
                if (index === -1) {
                    $scope.isNewMeeting = true;
                    $scope.haveMeeting = false;
                }
                else {
                    $scope.meetingName = $scope.meetingList[index].name;
                    $scope.recorderFieldDisable = true;
                    $scope.meetingFieldDisable = true;
                    $scope.haveMeeting = true;
                    $scope.isNewMeeting = false;
                    $scope.selectedMeetingId = $scope.meetingList[index].id;
                    getMeetingMembers();
                }
            });
        };
        var getCounts = function (data) {
            $scope.totalPossible = data.length;
        };
        var updateUserList = function (user) {
            $scope.userList.push(user);
            $scope.fullUserList.push(user);
        };
        var updateMemberList = function (member) {
            $scope.memberList.push(member);
            $scope.fullMemberList.push(member);
        };
        var filterMembersBySearch = function () {
            $scope.$evalAsync(function () {
                $scope.memberList = $scope.fullMemberList.filter(function (item) { return item.fullName.toLowerCase().indexOf($scope.globalSearchString.toLowerCase()) > -1; });
            });
        };
        function getMeetingMembers() {
            $scope.load = $dataService.getMeetingMembers($scope.selectedMeetingId)
                .then(function (data) {
                $scope.memberList = data;
                $scope.fullMemberList = angular.copy($scope.memberList);
                $scope.availableMemberList = $scope.userList.filter(function (item) { return $dataService.arrayObjectIndexOf($scope.memberList, item.fullName, "fullName", false) === -1; });
            });
        }
        ;
        var searchFieldTimeout;
        $('#globalSearch')
            .keydown(function () {
            if (searchFieldTimeout) {
                clearTimeout(searchFieldTimeout);
                searchFieldTimeout = null;
            }
            searchFieldTimeout = setTimeout(filterMembersBySearch, 700);
        });
        $scope.filterUserSelected = function (type) {
            alert($scope.hidePresent);
        };
        $scope.createNewUser = function (name) {
            if (name.split(' ').length !== 2) {
                alert('Sorry, we need first and last name only');
                return;
            }
            var user = {};
            user.firstName = name.split(' ')[0];
            user.lastName = name.split(' ')[1];
            user.fullName = name;
            user.isAttend = null;
            $dataService.saveUser(user)
                .then(function (response) {
                user.id = response.data;
                updateUserList(user);
                $scope.onBlurRecorder();
            });
        };
        $scope.createMeeting = function () {
            var meeting = {};
            meeting.name = $scope.meetingName;
            meeting.meetingTypeId = $scope.meetingTypeId;
            $dataService.saveMeeting(meeting)
                .then(function (data) {
                meeting.id = data;
                $scope.meetingList.push(meeting);
                $scope.onBlurMeeting();
            });
        };
        $scope.AddMember = function (member) {
            var data = {};
            data.meetingId = $scope.selectedMeetingId;
            data.memberId = member.id;
            $scope.load = $dataService.addMemberToMeeting(data)
                .then(function (data) {
                $scope.addMeetingMembers = '';
                updateMemberList(member);
            });
        };
        $scope.AddNewUserAsMember = function (name) {
            if (name.split(' ').length !== 2) {
                alert('Sorry, we need first and last name only');
                return;
            }
            var user = {};
            user.firstName = name.split(' ')[0];
            user.lastName = name.split(' ')[1];
            user.fullName = name;
            user.isAttend = null;
            $scope.load = $dataService.saveUser(user)
                .then(function (response) {
                user.id = response.data;
                var xref = {};
                xref.meetingId = $scope.selectedMeetingId;
                xref.memberId = user.id;
                $scope.load = $dataService.addMemberToMeeting(xref)
                    .then(function (data) {
                    $scope.addMeetingMembers = '';
                    updateMemberList(user);
                });
            });
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
            $scope.load = $dataService.getAllUsers().then(function (data) {
                $scope.userList = data;
                $scope.fullUserList = angular.copy($scope.userList);
                getCounts(data);
            });
            ;
            $scope.load = $dataService.getAllMeetings().then(function (data) {
                $scope.meetingList = data;
            });
            ;
            $scope.load = $dataService.getAllMeetingTypes().then(function (data) {
                $scope.meetingTypeOptions = data;
            });
            ;
        });
    };
    controller.$inject = ['$scope', '$location', 'dataService', '$window'];
    app.controller('homeCtrl', controller);
})(angular.module("repoFormsApp"));
//# sourceMappingURL=Ctrl.js.map