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

    var controller = ($scope, $location, $dataService, $window, $uibModal, $interval) => {

        var devmode = false;

        // controller variables
        $scope.rf = {};
        $scope.recorderFieldDisable = false;
        $scope.meetingFieldDisable = false;
        $scope.isNewUser = false;
        $scope.isNewMeeting = false;


        $scope.haveRecorder = devmode ? true:  false;
        $scope.haveMeeting = devmode ? true : false;
        $scope.selectedUserId = devmode ? 201 : 0;
        $scope.selectedMeetingId = devmode ? 4 : 0;

        $scope.globalSearchString = '';
        $scope.counts = {};
        $scope.sortNameType = 'FA';
        $scope.hideIcon = false;

        $scope.firstSortAsc = true;
        $scope.lastSortAsc = true;

        $scope.showGrid = false;
        gridAdjustBySize();

        $scope.hideUnknown = false;
        $scope.hidePresent = false;
        $scope.hideAbsent = false;

        $scope.attendType = {};
        $scope.attendType.present = modeltypings.AttendTypeEnum.Present;
        $scope.attendType.absent = modeltypings.AttendTypeEnum.Absent;
        $scope.attendType.unknown = modeltypings.AttendTypeEnum.Unknown;


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

            var index = $dataService.arrayObjectIndexOf($scope.userList, $scope.recorderName, "fullName", false);
            $scope.$evalAsync(() => {
                if (index === -1) {
                    //alert('Create new user');
                    $scope.haveRecorder = false;
                    $scope.isNewUser = true;
                } else {
                    //alert('User exist');
                    $scope.recorderName = $scope.userList[index].fullName;
                    $scope.recorderFieldDisable = true;
                    $scope.haveRecorder = true;
                    $scope.isNewUser = false;
                    $scope.selectedUserId = $scope.userList[index].id;
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

            var index = $dataService.arrayObjectIndexOf($scope.meetingList, $scope.meetingName, "name", false);
            $scope.$evalAsync(() => {

                if (index === -1) {
                    //alert('Create new user');
                    $scope.isNewMeeting = true;
                    $scope.haveMeeting = false;
                } else {

                    $scope.meetingName = $scope.meetingList[index].name;
                    $scope.meetingFieldDisable = true;
                    $scope.haveMeeting = true;
                    $scope.isNewMeeting = false;
                    $scope.selectedMeetingId = $scope.meetingList[index].id;
                    getMeetingMembers();
                    hub.server.subscribe($scope.selectedMeetingId);

                    $interval(() => {
                        checkIdleRefresh();
                    },
                        10 * 1000);
                }
            });

        };


        // Helper
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
            $scope.counts.unknown = data.filter(item => item.attendTypeId === modeltypings.AttendTypeEnum.Unknown).length;
            $scope.counts.absent = data.filter(item => item.attendTypeId === modeltypings.AttendTypeEnum.Absent).length;
            $scope.counts.present = data.filter(item => item.attendTypeId === modeltypings.AttendTypeEnum.Present).length;
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

        function filterMembersBySearch() {
            sortName();

            $scope.$evalAsync(() => {
                $scope.memberList = $scope.fullMemberList.filter(item => item.fullName.toLowerCase().indexOf($scope.globalSearchString.toLowerCase()) > -1);
                $scope.availableMemberList = $scope.fullUserList.filter(item => $dataService.arrayObjectIndexOf($scope.fullMemberList, item.fullName, "fullName", false) === -1);
                updateCounts($scope.memberList);
            });
        }

        function getMeetingMembers() {
            $scope.load = $dataService.getMeetingMembers($scope.selectedMeetingId)
                .then(data => {
                    $scope.fullMemberList = <modeltypings.UserViewModel>data;
                    filterMembersBySearch();
                });
        };


        var createUserViewModel = (name) => {

            if (name.split(' ').length !== 2) {
                alert('Sorry, we need first and last name only');
                return null;
            }

            if ($dataService.arrayObjectIndexOf($scope.fullUserList, name, "fullName", false) > -1) {
                alert('User already exist, please pick another one');
                return null;
            }

            var user = <modeltypings.UserViewModel>{};
            user.firstName = $dataService.capitalizeFirstLetter(name.split(' ')[0]);
            user.lastName = $dataService.capitalizeFirstLetter(name.split(' ')[1]);;
            user.fullName = user.firstName + ' ' + user.lastName;
            user.attendTypeId = modeltypings.AttendTypeEnum.Unknown;

            return user;

        };


        var removeMember = (data: modeltypings.XMeetingUserViewModel) => {

            var index = $dataService.arrayObjectIndexOf($scope.fullMemberList, data.userId, "id");
            if (index > -1) {
                $scope.fullMemberList.splice(index, 1);
                filterMembersBySearch();
            }

        }

        function checkIdleRefresh() {

            var time = Date.now() - lastAction;
            if (time > 90 * 1000) {
                lastAction = Date.now();
                $scope.forceRefreshList();
            }
        }

        // Event handler

        $scope.tbd = () => {
            alert('coming soon');
        }



        $scope.forceRefreshList = () => {
            $.connection.hub.start()
                .done(() => {
                    hub.server.subscribe($scope.selectedMeetingId);
                });
            getMeetingMembers();
        }
            


        $scope.sortNameAlpha = (type: string) => {

            
            

            switch (type) {
                case 'F':
                    $scope.sortNameType = $scope.firstSortAsc ? 'FA' : 'FD';
                    $scope.firstSortAsc = !$scope.firstSortAsc;
                    break;
                case 'L':
                    $scope.sortNameType = $scope.lastSortAsc ? 'LA' : 'LD';
                    $scope.lastSortAsc = !$scope.lastSortAsc;
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

        $scope.AddMember = (member) => {

            var data = <modeltypings.XMeetingUserViewModel>{};
            data.meetingId = $scope.selectedMeetingId;
            data.userId = member.id;
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


        $scope.memberSelected = (item: modeltypings.UserViewModel) => {

            checkIdleRefresh();

            var attendance = <modeltypings.AttendanceViewModel>{};
            attendance.meetingId = $scope.selectedMeetingId;
            attendance.recorderId = $scope.selectedUserId;
            attendance.userId = item.id;
            attendance.id = item.attendanceId;
            attendance.attendTypeId = item.attendTypeId;
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


        $scope.reload = () => {
            location.reload();
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
                member.attendTypeId = data.attendTypeId;
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

                $(window).resize(() => {
                    gridAdjustBySize();
                });


                // data for checkbox.
                $scope.load = $dataService.getAllUsers().then(data => {
                    $scope.userList = <modeltypings.UserViewModel[]>data;
                    $scope.fullUserList = angular.copy($scope.userList);

                    if (devmode) {
                        getMeetingMembers();
                        hub.server.subscribe($scope.selectedMeetingId);
                    }

                });;


                //Data for meetings
                $dataService.getAllMeetings().then(data => {
                    $scope.meetingList = <modeltypings.MeetingViewModel[]>data;
                });;


                //Data for meeting types
                $dataService.getAllMeetingTypes().then(data => {
                    $scope.meetingTypeOptions = <modeltypings.MeetingTypeViewModel[]>data;
                });;
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


    };

    controller.$inject = ['$scope', '$location', 'dataService', '$window', '$uibModal', '$interval'];
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
