/// <reference path="../typings/persontest.cs.d.ts" />
/// <reference path="../typings/repoformviewmodel.cs.d.ts" />
/// <reference path="App.ts" />
/// <reference path="/webapi/Scripts/jquery.signalR-2.2.0.min.js" />
app.controller('homeCtrl', ['$scope', '$location', '$http', ($scope, $location, $http) => {


    $scope.GotoAttendanceForm = () => {
        $location.path('/attendance');
    };

    $scope.ViewRepos = () => {

        alert('Build and they will come');

    };

    // if you want initialize some values... 
    var testlist = <modeltypings.IPersonTest[]>[];
    
    $scope.TestClick = () => {

        $http.get('http://localhost/webapi/api/values')
            .then(response => {
                var persons = <modeltypings.IPersonTest[]>response.data;
                $scope.persons = persons;

            },
            response => {
                alert("Connection failed: " + response.status);
            });

    };

    $scope.SendClick = () => {

        $http.post('http://localhost/webapi/api/values', $scope.persons[1])
            .then(response => {
            },
            response => {
                alert("Connection failed: " + response.status);

            });
    }
}]);


app.controller('attendanceCtrl', ['$scope', '$http', ($scope, $http) => {

    // Input constrain variables.. 
    $scope.ng_maxLength = 50;
    $scope.maxLength = 50;


    //$http.get('http://localhost/webapi/api/RepoForm/TypeAheadData')
    //    .then(response => {
    //        var data = <modeltypings.RepoFormTypeAheadModel>response.data;
    //        $scope.typeAheadModel = data;

            
    //        },
    //    response => {
    //        alert("Connection failed: " + response.status);
    //    });

    

    $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

    $scope.getLocation = val => $http.get('//maps.googleapis.com/maps/api/geocode/json', {
        params: {
            address: val + ', USA',
            //componentRestrictions: {
            //    country: 'US'
            //},
            sensor: false
        }
    }).then(response => response.data.results.map(r => r));

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


    $scope.rf = <modeltypings.RepoFormViewModel>{};
    
    $scope.orf = angular.copy($scope.rf); // original repo form, shouldn't be changed... 



    // Dropdown configuration
    $scope.favColorOptions = ['Red', 'Blue', 'Orange', 'Black', 'White'];
    $scope.favoriteIceCreamOptions = ['fudge', 'chocolate', 'vanila', 'almond fudge', 'rocky road'];

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
        $scope.rf.createdDate = new Date();
        $scope.rf.repoDate = new Date();
    };
    $scope.today();
    
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


        $http.post('http://localhost/webapi/api/RepoForm/SaveForm', $scope.rf)
            .then(response => {
            },
            response => {
                alert("Connection failed: " + response.status);

            });


    };
    $scope.cancelForm = () => { };
    $scope.resetForm = () => {
        $scope.today();

    };





}]);

app.controller('viewCtrl', $scope => {
    // Reference the auto-generated proxy for the hub.
    var chat = $.connection.attendenceHub;
    // Create a function that the hub can call back to display messages.
    chat.client.syncRadioButtons = function (name, message) {
        // Display Server message
        alert(name + " " + message);
    };
    // Start the connection.
    $.connection.hub.start().done(function () {
        $('#signalRButton').click(function () {
            // Call the Send method on the hub.
            chat.server.syncRadioButtons($('input:radio[name=singalrTest]:checked').val(), "Empty");
            // Clear text box and reset focus for next comment.
        });
    });
});