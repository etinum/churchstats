/// <reference path="../typings/persontest.cs.d.ts" />
/// <reference path="../typings/angular-environment.d.ts" />
/// <reference path="../typings/cstatsviewmodels.cs.d.ts" />
/// <reference path="../typings/signalr.d.ts" />

/* Template for controllers
(app => {
        var controller = ($scope, $window, $dataService) => {

        };
    controller.$inject = ['$scope', '$window', 'dataService'];
    app.controller('nameOfCtrl', controller);
})(angular.module("repoFormsApp"));
*/

(app => {
    var controller = ($scope, $window, $dataService, $envService, $rootScope) => {

        //$dataService.getUser()
        //    .then(data => {
        //        $window.userdata = data;
        //        $scope.masterWelcome = "Welcome master " + data;
        //    });

        //$rootScope.testroot = 'pinky';
        $scope.baseWebApiUrl = $envService.read('apiUrl');
    };
    controller.$inject = ['$scope', '$window', 'dataService', 'envService', '$rootScope'];
    app.controller('masterCtrl', controller);
})(angular.module("repoFormsApp"));

(app => {

    var controller = ($scope, $location, $dataService, $window, $uibModal, $interval, $timeout, $localStorage) => {

        var devmode = false;

        $scope.$storage = $localStorage;


        // controller variables
        $scope.rf = {};
        $scope.recorderFieldDisable = false;
        $scope.meetingFieldDisable = false;
        $scope.isNewUser = false;
        $scope.isNewMeeting = false;


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
        $scope.attendTypeEnum.present = modeltypings.AttendTypeEnum.Present;
        $scope.attendTypeEnum.absent = modeltypings.AttendTypeEnum.Absent;
        $scope.attendTypeEnum.unknown = modeltypings.AttendTypeEnum.Unknown;



        var lastAction = Date.now();


        var hub = $.connection.attendHub;

        var recorderFieldTimeout;
        $('#recorderName')
            .keypress(() => {
                if (recorderFieldTimeout) {
                    clearTimeout(recorderFieldTimeout);
                    recorderFieldTimeout = null;
                }

                recorderFieldTimeout = setTimeout($scope.onBlurRecorder, 1500);
            });

        var meetingFieldTimeout;
        $('#meetingName')
            .keypress(() => {
                if (meetingFieldTimeout) {
                    clearTimeout(meetingFieldTimeout);
                    meetingFieldTimeout = null;
                }

                meetingFieldTimeout = setTimeout($scope.onBlurMeeting, 1500);
            });

        $scope.onBlurRecorder = () => {
            //alert('recorder selected: ' + $scope.recorderId);
            if (!$scope.recorderName) {
                return;
            }

            if (recorderFieldTimeout) {
                clearTimeout(recorderFieldTimeout);
                recorderFieldTimeout = null;
            }

            var user = $dataService.arrayGetObject($scope.userList, $scope.recorderName, "fullName", false);
            $scope.$evalAsync(() => {
                if (user == null) {
                    //alert('Create new user');
                    $scope.haveRecorder = false;
                    $scope.isNewUser = true;
                } else {
                    //alert('User exist');
                    setupUserField(user);
                }
            });
        };

        $scope.onBlurMeeting = () => {

            if (!$scope.meetingName) {
                return;
            }

            if (meetingFieldTimeout) {
                clearTimeout(meetingFieldTimeout);
                meetingFieldTimeout = null;
            }

            var meeting = $dataService.arrayGetObject($scope.meetingList, $scope.meetingName, "name");
            $scope.$evalAsync(() => {

                if (meeting == null) {
                    //alert('Create new user');
                    $scope.isNewMeeting = true;
                    $scope.haveMeeting = false;
                } else {

                    setupMeetingField(meeting);

                    hub.server.subscribe($scope.selectedMeetingId);

                    $interval(() => {
                        checkIdleRefresh();
                    },
                        60 * 1000);
                }
            });

        };


        // Helper
        function setupUserField(user: modeltypings.UserViewModel) {
            $scope.recorderName = user.fullName;
            $scope.recorderFieldDisable = true;
            $scope.haveRecorder = true;
            $scope.isNewUser = false;
            $localStorage.selectedUserId = $scope.selectedUserId = user.id;

            if ($localStorage.selectedMeetingId != undefined) {
                const meeting = $dataService.arrayGetObject($scope.meetingList, $localStorage.selectedMeetingId, "id");
                if (meeting != null)
                    setupMeetingField(meeting);
            }
        };

        function setupMeetingField(meeting: modeltypings.MeetingViewModel) {
            $scope.meetingName = meeting.name;
            $scope.meetingFieldDisable = true;
            $scope.haveMeeting = true;
            $scope.isNewMeeting = false;
            $localStorage.selectedMeetingId = $scope.selectedMeetingId = meeting.id;
            getMeetingMembers(meeting.id);
        };


        function gridAdjustBySize() {
            if (window.innerWidth > 543) {
                $scope.$evalAsync(() => {
                    $scope.gridModValue = 4;
                });
            } else {
                $scope.$evalAsync(() => {
                    $scope.gridModValue = 3;
                });            }
        };


        var updateCounts = (data: modeltypings.UserViewModel[]) => {
            $scope.counts.totalPossible = data.length;
            $scope.counts.unknown = data.filter(item => item.attendType === modeltypings.AttendTypeEnum.Unknown).length;
            $scope.counts.absent = data.filter(item => item.attendType === modeltypings.AttendTypeEnum.Absent).length;
            $scope.counts.present = data.filter(item => item.attendType === modeltypings.AttendTypeEnum.Present).length;
        };

        var updateUserList = (user: modeltypings.UserViewModel) => {
            $scope.userList.push(user);
            $scope.fullUserList.push(user);
        };


        var updateMemberList = (member: modeltypings.UserViewModel) => {
            $scope.fullMemberList.push(member);
            filterMembersBySearch();
        };


        $scope.filterMembersBySearch = filterMembersBySearch;


        function sortName() {
            switch ($scope.sortNameType) {
                case 'FA':
                    $scope.fullMemberList.sort((a, b) => {
                        if (a.firstName < b.firstName) return -1;
                        if (a.firstName > b.firstName) return 1;
                        return 0;
                    });
                    break;
                case 'FD':
                    $scope.fullMemberList.sort((a, b) => {
                        if (a.firstName > b.firstName) return -1;
                        if (a.firstName < b.firstName) return 1;
                        return 0;
                    });
                    break;
                case 'LA':
                    $scope.fullMemberList.sort((a, b) => {
                        if (a.lastName < b.lastName) return -1;
                        if (a.lastName > b.lastName) return 1;
                        return 0;
                    });
                    break;
                case 'LD':
                    $scope.fullMemberList.sort((a, b) => {
                        if (a.lastName > b.lastName) return -1;
                        if (a.lastName < b.lastName) return 1;
                        return 0;
                    });
                    break;
                default:
            }
        }

        function filterMemberListAttendTypes() {

            if ($scope.hidePresent) {

                $scope.memberList = $scope.memberList
                    .filter(item => item.attendType !== modeltypings.AttendTypeEnum.Present);
            }

            if ($scope.hideAbsent) {

                $scope.memberList = $scope.memberList
                    .filter(item => item.attendType !== modeltypings.AttendTypeEnum.Absent);
            }

            if ($scope.hideUnknown) {

                $scope.memberList = $scope.memberList
                    .filter(item => item.attendType !== modeltypings.AttendTypeEnum.Unknown);
            }



        }

        $scope.filterMembersBySearch = filterMembersBySearch;

        function filterMembersBySearch() {
            sortName();

            $scope.$evalAsync(() => {
                $scope.memberList = $scope.fullMemberList.filter(item => item.fullName.toLowerCase().indexOf($scope.globalSearchString.toLowerCase()) > -1);

                filterMemberListAttendTypes();

                $scope.availableMemberList = $scope.fullUserList.filter(item => $dataService.arrayObjectIndexOf($scope.fullMemberList, item.fullName, "fullName", false) === -1);
                updateCounts($scope.memberList);
            });
        }

        function getMeetingMembers(meetingId: number) {
            $scope.load = $dataService.getMeetingMembers(meetingId)
                .then(data => {
                    $scope.fullMemberList = <modeltypings.UserViewModel>data;
                    filterMembersBySearch();
                });
        };


        var createUserViewModel = (name: string) => {

            var user = <modeltypings.UserViewModel>{};
            user = parseNameForUser(user, name);
            user.attendType = modeltypings.AttendTypeEnum.Unknown;

            return user;

        };

        function parseNameForUser(user: modeltypings.UserViewModel, name: string) {

            if (name.split(' ').length !== 2) {
                alert('Sorry, we accept first and last name only');
                return null;
            }

            if ($dataService.arrayObjectIndexOf($scope.fullUserList, name, "fullName", false) > -1) {
                alert('User already exist, please pick another one');
                return null;
            }

            user.firstName = $dataService.capitalizeFirstLetter(name.split(' ')[0]);
            user.lastName = $dataService.capitalizeFirstLetter(name.split(' ')[1]);;
            user.fullName = user.firstName + ' ' + user.lastName;
        };


        var removeMember = (data: modeltypings.XMeetingUserViewModel) => {

            var index = $dataService.arrayObjectIndexOf($scope.fullMemberList, data.userId, "id");
            if (index > -1) {
                $scope.fullMemberList.splice(index, 1);
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


        // Event handler


        $scope.tbd = () => {
            alert('coming soon');
        };


        $scope.forceRefreshList = () => {
            $.connection.hub.start()
                .done(() => {
                    hub.server.subscribe($scope.selectedMeetingId);
                });
            getMeetingMembers($scope.selectedMeetingId);
        };
            


        $scope.sortNameAlpha = (type: string) => {


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
            .keydown(() => {
                if (searchFieldTimeout) {
                    clearTimeout(searchFieldTimeout);
                    searchFieldTimeout = null;
                }

                searchFieldTimeout = setTimeout(filterMembersBySearch, 700);
            });

        $scope.createNewUserForRecorder = (name) => {

            var user = createUserViewModel(name);
            if (user == null) {
                return;
            }


            $dataService.saveUser(user)
                .then((response) => {
                    user.id = response.data;
                    updateUserList(user);
                    $scope.onBlurRecorder();
                });
        };

        $scope.createMeeting = () => {
            var meeting = <modeltypings.MeetingViewModel>{};
            meeting.name = $scope.meetingName;
            meeting.meetingTypeId = $scope.meetingTypeId;

            $dataService.saveMeeting(meeting)
                .then((response) => {
                    meeting.id = response.data;
                    $scope.meetingList.push(meeting);
                    $scope.onBlurMeeting();
                });
        };

        $scope.AddMember = (member : modeltypings.UserViewModel) => {

            var data = <modeltypings.XMeetingUserViewModel>{};
            data.meetingId = $scope.selectedMeetingId;
            data.userId = member.id;
            member.attendType = modeltypings.AttendTypeEnum.Unknown;
            updateMemberList(member);

            $scope.load = $dataService.addMemberToMeeting(data)
                .then(() => {
                    // reset fields
                    $scope.addMeetingMembers = '';
                });

        };

        $scope.AddNewUserAsMember = (name) => {

            var user = createUserViewModel(name);
            if (user == null) {
                return;
            }

            $scope.load = $dataService.saveUser(user)
                .then((response) => {
                    user.id = response.data;

                    var xref = <modeltypings.XMeetingUserViewModel>{};
                    xref.meetingId = $scope.selectedMeetingId;
                    xref.userId = user.id;
                    updateMemberList(user);
                    updateUserList(user);

                    $scope.load = $dataService.addMemberToMeeting(xref)
                        .then(() => {
                            // reset fields
                            $scope.addMeetingMembers = '';
                        });
                });
        };

        $scope.setMemberAttendType = (item) => {
            if ($scope.justLp) {
                $timeout.cancel($scope.longPressTimeout);
                $scope.justLp = false;
                return;
            }
            item.attendType = (item.attendType === $scope.attendTypeEnum.unknown)
                ? $scope.attendTypeEnum.present
                : ((item.attendType === $scope.attendTypeEnum.absent) ? $scope.attendTypeEnum.unknown : $scope.attendTypeEnum.absent);
        };
        

        $scope.memberSelected = (item: modeltypings.UserViewModel) => {
            if ($scope.justLp) {
                $timeout.cancel($scope.longPressTimeout);
                $scope.justLp = false;
                return;
            }

            checkIdleRefresh();
            idleReset();

            var attendance = <modeltypings.AttendanceViewModel>{};
            attendance.meetingId = $scope.selectedMeetingId;
            attendance.recorderId = $scope.selectedUserId;
            attendance.userId = item.id;
            attendance.id = item.attendanceId;
            attendance.attendType = item.attendType;
            attendance.meetingDate = new Date();

            $dataService.saveAttendance(attendance)
                .then((response) => {
                    attendance.id = response.data;
                });

            updateCounts($scope.memberList);
            //  alert('Update database for: ' + item.fullName + ", present: " + item.isAttend);
        };

        $scope.removeMemberFromMeeting = (id: number) => {

            var xrf = <modeltypings.XMeetingUserViewModel>{};
            xrf.userId = id;
            xrf.meetingId = $scope.selectedMeetingId;

            $dataService.removeMemberFromMeeting(xrf)
                .then(() => {
                    removeMember(xrf);
                });
        }


        $scope.reloadUser = () => {

            delete $localStorage.selectedUserId;
            delete $localStorage.selectedMeetingId;

            $timeout(() => {
                location.reload();                
            }, 250);
        };

        $scope.reloadMeeting = () => {

            delete $localStorage.selectedMeetingId;

            $timeout(() => {
                location.reload();
            }, 250);
        };



        $scope.refreshBrowser = () => {
            location.reload();
        };



        $scope.memberGridLpEnd = (item) => {
            item.fire = 0;
            $timeout(() => {
                $scope.open();
            }, 150);
        };

        $scope.memberGridLp = (item) => {
            item.fire = 1;
            $scope.justLp = true;
            $scope.longPressTimeout = $timeout(() => {
                $scope.justLp = false;
                item.fire = 0;
            }, 1500);
        };


        $scope.testApi = () => {
            var meeting = <modeltypings.MeetingViewModel>{};
            meeting.id = 4;
            meeting.name = 'my crazy name';
            meeting.meetingTypeId = 4;

            $dataService.saveMeeting(meeting)
                .then((response) => {
                    meeting.id = response.data;
                    $scope.meetingList.push(meeting);
                    $scope.onBlurMeeting();
                });

        };


        // Execution

        // signalR server call handlers
        hub.client.ClientCall = () => {
            alert('hello value, world');
        };


        hub.client.RemoveMember = (data: modeltypings.XMeetingUserViewModel) => {
            removeMember(data);
        };

        hub.client.UpdateAttendance = (data: modeltypings.AttendanceViewModel) => {

            var member = <modeltypings.UserViewModel>{};
            var recorder = <modeltypings.UserViewModel>{};

            if (data.recorderId === 0) {
                member = $scope.fullUserList.filter(item => item.id === data.userId)[0];
            } else {
                member = $scope.fullMemberList.filter(item => item.id === data.userId)[0];
                recorder = $scope.fullUserList.filter(item => item.id === data.recorderId)[0];
            }

            $scope.$evalAsync(() => {
                member.attendType = data.attendType;
                if (recorder.id != null) {
                    member.recorderId = data.recorderId;
                    member.recorderName = recorder.fullName;
                    member.lastRecorded = data.lastUpdated;
                    member.attendanceId = data.id;
                    member.attendanceNotes = data.notes;

                } else {
                    member.attendanceId = 0;
                    if ($scope.fullMemberList.filter(item => item.id === data.userId)[0] == null) {
                        updateMemberList(member);
                    }                }
                filterMembersBySearch();

            });

            //alert('update made: ' + member.fullName);

        };


        $.connection.hub.start()
            .done(() => {

                $(window)
                    .resize(() => {
                        gridAdjustBySize();
                    });

                $scope.initLoadCount = 0;

                // data for checkbox.
                $scope.load = $dataService.getAllUsers()
                    .then(data => {
                        $scope.initLoadCount++;
                        $scope.userList = <modeltypings.UserViewModel[]>data;
                        $scope.fullUserList = angular.copy($scope.userList);
                    });;


                //Data for meetings
                $dataService.getAllMeetings()
                    .then(data => {
                        $scope.initLoadCount++;
                        $scope.meetingList = <modeltypings.MeetingViewModel[]>data;
                    });;


                //Data for meeting types
                $dataService.getAllMeetingTypes()
                    .then(data => {
                        $scope.initLoadCount++;
                        $scope.meetingTypeOptions = <modeltypings.MeetingTypeViewModel[]>data;
                    });;


                $scope.$watch('initLoadCount',
                (newValue) =>
                {
                    if (newValue === 3) {
                        if ($localStorage.selectedUserId != undefined) {
                            const user = $dataService.arrayGetObject($scope.userList, $localStorage.selectedUserId, "id");
                            if (user != null)
                            setupUserField(user);
                        }
                    }
                });


    });


        // Modal Activities
        $scope.open = () => {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'confirmReset.html',
                controller: 'confirmResetCtrl',
                size: 'sm'
            });

            modalInstance.result.then(() => {
                // handing when close, you can get the parameter...
            }, () => {
                // handling when cancel, you can get the value... 
            });
        };


        $scope.openSaveUserDialog = () => {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'saveDialog.html',
                controller: 'saveUserCtrl',
                size: 'sm',
                resolve: {
                    data: () => {
                        return $scope.recorderName;
                    }
                }

            });

            modalInstance.result.then((newUserName: string) => {
                var user = $dataService.arrayGetObject($scope.fullUserList, $scope.selectedUserId, "id");
                user = parseNameForUser(user, newUserName);

                if (user == null)
                    return;

                $scope.load = $dataService.saveUser(user)
                    .then(() => {
                        $scope.recorderName = newUserName;
                        getMeetingMembers($scope.selectedMeetingId);
                    });
            },
                () => {

                });

        }

        $scope.openSaveMeetingDialog = () => {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'saveDialog.html',
                controller: 'saveMeetingCtrl',
                size: 'sm',
                resolve: {
                    data: () => {
                        return $scope.meetingName;
                    }
                }

            });

            modalInstance.result.then((newMeetingName: string) => {
                var meeting = $dataService.arrayGetObject($scope.meetingList, $scope.selectedMeetingId, "id");
                meeting.name = newMeetingName;

                $scope.load = $dataService.saveMeeting(meeting)
                    .then(() => {
                        $scope.meetingName = newMeetingName;
                    });
            },
                () => {

            });

        }

    };

    controller.$inject = ['$scope', '$location', 'dataService', '$window', '$uibModal', '$interval', '$timeout', '$localStorage'];
    app.controller('homeCtrl', controller);
})(angular.module("repoFormsApp"));



