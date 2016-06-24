(function (app) {
    var controller = function ($scope, $window, $dataService, $envService, $rootScope) {
        $scope.baseWebApiUrl = $envService.read('apiUrl');
    };
    controller.$inject = ['$scope', '$window', 'dataService', 'envService', '$rootScope'];
    app.controller('masterCtrl', controller);
})(angular.module("repoFormsApp"));
(function (app) {
    var controller = function ($scope, $location, $dataService, $window) {
        var hub = $.connection.attendHub;
        hub.client.ClientCall = function () {
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
            if (!$scope.rf.recorderName) {
                return;
            }
            var index = $dataService.arrayObjectIndexOf($scope.userList, $scope.rf.recorderName, "fullName", false);
            $scope.$evalAsync(function () {
                if (index === -1) {
                    $scope.haveRecorder = false;
                    $scope.isNewUser = true;
                }
                else {
                    $scope.rf.recorderName = $scope.userList[index].fullName;
                    $scope.haveRecorder = true;
                    $scope.isNewUser = false;
                }
            });
        };
        $scope.onBlurMeeting = function () {
            if (!$scope.rf.meetingName) {
                return;
            }
            var index = $dataService.arrayObjectIndexOf($scope.meetingNameOptions, $scope.rf.meetingName, "name", false);
            $scope.$evalAsync(function () {
                if (index === -1) {
                    $scope.isNewMeeting = true;
                    $scope.haveMeeting = false;
                }
                else {
                    $scope.rf.meetingName = $scope.meetingNameOptions[index].name;
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
        $scope.meetingTypeChanged = function () {
            alert('hi: ' + $scope.meetingTypeOptions.filter(function (item) { return item.id === parseInt($scope.rf.meetingTypeId); })[0].label);
        };
        $scope.memberSelected = function (item) {
            alert('Update database for: ' + item.fullName + ", present: " + item.isAttend);
        };
    };
    controller.$inject = ['$scope', '$location', 'dataService', '$window'];
    app.controller('homeCtrl', controller);
})(angular.module("repoFormsApp"));
(function (app) {
    var controller = function ($scope, $dataService, $window, $routeParams) {
        $scope.ng_maxLength = 50;
        $scope.maxLength = 50;
        $dataService.getTypeAheadData()
            .then(function (data) {
            $scope.typeAheadModel = data;
        });
        $scope.states = $dataService.states;
        $scope.getLocation = $dataService.getLocation;
        $scope.onSelect = function ($item, $type) {
            var item = $item;
            var street = '';
            var stnumber = '';
            var ac = 0;
            if ($type === 'storage') {
                for (ac = 0; ac < item.address_components.length; ac++) {
                    if (item.address_components[ac].types[0] === "street_number") {
                        stnumber = item.address_components[ac].long_name;
                    }
                    if (item.address_components[ac].types[0] === "route") {
                        street = item.address_components[ac].short_name;
                    }
                    if (item.address_components[ac].types[0] === "locality") {
                        $scope.rf.storageCity = item.address_components[ac].long_name;
                    }
                    if (item.address_components[ac].types[0] === "administrative_area_level_1") {
                        $scope.rf.storageState = item.address_components[ac].short_name;
                    }
                    if (item.address_components[ac].types[0] === "postal_code") {
                        $scope.rf.storageZip = item.address_components[ac].long_name;
                    }
                }
                if (stnumber !== null && street !== null) {
                    $scope.rf.storageAddress = (stnumber + ' ' + street).trim();
                }
            }
            else if ($type === 'recovery') {
                for (ac = 0; ac < item.address_components.length; ac++) {
                    if (item.address_components[ac].types[0] === "street_number") {
                        stnumber = item.address_components[ac].long_name;
                    }
                    if (item.address_components[ac].types[0] === "route") {
                        street = item.address_components[ac].short_name;
                    }
                    if (item.address_components[ac].types[0] === "locality") {
                        $scope.rf.recoveryCity = item.address_components[ac].long_name;
                    }
                    if (item.address_components[ac].types[0] === "administrative_area_level_1") {
                        $scope.rf.recoveryState = item.address_components[ac].short_name;
                    }
                    if (item.address_components[ac].types[0] === "postal_code") {
                        $scope.rf.recoveryZip = item.address_components[ac].long_name;
                    }
                }
                if (stnumber !== null && street !== null) {
                    $scope.rf.recoveryAddress = (stnumber + ' ' + street).trim();
                }
            }
        };
        $scope.submitted = false;
        $scope.favColorOptions = $dataService.favColorOptions;
        $scope.favoriteIceCreamOptions = $dataService.favoriteIceCreamOptions;
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];
        $scope.enumPopupType = {
            CREATED: 1,
            REPO: 2,
            SIGNED: 3
        };
        $scope.today = function () {
            var today = new Date().toString();
            $scope.rf.createdDate = new Date(today);
            $scope.rf.repoDate = new Date(today);
            $scope.rf.initializedDate = null;
        };
        $scope.openDatePopup = function (popup) {
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
        $scope.submitForm = function () {
            $scope.submitted = true;
            $scope.$broadcast('show-errors-event');
            if ($scope.myForm.$invalid)
                return;
            $dataService.saveForm($scope.rf).then(function () { return location.reload(); });
        };
        $scope.cancelForm = function () {
            $window.history.back();
        };
        $scope.resetForm = function () {
            location.reload();
        };
        var setRfDate = function (data) {
            $scope.rf.repoDate = data.repoDate ? new Date(data.repoDate.toString()) : null;
            $scope.rf.createdDate = data.createdDate ? new Date(data.createdDate.toString()) : null;
            $scope.rf.initializedDate = data.initializedDate ? new Date(data.initializedDate.toString()) : null;
        };
        if (!angular.isUndefined($routeParams.id) && !isNaN($routeParams.id)) {
            $dataService.getForm($routeParams.id)
                .then(function (data) {
                $scope.rf = data;
                setRfDate(data);
                $scope.orf = angular.copy($scope.rf);
            });
        }
        else {
            $scope.rf = {};
            $scope.orf = angular.copy($scope.rf);
            $scope.rf.repoDate = new Date("06/17/2016");
            $scope.today();
        }
    };
    controller.$inject = ['$scope', 'dataService', '$window', '$routeParams'];
    app.controller('repoCtrl', controller);
})(angular.module("repoFormsApp"));
(function (app) {
    var controller = function ($scope, $dataService, $location) {
        var hub = $.connection.repoHub;
        $scope.update = function () {
            $dataService.getForms()
                .then(function (data) {
                $scope.fms = data;
            });
        };
        $scope.edit = function (row) {
            var rowee = row;
            $location.path('/repoform/' + rowee.id);
        };
        hub.client.UpdateList = function (updatedForm) {
            var index = $dataService.arrayObjectIndexOf($scope.fms, updatedForm.id, "id");
            if (index === -1) {
                $scope.fms.push(updatedForm);
                $scope.$apply();
            }
            else {
                $scope.fms.splice(index, 1);
                $scope.$apply();
                $scope.fms.splice(index, 0, updatedForm);
                $scope.$apply();
            }
        };
        hub.client.SendAlert = function (value) {
            alert('hello value: ' + value);
        };
        hub.client.test2 = function () {
            ;
            alert("first testing?");
        };
        hub.client.test = function () {
            alert("testing works");
        };
        $.connection.hub.start()
            .done(function () {
            if (!$scope.$$phase) {
                $scope.$apply();
            }
            $scope.update();
        });
    };
    controller.$inject = ['$scope', 'dataService', '$location'];
    app.controller('viewCtrl', controller);
})(angular.module("repoFormsApp"));
//# sourceMappingURL=Ctrl.js.map