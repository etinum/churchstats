(function (app) {
    var controller = function ($scope, $window, $dataService, $envService, $rootScope) {
        $scope.baseWebApiUrl = $envService.read('apiUrl');
    };
    controller.$inject = ['$scope', '$window', 'dataService', 'envService', '$rootScope'];
    app.controller('masterCtrl', controller);
})(angular.module("repoFormsApp"));
(function (app) {
    var controller = function ($scope, $location, $dataService, $window, $uibModal, $interval, $timeout, $localStorage, $q) {
        $scope.$storage = $localStorage;
        $scope.rf = {};
        $scope.recorderFieldDisable = false;
        $scope.meetingFieldDisable = false;
        $scope.isNewUser = false;
        $scope.isNewMeeting = false;
        $scope.attendanceDate = new Date();
        $scope.isHistorical = false;
        $scope.dateOptions = {};
        $scope.dateOptions.maxDate = new Date();
        $scope.haveRecorder = false;
        $scope.haveMeeting = false;
        $scope.selectedUserId = 0;
        $scope.selectedMeetingId = 0;
        $scope.globalSearchString = '';
        $scope.counts = {};
        $scope.sortNameType = 'FA';
        $scope.hideIcon = false;
        $scope.firstSortAsc = true;
        $scope.lastSortAsc = true;
        $scope.isFirstSort = true;
        $scope.showGrid = true;
        gridAdjustBySize();
        $scope.hideUnknown = false;
        $scope.hidePresent = false;
        $scope.hideAbsent = false;
        $scope.attendTypeEnum = {};
        $scope.attendTypeEnum.present = 1;
        $scope.attendTypeEnum.absent = 2;
        $scope.attendTypeEnum.unknown = 3;
        var lastAction = Date.now();
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
            var user = $dataService.arrayGetObject($scope.userList, $scope.recorderName, "fullName", false);
            $scope.$evalAsync(function () {
                if (user == null) {
                    $scope.haveRecorder = false;
                    $scope.isNewUser = true;
                }
                else {
                    setupUserField(user);
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
            var meeting = $dataService.arrayGetObject($scope.meetingList, $scope.meetingName, "name");
            $scope.$evalAsync(function () {
                if (meeting == null) {
                    $scope.isNewMeeting = true;
                    $scope.haveMeeting = false;
                }
                else {
                    setupMeetingField(meeting);
                    $interval(function () {
                        checkIdleRefresh();
                    }, 60 * 1000);
                }
            });
        };
        function setupUserField(user) {
            $scope.recorderName = user.fullName;
            $scope.recorderFieldDisable = true;
            $scope.haveRecorder = true;
            $scope.isNewUser = false;
            $localStorage.selectedUserId = $scope.selectedUserId = user.id;
            if ($localStorage.selectedMeetingId != undefined) {
                var meeting = $dataService.arrayGetObject($scope.meetingList, $localStorage.selectedMeetingId, "id");
                if (meeting != null)
                    setupMeetingField(meeting);
            }
        }
        ;
        function setupMeetingField(meeting) {
            $scope.meetingName = meeting.name;
            $scope.meetingFieldDisable = true;
            $scope.haveMeeting = true;
            $scope.isNewMeeting = false;
            $localStorage.selectedMeetingId = $scope.selectedMeetingId = meeting.id;
            $.connection.hub.start()
                .done(function () {
                hub.server.subscribe($scope.selectedMeetingId);
                getMeetingMembers(meeting.id, $scope.attendanceDate);
            });
        }
        ;
        function gridAdjustBySize() {
            if (window.innerWidth > 543) {
                $scope.$evalAsync(function () {
                    $scope.gridModValue = 4;
                });
            }
            else {
                $scope.$evalAsync(function () {
                    $scope.gridModValue = 3;
                });
            }
        }
        ;
        var updateCounts = function (data) {
            $scope.counts.totalPossible = data.length;
            $scope.counts.unknown = data.filter(function (item) { return item.attendType === 3; }).length;
            $scope.counts.absent = data.filter(function (item) { return item.attendType === 2; }).length;
            $scope.counts.present = data.filter(function (item) { return item.attendType === 1; }).length;
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
        function sortName() {
            switch ($scope.sortNameType) {
                case 'FA':
                    $scope.fullMemberList.sort(function (a, b) {
                        if (a.firstName === b.firstName) {
                            if (a.lastName < b.lastName)
                                return -1;
                            if (a.lastName > b.lastName)
                                return 1;
                            return 0;
                        }
                        else {
                            if (a.firstName < b.firstName)
                                return -1;
                            if (a.firstName > b.firstName)
                                return 1;
                            return 0;
                        }
                    });
                    break;
                case 'FD':
                    $scope.fullMemberList.sort(function (a, b) {
                        if (a.firstName === b.firstName) {
                            if (a.lastName > b.lastName)
                                return -1;
                            if (a.lastName < b.lastName)
                                return 1;
                            return 0;
                        }
                        else {
                            if (a.firstName > b.firstName)
                                return -1;
                            if (a.firstName < b.firstName)
                                return 1;
                            return 0;
                        }
                    });
                    break;
                case 'LA':
                    $scope.fullMemberList.sort(function (a, b) {
                        if (a.lastName === b.lastName) {
                            if (a.firstName < b.firstName)
                                return -1;
                            if (a.firstName > b.firstName)
                                return 1;
                            return 0;
                        }
                        else {
                            if (a.lastName < b.lastName)
                                return -1;
                            if (a.lastName > b.lastName)
                                return 1;
                            return 0;
                        }
                    });
                    break;
                case 'LD':
                    $scope.fullMemberList.sort(function (a, b) {
                        if (a.lastName === b.lastName) {
                            if (a.firstName > b.firstName)
                                return -1;
                            if (a.firstName < b.firstName)
                                return 1;
                            return 0;
                        }
                        else {
                            if (a.lastName > b.lastName)
                                return -1;
                            if (a.lastName < b.lastName)
                                return 1;
                            return 0;
                        }
                    });
                    break;
                default:
            }
        }
        function filterMemberListAttendTypes() {
            if ($scope.hidePresent) {
                $scope.memberList = $scope.memberList
                    .filter(function (item) { return item.attendType !== 1; });
            }
            if ($scope.hideAbsent) {
                $scope.memberList = $scope.memberList
                    .filter(function (item) { return item.attendType !== 2; });
            }
            if ($scope.hideUnknown) {
                $scope.memberList = $scope.memberList
                    .filter(function (item) { return item.attendType !== 3; });
            }
        }
        $scope.filterMembersBySearch = filterMembersBySearch;
        function filterMembersBySearch() {
            sortName();
            $scope.$evalAsync(function () {
                $scope.memberList = $scope.fullMemberList.filter(function (item) { return item.fullName.toLowerCase().indexOf($scope.globalSearchString.toLowerCase()) > -1; });
                filterMemberListAttendTypes();
                $scope.availableMemberList = $scope.fullUserList.filter(function (item) { return $dataService.arrayObjectIndexOf($scope.fullMemberList, item.fullName, "fullName", false) === -1 && item.isActive; });
                updateCounts($scope.memberList);
            });
        }
        function getMeetingMembers(meetingId, attendanceDate) {
            $scope.load = $dataService.getMeetingMembers(meetingId, attendanceDate)
                .then(function (data) {
                $scope.fullMemberList = data;
                filterMembersBySearch();
            });
        }
        ;
        var createUserViewModel = function (name) {
            var user = {};
            user = parseNameForUser(user, name);
            user.attendType = 3;
            return user;
        };
        function parseNameForUser(user, name) {
            var names = name.split(' ');
            if (names.length !== 2 && names.length !== 3) {
                alert('Must have at least first and last name or first middle last.  ');
                return null;
            }
            if ($dataService.arrayObjectIndexOf($scope.fullUserList, name, "fullName", false) > -1) {
                alert('User already exist, please pick another one');
                return null;
            }
            if (names.length > 2) {
                user.firstName = $dataService.capitalizeFirstLetter(names[0]);
                user.lastName = $dataService.capitalizeFirstLetter(names[2]);
                user.middleName = $dataService.capitalizeFirstLetter(names[1]);
                user.fullName = user.firstName + ' ' + user.middleName + ' ' + user.lastName;
                user.fullNameRev = user.lastName + ', ' + user.firstName + ' ' + user.middleName;
            }
            else {
                user.firstName = $dataService.capitalizeFirstLetter(names[0]);
                user.lastName = $dataService.capitalizeFirstLetter(names[1]);
                user.middleName = "";
                user.fullName = user.firstName + ' ' + user.lastName;
                user.fullNameRev = user.lastName + ', ' + user.firstName;
            }
            return user;
        }
        ;
        var removeMember = function (data) {
            var index = $dataService.arrayObjectIndexOf($scope.fullMemberList, data.userId, "id");
            if (index > -1) {
                $scope.fullMemberList.splice(index, 1);
                filterMembersBySearch();
            }
        };
        var updateUser = function (data) {
            var index = $dataService.arrayObjectIndexOf($scope.fullUserList, data.id, "id");
            if (index > -1) {
                $scope.fullUserList.splice(index, 1, data);
                filterMembersBySearch();
            }
        };
        function checkIdleRefresh() {
            var time = Date.now() - lastAction;
            if (time > 150 * 1000) {
                lastAction = Date.now();
                $scope.forceRefreshList();
            }
        }
        function idleReset() {
            lastAction = Date.now();
        }
        function isTodaysDate() {
            return ($scope.attendanceDate.toDateString() === new Date().toDateString());
        }
        $scope.changeAttendanceDate = function () {
            if ($scope.haveRecorder) {
                getMeetingMembers($scope.selectedMeetingId, $scope.attendanceDate);
            }
        };
        $scope.changeAttendanceDateToday = function () {
            if ($scope.haveRecorder && $scope.attendanceDate.toDateString() !== new Date().toDateString()) {
                getMeetingMembers($scope.selectedMeetingId, new Date());
                $scope.attendanceDate = new Date();
            }
        };
        $scope.$watch('attendanceDate', function (newValue) {
            if (newValue != null)
                $scope.isHistorical = (newValue.toDateString() !== new Date().toDateString());
        });
        $scope.tbd = function () {
            alert('coming soon');
        };
        $scope.forceRefreshList = function () {
            $.connection.hub.start()
                .done(function () {
                hub.server.subscribe($scope.selectedMeetingId);
            });
            getMeetingMembers($scope.selectedMeetingId, $scope.attendanceDate);
        };
        $scope.sortNameAlpha = function (type) {
            switch (type) {
                case 'F':
                    $scope.sortNameType = $scope.firstSortAsc ? 'FD' : 'FA';
                    $scope.firstSortAsc = !$scope.firstSortAsc;
                    $scope.isFirstSort = true;
                    $scope.lastSortAsc = true;
                    break;
                case 'L':
                    $scope.sortNameType = $scope.lastSortAsc ? 'LA' : 'LD';
                    $scope.lastSortAsc = !$scope.lastSortAsc;
                    $scope.isFirstSort = false;
                    $scope.firstSortAsc = false;
                    break;
                default:
            }
            filterMembersBySearch();
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
        $scope.createNewUserForRecorder = function (name) {
            var user = createUserViewModel(name);
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
            data.userId = member.id;
            data.memberType = 1;
            data.effectiveDate = $scope.attendanceDate;
            member.attendType = 3;
            updateMemberList(member);
            $scope.load = $dataService.addMemberToMeeting(data)
                .then(function () {
                $scope.addMeetingMembers = '';
            });
        };
        $scope.UpdateMember = function (member) {
            var data = {};
            data.meetingId = $scope.selectedMeetingId;
            data.userId = member.id;
            data.memberType = member.memberType;
            member.attendType = member.attendType;
            $scope.load = $dataService.addMemberToMeeting(data)
                .then(function () {
            });
        };
        $scope.AddNewUserAsMember = function (name) {
            var user = createUserViewModel(name);
            if (user == null) {
                return;
            }
            $scope.load = $dataService.saveUser(user)
                .then(function (response) {
                user.id = response.data;
                var xref = {};
                xref.meetingId = $scope.selectedMeetingId;
                xref.userId = user.id;
                xref.effectiveDate = $scope.attendanceDate;
                updateMemberList(user);
                updateUserList(user);
                $scope.load = $dataService.addMemberToMeeting(xref)
                    .then(function () {
                    $scope.addMeetingMembers = '';
                });
            });
        };
        $scope.setMemberAttendType = function (item) {
            if ($scope.justLp) {
                $timeout.cancel($scope.longPressTimeout);
                $scope.justLp = false;
                return;
            }
            item.attendType = (item.attendType === $scope.attendTypeEnum.unknown)
                ? $scope.attendTypeEnum.present
                : ((item.attendType === $scope.attendTypeEnum.absent) ? $scope.attendTypeEnum.unknown : $scope.attendTypeEnum.absent);
            $timeout.cancel($scope.memberSelectedTimeout);
            $scope.memberSelectedTimeout = $timeout(function () {
                $scope.memberSelected(item);
            }, 750);
        };
        $scope.memberSelected = function (item) {
            if ($scope.justLp) {
                $timeout.cancel($scope.longPressTimeout);
                $scope.justLp = false;
                return;
            }
            checkIdleRefresh();
            idleReset();
            var attendance = {};
            attendance.meetingId = $scope.selectedMeetingId;
            attendance.recorderId = $scope.selectedUserId;
            attendance.userId = item.id;
            attendance.id = item.attendanceId;
            attendance.attendType = item.attendType;
            attendance.memberType = item.memberType;
            attendance.meetingDate = $scope.attendanceDate;
            $dataService.saveAttendance(attendance)
                .then(function (response) {
                attendance.id = response.data;
            });
            updateCounts($scope.memberList);
        };
        $scope.removeMemberFromMeeting = function (id) {
            var deferred = $q.defer();
            if (!isTodaysDate()) {
                alert("Members cannot be delete for historical meetings.");
                return deferred.resolve();
            }
            var xrf = {};
            xrf.userId = id;
            xrf.meetingId = $scope.selectedMeetingId;
            xrf.effectiveDate = $scope.attendanceDate;
            $dataService.removeMemberFromMeeting(xrf)
                .then(function () {
                removeMember(xrf);
                deferred.resolve();
            });
            return deferred.promise;
        };
        $scope.reloadUser = function () {
            delete $localStorage.selectedUserId;
            delete $localStorage.selectedMeetingId;
            $timeout(function () {
                location.reload();
            }, 250);
        };
        $scope.reloadMeeting = function () {
            delete $localStorage.selectedMeetingId;
            $timeout(function () {
                location.reload();
            }, 250);
        };
        $scope.refreshBrowser = function () {
            location.reload();
        };
        $scope.memberGridLpEnd = function (item) {
            item.longPressActive = 0;
            $timeout(function () {
                $scope.openMemberOptionsDialog(item);
            }, 150);
        };
        $scope.memberGridLp = function (item) {
            item.longPressActive = 1;
            $scope.justLp = true;
            $scope.longPressTimeout = $timeout(function () {
                $scope.justLp = false;
                item.longPressActive = 0;
            }, 1500);
        };
        $scope.testApi = function () {
            var meeting = {};
            meeting.id = 4;
            meeting.name = 'my crazy name';
            meeting.meetingTypeId = 4;
            $dataService.saveMeeting(meeting)
                .then(function (response) {
                meeting.id = response.data;
                $scope.meetingList.push(meeting);
                $scope.onBlurMeeting();
            });
        };
        hub.client.ClientCall = function () {
            alert('hello value, world');
        };
        hub.client.RemoveMember = function (data) {
            removeMember(data);
        };
        hub.client.UpdateAttendance = function (data) {
            var member = {};
            var recorder = {};
            if (data.recorderId === 0 || !data.recorderId) {
                member = $scope.fullUserList.filter(function (item) { return item.id === data.userId; })[0];
            }
            else {
                member = $scope.fullMemberList.filter(function (item) { return item.id === data.userId; })[0];
                recorder = $scope.fullUserList.filter(function (item) { return item.id === data.recorderId; })[0];
            }
            $scope.$evalAsync(function () {
                member.attendType = data.attendType;
                if (recorder.id != null) {
                    member.recorderId = data.recorderId;
                    member.recorderName = recorder.fullName;
                    member.lastRecorded = data.modifiedDate;
                    member.attendanceId = data.id;
                    member.attendanceNotes = data.notes;
                }
                else {
                    member.attendanceId = 0;
                    if ($scope.fullMemberList.filter(function (item) { return item.id === data.userId; })[0] == null) {
                        updateMemberList(member);
                    }
                }
                filterMembersBySearch();
            });
        };
        $.connection.hub.start()
            .done(function () {
            $(window)
                .resize(function () {
                gridAdjustBySize();
            });
            $scope.initLoadCount = 0;
            $scope.load = $dataService.getAllUsers()
                .then(function (data) {
                $scope.initLoadCount++;
                $scope.userList = data;
                $scope.fullUserList = angular.copy($scope.userList);
            });
            $dataService.getAllMeetings()
                .then(function (data) {
                $scope.initLoadCount++;
                $scope.meetingList = data;
            });
            ;
            $dataService.getAllMeetingTypes()
                .then(function (data) {
                $scope.initLoadCount++;
                $scope.meetingTypeOptions = data;
            });
            ;
            $scope.$watch('initLoadCount', function (newValue) {
                if (newValue === 3) {
                    if ($localStorage.selectedUserId != undefined) {
                        var user = $dataService.arrayGetObject($scope.userList, $localStorage.selectedUserId, "id");
                        if (user != null)
                            setupUserField(user);
                    }
                }
            });
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
        $scope.openSaveUserDialog = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'saveDialog.html',
                controller: 'saveUserCtrl',
                size: 'sm',
                resolve: {
                    data: function () {
                        return $scope.recorderName;
                    }
                }
            });
            modalInstance.result.then(function (newUserName) {
                var user = $dataService.arrayGetObject($scope.fullUserList, $scope.selectedUserId, "id");
                user = parseNameForUser(user, newUserName);
                if (user == null)
                    return;
                $scope.load = $dataService.saveUser(user)
                    .then(function () {
                    $scope.recorderName = newUserName;
                    getMeetingMembers($scope.selectedMeetingId, $scope.attendanceDate);
                });
            }, function () {
            });
        };
        $scope.openSaveMeetingDialog = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'saveDialog.html',
                controller: 'saveMeetingCtrl',
                size: 'sm',
                resolve: {
                    data: function () {
                        return $scope.meetingName;
                    }
                }
            });
            modalInstance.result.then(function (newMeetingName) {
                var meeting = $dataService.arrayGetObject($scope.meetingList, $scope.selectedMeetingId, "id");
                meeting.name = newMeetingName;
                $scope.load = $dataService.saveMeeting(meeting)
                    .then(function () {
                    $scope.meetingName = newMeetingName;
                });
            }, function () {
            });
        };
        $scope.openMemberOptionsDialog = function (memberVm) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'memberOptions.html',
                controller: 'memberOptionsCtrl',
                size: 'sm',
                resolve: {
                    data: function () {
                        return memberVm;
                    }
                }
            });
            modalInstance.result.then(function (actionType) {
                switch (actionType) {
                    case 'editUser':
                        $timeout(function () {
                            $scope.openMemberEditDialog(memberVm);
                        }, 250);
                        break;
                    case 'visitor':
                        memberVm.memberType = 3;
                        $scope.UpdateMember(memberVm);
                        $scope.memberSelected(memberVm);
                        break;
                    case 'notes':
                        break;
                    case 'remove':
                        $scope.removeMemberFromMeeting(memberVm.id);
                        break;
                    default:
                }
            }, function () {
            });
        };
        $scope.openMemberEditDialog = function (memberVm) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'memberEdit.html',
                controller: 'memberEditCtrl',
                size: 'sm',
                resolve: {
                    data: function () {
                        return memberVm;
                    }
                }
            });
            modalInstance.result.then(function (userVm) {
                $dataService.saveUser(userVm)
                    .then(function () {
                    if (!userVm.isActive) {
                        $scope.removeMemberFromMeeting(userVm.id)
                            .then(function () {
                            updateUser(userVm);
                        });
                    }
                    getMeetingMembers($scope.selectedMeetingId, $scope.attendanceDate);
                });
            }, function () {
            });
        };
    };
    controller.$inject = ['$scope', '$location', 'dataService', '$window', '$uibModal', '$interval', '$timeout', '$localStorage', '$q'];
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
(function (app) {
    var controller = function ($scope, $uibModalInstance, $timeout, $window, data) {
        $scope.placeHolderString = "New user name";
        $scope.titleString = "New User Name";
        $scope.inputString = data;
        $scope.save = function () {
            $uibModalInstance.close($scope.inputString);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    };
    controller.$inject = ['$scope', '$uibModalInstance', '$timeout', '$window', 'data'];
    app.controller('saveUserCtrl', controller);
})(angular.module("repoFormsApp"));
(function (app) {
    var controller = function ($scope, $uibModalInstance, $timeout, $window, data) {
        $scope.placeHolderString = "New meeting name";
        $scope.titleString = "New Meeting Name";
        $scope.inputString = data;
        $scope.save = function () {
            $uibModalInstance.close($scope.inputString);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    };
    controller.$inject = ['$scope', '$uibModalInstance', '$timeout', '$window', 'data'];
    app.controller('saveMeetingCtrl', controller);
})(angular.module("repoFormsApp"));
(function (app) {
    var controller = function ($scope, $uibModalInstance, $timeout, $window, data) {
        $scope.memberVm = data;
        $scope.optionSelected = function (type) {
            $uibModalInstance.close(type);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    };
    controller.$inject = ['$scope', '$uibModalInstance', '$timeout', '$window', 'data'];
    app.controller('memberOptionsCtrl', controller);
})(angular.module("repoFormsApp"));
(function (app) {
    var controller = function ($scope, $uibModalInstance, $timeout, $window, data) {
        $scope.memberVm = data;
        $scope.save = function (userVm) {
            $uibModalInstance.close(userVm);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    };
    controller.$inject = ['$scope', '$uibModalInstance', '$timeout', '$window', 'data'];
    app.controller('memberEditCtrl', controller);
})(angular.module("repoFormsApp"));
//# sourceMappingURL=Ctrl.js.map