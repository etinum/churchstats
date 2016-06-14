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
        $.connection.hub.start()
            .done(function () {
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });
        $scope.rf = {};
        $scope.haveRecorder = false;
        $scope.recorderFieldDisable = false;
        $scope.meetingFieldDisable = false;
        $scope.isNewUser = false;
        $scope.isNewMeeting = false;
        $scope.haveMeeting = false;
        $scope.onBlurRecorder = function () {
            if (!$scope.rf.recorderName) {
                return;
            }
            var index = $dataService.arrayObjectIndexOf($scope.userList, $scope.rf.recorderName, "label", false);
            if (index === -1) {
                $scope.isNewUser = true;
            }
            else {
                $scope.rf.recorderName = $scope.userList[index].label;
                $scope.haveRecorder = true;
                $scope.isNewUser = false;
            }
        };
        $scope.onBlurMeeting = function () {
            if (!$scope.rf.meetingName) {
                return;
            }
            var index = $dataService.arrayObjectIndexOf($scope.meetingNameOptions, $scope.rf.meetingName, "label", false);
            if (index === -1) {
                $scope.isNewMeeting = true;
                $scope.haveMeeting = false;
            }
            else {
                $scope.rf.recorderName = $scope.userList[index].label;
                $scope.recorderFieldDisable = true;
                $scope.meetingFieldDisable = true;
                $scope.haveMeeting = true;
                $scope.isNewMeeting = false;
            }
        };
        $scope.userList = [
            {
                'label': 'Eric Tran',
                'id': 1,
                'isAttend': null
            },
            {
                'label': 'Daniel Delamare',
                'id': 2,
                'isAttend': null
            },
            {
                'label': 'Milky Man',
                'id': 3,
                'isAttend': null
            },
            {
                'label': 'Chris Chang',
                'id': 4,
                'isAttend': null
            },
            {
                'label': 'Bill Franko',
                'id': 5,
                'isAttend': null
            }
        ];
        $scope.meetingTypeOptions = [
            {
                'label': 'Bible Study',
                'id': 1
            },
            {
                'label': '2s 3s',
                'id': 2
            },
            {
                'label': 'Cluster LT Meeting',
                'id': 3
            },
            {
                'label': 'Lord\'s Table',
                'id': 4
            },
            {
                'label': 'Small Group',
                'id': 5
            }
        ];
        $scope.meetingNameOptions = [
            {
                'label': 'Folsom Home Meeting',
                'id': 1
            },
            {
                'label': 'Fair Oaks Small Group',
                'id': 2
            },
            {
                'label': 'Sacrament Cluster LT Meeting',
                'id': 3
            },
            {
                'label': 'Sacramento Lord\'s Table',
                'id': 4
            },
            {
                'label': 'Chang\'s Natomas Friday Night',
                'id': 5
            }
        ];
        $scope.meetingTypeChanged = function () {
            alert('hi: ' + $scope.meetingTypeOptions.filter(function (item) { return item.id === parseInt($scope.rf.meetingTypeId); })[0].label);
        };
        $scope.memberSelected = function (item) {
            alert('Update database for: ' + item.label + ", present: " + item.isAttend);
        };
        $scope.GotoRepoForm = function () {
            $location.path('/repoform');
        };
        $scope.ViewRepos = function () {
            $location.path('/viewReports');
        };
        $scope.$watch(function () { return $window.userdata; }, function (n) {
            if (n !== undefined) {
                $scope.welcome = "Pick something sir, " + $window.userdata;
            }
        });
        $scope.TestClick = function () {
            $dataService.getPersons()
                .then(function (data) {
                var testlist = data;
                $scope.tempPerson = testlist[0];
                alert($scope.tempPerson.age);
            });
        };
        $scope.SendClick = function () {
            $dataService.addPerson($scope.tempPerson);
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