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

            var index = $dataService.arrayObjectIndexOf($scope.meetingNameOptions, $scope.meetingName, "name", false);
            $scope.$evalAsync(() => {

                if (index === -1) {
                    //alert('Create new user');
                    $scope.isNewMeeting = true;
                    $scope.haveMeeting = false;
                } else {
                    //alert('User exist');
                    $scope.meetingName = $scope.meetingNameOptions[index].name;
                    $scope.recorderFieldDisable = true;
                    $scope.meetingFieldDisable = true;
                    $scope.haveMeeting = true;
                    $scope.isNewMeeting = false;
                }
            });

        };


        // Helper
        var getCounts = (data) => {
            $scope.totalPossible = data.length;
        };


        // Event handler
        $scope.createNewUser = () => {
            
            var user = <modeltypings.UserViewModel>{};
            user.firstName = $scope.recorderName.split(' ')[0];
            user.lastName = $scope.recorderName.split(' ')[1];
            user.fullName = $scope.recorderName;

            $dataService.saveUser(user)
                .then((data) => {
                    user.id = data;
                    $scope.userList.push(user);
                    $scope.onBlurRecorder();
                });
        };

        $scope.meetingTypeChanged = () => {
            alert('hi: ' + $scope.meetingTypeOptions.filter(item => item.id === parseInt($scope.meetingTypeId))[0].label);

        };

        $scope.memberSelected = (item) => {
            alert('Update database for: ' + item.fullName + ", present: " + item.isAttend);
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
                $dataService.getAllUsers().then(data => {
                    $scope.userList = <modeltypings.UserViewModel[]>data;
                    getCounts(data);
                });;


                //Data for meetings
                $dataService.getAllMeetings().then(data => {
                    $scope.meetingNameOptions = <modeltypings.MeetingViewModel[]>data;
                });;


                //Data for meeting types
                $dataService.getAllMeetingTypes().then(data => {
                    $scope.meetingTypeOptions = <modeltypings.MeetingTypeViewModel[]>data;
                });;
            });


    };

    controller.$inject = ['$scope', '$location', 'dataService', '$window'];
    app.controller('homeCtrl', controller);
})(angular.module("repoFormsApp"));