(app => {
    var controller = ($scope, $uibModalInstance, $timeout, $window, $location) => {

        $scope.close = () => {

            if ($scope.inputString != null && $scope.inputString.toLowerCase() === 'yes') {
                alert('What are you doing!?? Sorry, not yet implemented.');
            } else {
                alert('Wheww.... that was a close one');
            }
            $uibModalInstance.dismiss();
        };

    };
    controller.$inject = ['$scope', '$uibModalInstance', '$timeout', '$window', '$location'];
    app.controller('confirmResetCtrl', controller);
})(angular.module("repoFormsApp"));


(app => {
    var controller = ($scope, $uibModalInstance, $timeout, $window, data) => {

        $scope.placeHolderString = "New user name";
        $scope.titleString = "New User Name";

        $scope.inputString = data;

        $scope.save = () => {
            $uibModalInstance.close($scope.inputString);
        };

        $scope.cancel = () => {
            $uibModalInstance.dismiss();
        }


    };
    controller.$inject = ['$scope', '$uibModalInstance', '$timeout', '$window', 'data'];
    app.controller('saveUserCtrl', controller);
})(angular.module("repoFormsApp"));

(app => {
    var controller = ($scope, $uibModalInstance, $timeout, $window, data) => {

        $scope.placeHolderString = "New meeting name";
        $scope.titleString = "New Meeting Name";

        $scope.inputString = data;

        $scope.save = () => {
            $uibModalInstance.close($scope.inputString);
        };

        $scope.cancel = () => {
            $uibModalInstance.dismiss();
        }


    };
    controller.$inject = ['$scope', '$uibModalInstance', '$timeout', '$window', 'data'];
    app.controller('saveMeetingCtrl', controller);
})(angular.module("repoFormsApp"));