/// <reference path="../typings/persontest.cs.d.ts" />
/// <reference path="../typings/angular-environment.d.ts" />
/// <reference path="../typings/signalr.d.ts" />
/// <reference path="../typings/repoformviewmodel.cs.d.ts" />

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


        var hub = $.connection.attendHub;

        // Testing signalR
        hub.client.ClientCall = () => {
            alert('hello value, world');
        };

        $.connection.hub.start();

        $scope.rf = {};
        $scope.haveRecorder = false;
        $scope.recorderFieldDisable = false;
        $scope.meetingFieldDisable = false;
        $scope.isNewUser = false;
        $scope.isNewMeeting = false;
        $scope.haveMeeting = false;


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
            //alert('recorder selected: ' + $scope.rf.recorderId);
            if (!$scope.rf.recorderName) {
                return;
            }
          
            var index = $dataService.arrayObjectIndexOf($scope.userList, $scope.rf.recorderName, "label", false);
            $scope.$evalAsync(() => {
                if (index === -1) {
                    //alert('Create new user');
                    $scope.haveRecorder = false;
                    $scope.isNewUser = true;
                } else {
                    //alert('User exist');
                    $scope.rf.recorderName = $scope.userList[index].label;
                    $scope.haveRecorder = true;
                    $scope.isNewUser = false;
                }
            });

        };

        $scope.onBlurMeeting = () => {

            if (!$scope.rf.meetingName) {
                return;
            }

            var index = $dataService.arrayObjectIndexOf($scope.meetingNameOptions, $scope.rf.meetingName, "label", false);
            $scope.$evalAsync(() => {

                if (index === -1) {
                    //alert('Create new user');
                    $scope.isNewMeeting = true;
                    $scope.haveMeeting = false;
                } else {
                    //alert('User exist');
                    $scope.rf.meetingName = $scope.meetingNameOptions[index].label;

                    $dataService.getUsersForMeeting($scope.meetingNameOptions[index].id).then(data => {
                        $scope.meetingUsers = data;
                        $scope.recorderFieldDisable = true;
                        $scope.meetingFieldDisable = true;
                        $scope.haveMeeting = true;
                        $scope.isNewMeeting = false;
                        //alert('|' + JSON.stringify(data) + '|');
                    });
                }
            });

        };

        // data for checkbox.
        $dataService.getAllUsers().then(data => {
            $scope.userList = data;
        });

        //Data for meetings
        $dataService.getAllMeetings().then(data => {
            $scope.meetingNameOptions = data;
        });


        //Data for meeting types
        $dataService.getAllMeetingTypes().then(data => {
            $scope.meetingTypeOptions = data;
        });




        $scope.meetingTypeChanged = () => {
            alert('hi: ' + $scope.meetingTypeOptions.filter(item => item.id === parseInt($scope.rf.meetingTypeId))[0].label);

        };

        $scope.memberSelected = (item) => {
            alert('Update database for: ' + item.label + ", present: " + item.isAttend);
        };

        $scope.GotoRepoForm = () => {
            $location.path('/repoform');
        };

        $scope.ViewRepos = () => {
            $location.path('/viewReports');
        };


        // watch to see if global variable has been set from master control before using it in the current controller.
        $scope.$watch(() => $window.userdata, (n) => {
            if (n !== undefined) {
                $scope.welcome = "Pick something sir, " + $window.userdata;
            }
        });


        // TODO: Delete after you don't need this anymore. 
        $scope.TestClick = () => {
            $dataService.getPersons()
                .then(data => {
                    var testlist = <modeltypings.IPersonTest[]>data;
                    $scope.tempPerson = testlist[0];
                    alert($scope.tempPerson.age);
                });
        }

        $scope.SendClick = () => {
            $dataService.addPerson($scope.tempPerson);
        }
    };

    controller.$inject = ['$scope', '$location', 'dataService', '$window'];
    app.controller('homeCtrl', controller);
})(angular.module("repoFormsApp"));

