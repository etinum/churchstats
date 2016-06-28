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

    var controller = ($scope, $location, $dataService, $window, $uibModal) => {

        // controller variables
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
        $scope.sortNameType = 'FA';

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
                }
            });

        };


        // Helper
        var updateCounts = (data) => {
            $scope.counts.totalPossible = data.length;
            $scope.counts.unknown = data.filter(item => item.isAttend === null).length;
            $scope.counts.absent = data.filter(item => item.isAttend === false).length;
            $scope.counts.present = data.filter(item => item.isAttend === true).length;
        };

        var updateUserList = (user) => {
            $scope.userList.push(user);
            $scope.fullUserList.push(user);
        };


        var updateMemberList = (member) => {
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


        var createUser = (name) => {

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
            user.isAttend = null;

            return user;

        };



        // Event handler

        $scope.forceRefreshList = () => {
            $.connection.hub.start();
            getMeetingMembers();
        }
            


        $scope.sortNameAlpha = (type) => {

            $scope.sortNameType = type;
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

        $scope.createNewUser = (name) => {

            var user = createUser(name);
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

            var data = <modeltypings.XMeetingMemberModel>{};
            data.meetingId = $scope.selectedMeetingId;
            data.memberId = member.id;
            updateMemberList(member);

            $scope.load = $dataService.addMemberToMeeting(data)
                .then(() => {
                    // reset fields
                    $scope.addMeetingMembers = '';
                });

        };

        $scope.AddNewUserAsMember = (name) => {

            var user = createUser(name);
            if (user == null) {
                return;
            }

            $scope.load = $dataService.saveUser(user)
                .then((response) => {
                    user.id = response.data;

                    var xref = <modeltypings.XMeetingMemberModel>{};
                    xref.meetingId = $scope.selectedMeetingId;
                    xref.memberId = user.id;

                    $scope.load = $dataService.addMemberToMeeting(xref)
                        .then((data) => {
                            // reset fields
                            $scope.addMeetingMembers = '';
                            updateMemberList(user);
                        });
                });
        };


        $scope.memberSelected = (item) => {


            var attendance = <modeltypings.AttendanceViewModel>{};
            attendance.meetingId = $scope.selectedMeetingId;
            attendance.recorderId = $scope.selectedUserId;
            attendance.userId = item.id;
            attendance.id = item.attendanceId;
            attendance.isAttend = item.isAttend;
            attendance.meetingDate = new Date();

            $dataService.saveAttendance(attendance)
                .then((response) => {
                    attendance.id = response.data;
                });

            updateCounts($scope.memberList);
            //  alert('Update database for: ' + item.fullName + ", present: " + item.isAttend);
        };


        $scope.reload = () => {
            location.reload();
        };


        // Execution

        // signalR server call handlers
        hub.client.ClientCall = () => {
            alert('hello value, world');
        };

        hub.client.UpdateAttendance = (data) => {

            var member = $scope.fullMemberList.filter(item => item.id === data.userId)[0];
            var recorder = $scope.fullUserList.filter(item => item.id === data.recorderId)[0];

            $scope.$evalAsync(() => {
                if (data.isAttend != null) {
                    member.isAttend = data.isAttend;
                }
                if (recorder != null) {
                    member.recorderId = data.recorderId;
                    member.recorderName = recorder.fullName;
                    member.lastRecorded = data.lastUpdated;
                }
                member.attendanceId = data.id;
                filterMembersBySearch();

            });

            //alert('update made: ' + member.fullName);

        };


        $.connection.hub.start()
            .done(() => {

                // Initiation... 

                // data for checkbox.
                $scope.load = $dataService.getAllUsers().then(data => {
                    $scope.userList = <modeltypings.UserViewModel[]>data;
                    $scope.fullUserList = angular.copy($scope.userList);
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

    controller.$inject = ['$scope', '$location', 'dataService', '$window', '$uibModal'];
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
