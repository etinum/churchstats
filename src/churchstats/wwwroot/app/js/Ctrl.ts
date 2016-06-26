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

    var controller = ($scope, $location, $dataService, $window) => {

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
                        $scope.recorderFieldDisable = true;
                        $scope.meetingFieldDisable = true;
                        $scope.haveMeeting = true;
                        $scope.isNewMeeting = false;
                        $scope.selectedMeetingId = $scope.meetingList[index].id;
                        getMeetingMembers();
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

        function filterMembersBySearch() {
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


        // Event handler
        var searchFieldTimeout;
        $('#globalSearch')
            .keydown(() => {
                if (searchFieldTimeout) {
                    clearTimeout(searchFieldTimeout);
                    searchFieldTimeout = null;
                }

                searchFieldTimeout = setTimeout(filterMembersBySearch, 700);
            });


        $scope.filterUserSelected = (type) => {

            if ($scope.hideAbsent === true) {
               // alert('yes');
            }


        };


        $scope.createNewUser = (name) => {

            if (name.split(' ').length !== 2) {
                alert('Sorry, we need first and last name only');
                return;
            }

            var user = <modeltypings.UserViewModel>{};
            user.firstName = $dataService.capitalizeFirstLetter(name.split(' ')[0]);
            user.lastName = $dataService.capitalizeFirstLetter(name.split(' ')[1]);;
            user.fullName = name;
            user.isAttend = null;


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
                .then((data) => {
                    meeting.id = data;
                    $scope.meetingList.push(meeting);
                    $scope.onBlurMeeting();
                });
        };

        $scope.AddMember = (member) => {

            var data = <modeltypings.XMeetingMemberModel>{};
            data.meetingId = $scope.selectedMeetingId;
            data.memberId = member.id;

            $scope.load = $dataService.addMemberToMeeting(data)
                .then((data) => {
                    // reset fields
                    $scope.addMeetingMembers = '';
                   updateMemberList(member);
                });

        };

        $scope.AddNewUserAsMember = (name) => {

            if (name.split(' ').length !== 2) {
                alert('Sorry, we need first and last name only');
                return;
            }

            var user = <modeltypings.UserViewModel>{};
            user.firstName = $dataService.capitalizeFirstLetter(name.split(' ')[0]);
            user.lastName = $dataService.capitalizeFirstLetter(name.split(' ')[1]);;
            user.fullName = name;
            user.isAttend = null;


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

            updateCounts($scope.memberList);
            //  alert('Update database for: ' + item.fullName + ", present: " + item.isAttend);
        };


        // Execution

        var hub = $.connection.attendHub;

        // signalR server call handlers
        hub.client.ClientCall = () => {
            alert('hello value, world');
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
                $scope.load = $dataService.getAllMeetings().then(data => {
                    $scope.meetingList = <modeltypings.MeetingViewModel[]>data;
                });;


                //Data for meeting types
                $scope.load = $dataService.getAllMeetingTypes().then(data => {
                    $scope.meetingTypeOptions = <modeltypings.MeetingTypeViewModel[]>data;
                });;
            });


    };

    controller.$inject = ['$scope', '$location', 'dataService', '$window'];
    app.controller('homeCtrl', controller);
})(angular.module("repoFormsApp"));