(app => {
    var controller = ($scope, $dataService, $window, $routeParams) => {



        // Input constrain variables..
        $scope.ng_maxLength = 50;
        $scope.maxLength = 50;

        $dataService.getTypeAheadData()
            .then(data => {
                $scope.typeAheadModel = <modeltypings.RepoFormTypeAheadModel>data;
            });


        $scope.states = $dataService.states;
        $scope.getLocation = $dataService.getLocation;
        $scope.onSelect = ($item, $type) => {

            // This is to cover the different address fields
            var item = $item;

            var street = '';
            var stnumber = '';
            var ac = 0;

            if ($type === 'storage') {
                for (ac = 0; ac < item.address_components.length; ac++) {
                    if (item.address_components[ac].types[0] === "street_number") { stnumber = item.address_components[ac].long_name }
                    if (item.address_components[ac].types[0] === "route") { street = item.address_components[ac].short_name }
                    if (item.address_components[ac].types[0] === "locality") { $scope.rf.storageCity = item.address_components[ac].long_name }
                    if (item.address_components[ac].types[0] === "administrative_area_level_1") { $scope.rf.storageState = item.address_components[ac].short_name }
                    if (item.address_components[ac].types[0] === "postal_code") { $scope.rf.storageZip = item.address_components[ac].long_name }
                }
                if (stnumber !== null && street !== null) {
                    $scope.rf.storageAddress = (stnumber + ' ' + street).trim();
                }
            } else if ($type === 'recovery') {
                for (ac = 0; ac < item.address_components.length; ac++) {
                    if (item.address_components[ac].types[0] === "street_number") { stnumber = item.address_components[ac].long_name }
                    if (item.address_components[ac].types[0] === "route") { street = item.address_components[ac].short_name }
                    if (item.address_components[ac].types[0] === "locality") { $scope.rf.recoveryCity = item.address_components[ac].long_name }
                    if (item.address_components[ac].types[0] === "administrative_area_level_1") { $scope.rf.recoveryState = item.address_components[ac].short_name }
                    if (item.address_components[ac].types[0] === "postal_code") { $scope.rf.recoveryZip = item.address_components[ac].long_name }
                }
                if (stnumber !== null && street !== null) {
                    $scope.rf.recoveryAddress = (stnumber + ' ' + street).trim();
                }
            }
        };

        $scope.submitted = false;

        // Dropdown configuration
        $scope.favColorOptions = $dataService.favColorOptions;
        $scope.favoriteIceCreamOptions = $dataService.favoriteIceCreamOptions;

        // DATE configurations

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.enumPopupType = {
            CREATED: 1,
            REPO: 2,
            SIGNED: 3
        }

        $scope.today = () => {
            var today = new Date().toString();
            $scope.rf.createdDate = new Date(today);
            $scope.rf.repoDate = new Date(today);
            $scope.rf.initializedDate = null;
        };


        $scope.openDatePopup = popup => {
            switch (popup) {
                case $scope.enumPopupType.CREATED:
                    $scope.datePopupStatus.created = true;
                    break;
                case $scope.enumPopupType.REPO:
                    $scope.datePopupStatus.repo = true;
                    break;
                case $scope.enumPopupType.SIGNED:
                    $scope.datePopupStatus.signed = true;
                    break;
                default:
            }
        };


        $scope.datePopupStatus = {
            created: false,
            repo: false,
            signed: false
        };

        // Form button handling

        $scope.submitForm = () => {

            $scope.submitted = true;

            $scope.$broadcast('show-errors-event');
            if ($scope.myForm.$invalid)
                return;

            $dataService.saveForm($scope.rf).then(() => location.reload());

        };
        $scope.cancelForm = () => {
            $window.history.back();
        };
        $scope.resetForm = () => {
            location.reload();

        };


        var setRfDate = (data: modeltypings.RepoFormViewModel) => {
            $scope.rf.repoDate = data.repoDate ? new Date(data.repoDate.toString()) : null;
            $scope.rf.createdDate = data.createdDate ? new Date(data.createdDate.toString()) : null;
            $scope.rf.initializedDate = data.initializedDate ? new Date(data.initializedDate.toString()) : null;
        }; 


        if (!angular.isUndefined($routeParams.id) && !isNaN($routeParams.id)) {
            //$scope.id = parseInt($routeParams.id);
            $dataService.getForm($routeParams.id)
                .then(data => {
                    $scope.rf = <modeltypings.RepoFormViewModel>data;
                    setRfDate(data);
                    $scope.orf = angular.copy($scope.rf); // original repo form, shouldn't be changed...
                });
        } else {
            $scope.rf = <modeltypings.RepoFormViewModel>{};
            $scope.orf = angular.copy($scope.rf); // original repo form, shouldn't be changed...
            $scope.rf.repoDate = new Date("06/17/2016");
            $scope.today();
        }


    };


    controller.$inject = ['$scope', 'dataService', '$window', '$routeParams'];
    app.controller('repoCtrl', controller);
})(angular.module("repoFormsApp"));


(app => {
    var controller = ($scope, $dataService, $location) => {


        var hub = $.connection.repoHub;

        //$scope.username = $window.userdata;
        $scope.update = () => {
            $dataService.getForms()
                .then(data => {
                    $scope.fms = <modeltypings.RepoFormViewModel[]>data;
                });
        };

        $scope.edit = (row) => {
            var rowee = <modeltypings.RepoFormViewModel>row;
            $location.path('/repoform/' + rowee.id);

        };



        hub.client.UpdateList = (updatedForm: modeltypings.RepoFormViewModel) => {

            var index = $dataService.arrayObjectIndexOf($scope.fms, updatedForm.id, "id");

            if (index === -1) {
                $scope.fms.push(updatedForm);
                $scope.$apply();
            } else {
                $scope.fms.splice(index, 1);
                $scope.$apply();
                $scope.fms.splice(index, 0, updatedForm);
                $scope.$apply();
            }

        };


        // Testing signalR
        hub.client.SendAlert = (value) => {
            alert('hello value: ' + value);
        };

        hub.client.test2 = () => {;
            alert("first testing?");
        };

        hub.client.test = () => {
            alert("testing works");
        };


        $.connection.hub.start()
            .done(() => {
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
                //hub.server.send("hi", "there");
                $scope.update();
            });
    };

    controller.$inject = ['$scope', 'dataService', '$location'];
    app.controller('viewCtrl', controller);
})(angular.module("repoFormsApp"));