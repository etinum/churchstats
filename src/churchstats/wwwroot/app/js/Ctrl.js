(function (app) {
    var controller = function ($scope, $window, $dataService, $envService, $rootScope) {
        $scope.baseWebApiUrl = $envService.read('apiUrl');
    };
    controller.$inject = ['$scope', '$window', 'dataService', 'envService', '$rootScope'];
    app.controller('masterCtrl', controller);
})(angular.module("repoFormsApp"));
(function (app) {
    var controller = function ($scope, $location, $dataService, $window, $uibModal) {
        $scope.rf = {};
        $scope.haveRecorder = false;
        $scope.recorderFieldDisable = false;
        $scope.meetingFieldDisable = false;
        $scope.isNewUser = false;
        $scope.isNewMeeting = false;
        $scope.haveMeeting = false;
        $scope.selectedUserId = 0;
        $scope.selectedMeetingId = 0;
        $scope.globalSearchString = '';
        $scope.counts = {};
        var hub = $.connection.attendHub;
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
                    $scope.recorderFieldDisable = true;
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
                    $scope.meetingFieldDisable = true;
                    $scope.haveMeeting = true;
                    $scope.isNewMeeting = false;
                    $scope.selectedMeetingId = $scope.meetingList[index].id;
                    getMeetingMembers();
                    hub.server.subscribe($scope.selectedMeetingId);
                }
            });
        };
        var updateCounts = function (data) {
            $scope.counts.totalPossible = data.length;
            $scope.counts.unknown = data.filter(function (item) { return item.isAttend === null; }).length;
            $scope.counts.absent = data.filter(function (item) { return item.isAttend === false; }).length;
            $scope.counts.present = data.filter(function (item) { return item.isAttend === true; }).length;
        };
        var updateUserList = function (user) {
            $scope.userList.push(user);
            $scope.fullUserList.push(user);
        };
        var updateMemberList = function (member) {
            $scope.fullMemberList.push(member);
            filterMembersBySearch();
        };
        $scope.filterMembersBySearch = filterMembersBySearch;
        function filterMembersBySearch() {
            $scope.$evalAsync(function () {
                $scope.memberList = $scope.fullMemberList.filter(function (item) { return item.fullName.toLowerCase().indexOf($scope.globalSearchString.toLowerCase()) > -1; });
                $scope.availableMemberList = $scope.fullUserList.filter(function (item) { return $dataService.arrayObjectIndexOf($scope.fullMemberList, item.fullName, "fullName", false) === -1; });
                updateCounts($scope.memberList);
            });
        }
        function getMeetingMembers() {
            $scope.load = $dataService.getMeetingMembers($scope.selectedMeetingId)
                .then(function (data) {
                $scope.fullMemberList = data;
                filterMembersBySearch();
            });
        }
        ;
        var createUser = function (name) {
            if (name.split(' ').length !== 2) {
                alert('Sorry, we need first and last name only');
                return null;
            }
            if ($dataService.arrayObjectIndexOf($scope.fullUserList, name, "fullName", false) > -1) {
                alert('User already exist, please pick another one');
                return null;
            }
            var user = {};
            user.firstName = $dataService.capitalizeFirstLetter(name.split(' ')[0]);
            user.lastName = $dataService.capitalizeFirstLetter(name.split(' ')[1]);
            ;
            user.fullName = user.firstName + ' ' + user.lastName;
            user.isAttend = null;
            return user;
        };
        var searchFieldTimeout;
        $('#globalSearch')
            .keydown(function () {
            if (searchFieldTimeout) {
                clearTimeout(searchFieldTimeout);
                searchFieldTimeout = null;
            }
            searchFieldTimeout = setTimeout(filterMembersBySearch, 700);
        });
        $scope.createNewUser = function (name) {
            var user = createUser(name);
            if (user == null) {
                return;
            }
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
                .then(function (response) {
                meeting.id = response.data;
                $scope.meetingList.push(meeting);
                $scope.onBlurMeeting();
            });
        };
        $scope.AddMember = function (member) {
            var data = {};
            data.meetingId = $scope.selectedMeetingId;
            data.memberId = member.id;
            $scope.load = $dataService.addMemberToMeeting(data)
                .then(function () {
                $scope.addMeetingMembers = '';
                updateMemberList(member);
            });
        };
        $scope.AddNewUserAsMember = function (name) {
            var user = createUser(name);
            if (user == null) {
                return;
            }
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
            var attendance = {};
            attendance.meetingId = $scope.selectedMeetingId;
            attendance.recorderId = $scope.selectedUserId;
            attendance.userId = item.id;
            attendance.id = item.attendanceId;
            attendance.isAttend = item.isAttend;
            attendance.meetingDate = new Date();
            $dataService.saveAttendance(attendance)
                .then(function (response) {
                attendance.id = response.data;
            });
            updateCounts($scope.memberList);
        };
        $scope.reload = function () {
            location.reload();
        };
        hub.client.ClientCall = function () {
            alert('hello value, world');
        };
        hub.client.UpdateAttendance = function (data) {
            var member = $scope.fullMemberList.filter(function (item) { return item.id === data.userId; })[0];
            var recorder = $scope.fullUserList.filter(function (item) { return item.id === data.recorderId; })[0];
            $scope.$evalAsync(function () {
                member.isAttend = data.isAttend;
                member.recorderId = data.recorderId;
                member.recorderName = recorder.fullName;
                member.attendanceId = data.id;
                member.lastRecorded = data.lastUpdated;
                filterMembersBySearch();
            });
        };
        $.connection.hub.start()
            .done(function () {
            $scope.load = $dataService.getAllUsers().then(function (data) {
                $scope.userList = data;
                $scope.fullUserList = angular.copy($scope.userList);
            });
            ;
            $dataService.getAllMeetings().then(function (data) {
                $scope.meetingList = data;
            });
            ;
            $dataService.getAllMeetingTypes().then(function (data) {
                $scope.meetingTypeOptions = data;
            });
            ;
        });
        $scope.open = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'confirmReset.html',
                controller: 'confirmResetCtrl',
                size: 'sm'
            });
            modalInstance.result.then(function () {
            }, function () {
            });
        };
    };
    controller.$inject = ['$scope', '$location', 'dataService', '$window', '$uibModal'];
    app.controller('homeCtrl', controller);
})(angular.module("repoFormsApp"));
(function (app) {
    var controller = function ($scope, $uibModalInstance, $timeout, $window, $location) {
        $scope.close = function () {
            if ($scope.inputString != null && $scope.inputString.toLowerCase() === 'yes') {
                alert('What are you doing!?? Sorry, not yet implemented.');
            }
            else {
                alert('Wheww.... that was a close one');
            }
            $uibModalInstance.dismiss();
        };
    };
    controller.$inject = ['$scope', '$uibModalInstance', '$timeout', '$window', '$location'];
    app.controller('confirmResetCtrl', controller);
})(angular.module("repoFormsApp"));
//# sourceMappingURL=Ctrl.js.map