
/* TEMPLATE
(app => {

    var service = ($http, $q, $envService) => {
        // Implmentation
    };

    service.$inject = ['$http', '$q', 'envService'];
    app.factory("service_name", service);

})(angular.module("repoFormsApp"));
*/



(app => {

    var service = ($http, $q, $envService) => {


        // Helper methods
        var trimObjectProperties = (objectToTrim) => {
            for (var key in objectToTrim) {
                if (objectToTrim[key] !== null && objectToTrim[key].trim)
                    objectToTrim[key] = objectToTrim[key].trim();
            }
        };


        var arrayUnique = (array) => {
            var a = array.concat();
            for (var i = 0; i < a.length; ++i) {
                for (var j = i + 1; j < a.length; ++j) {
                    if (a[i] === a[j])
                        a.splice(j--, 1);
                }
            }
            return a;
        };

        var callAndDefer = (url, deferObject) => {
            $http.get(url)
                .then(response => {
                    trimObjectProperties(response.data);
                    deferObject.resolve(response.data);
                }, (response) => {
                    alertFailed(response);
                    deferObject.reject(response);
                });
        }

        function arrayObjectIndexOf(myArray, searchTerm, property, caseSensitive) {

            caseSensitive = typeof caseSensitive !== 'undefined' ? caseSensitive : true;

            var len = myArray.length;
            if (caseSensitive) {
                for (var i = 0; i < len; i++) {
                    if (myArray[i][property] === searchTerm) return i;
                }
                return -1;
            } else {
                searchTerm = searchTerm.toLowerCase();
                for (var e = 0; e < len; e++) {
                    if (myArray[e][property].toLowerCase() === searchTerm) return e;
                }
                return -1;
            }
        }


        var baseWebApiUrl = $envService.read('apiUrl');

        // Error messages
        var alertFailed = (response) => {
            alert("There was a problem with the back end call, here is your status code: " + response.status);
        };


        // Testing service calls, can be removed later. 
        var getAllUsers = () => {
            var url = baseWebApiUrl + 'api/User/Get';
            var deferred = $q.defer();

            callAndDefer(url, deferred);

            return deferred.promise;
        };

        var getAllMeetings = () => {
            var url = baseWebApiUrl + 'api/Meeting/Get';
            var deferred = $q.defer();

            callAndDefer(url, deferred);
            return deferred.promise;
        };

        var getUsersForMeeting = (index) => {
            var url = baseWebApiUrl + 'api/User/GetMembersForMeeting/' + index;
            var deferred = $q.defer();

            callAndDefer(url, deferred);
            return deferred.promise;
        };

        var getAllMeetingTypes = () => {
            var url = baseWebApiUrl + 'api/Meeting/GetMeetingType';
            var deferred = $q.defer();

            callAndDefer(url, deferred);
            return deferred.promise;
        };

        var addPerson = (person) => {
            var url = baseWebApiUrl + 'api/values/post';
            var deferred = $q.defer();

            $http.post(url, person)
                .then(() => {
                    alert("Successfully saved.");
                    deferred.resolve();
                }, (response) => {
                    alertFailed(response);
                    deferred.reject(response);
                });
            return deferred.promise;
        };


       // Google api 
        var getLocation = (val) => {
            var url = baseWebApiUrl + 'api/RepoForm/SaveForm';
            var deferred = $q.defer();

            $http.get('//maps.googleapis.com/maps/api/geocode/json',
                {
                    params: {
                        address: val + ', USA',
                        sensor: false
                    }
                })
                .then((response) => {
                    deferred.resolve(response.data.results.map(r => r));
                }, (response) => {
                    alertFailed(response);
                    deferred.reject(response);
                });
            return deferred.promise;
        }

        // TypeAhead data
        var getTypeAheadData = () => {
            var url = baseWebApiUrl + 'api/RepoForm/TypeAheadData';
            var deferred = $q.defer();

            $http.get(url)
                .then(response => {
                    trimObjectProperties(response.data);
                    deferred.resolve(response.data);
                }, (response) => {
                    alertFailed(response);
                    deferred.reject(response);
                });
            return deferred.promise;
        };


        // Misc
        var getUser = () => {
            var url = baseWebApiUrl + 'api/RepoForm/GetUser';
            var deferred = $q.defer();

            $http.get(url)
                .then(response => {
                    trimObjectProperties(response.data);
                    deferred.resolve(response.data);
                }, (response) => {
                    alertFailed(response);
                    deferred.reject(response);
                });
            return deferred.promise;
        };

        // Misc
        var getForms = () => {
            var url = baseWebApiUrl + 'api/RepoForm/GetForms';
            var deferred = $q.defer();

            $http.get(url)
                .then(response => {
                    trimObjectProperties(response.data);
                    deferred.resolve(response.data);
                }, (response) => {
                    alertFailed(response);
                    deferred.reject(response);
                });
            return deferred.promise;
        };

        var getForm = (id) => {
            var url = baseWebApiUrl + 'api/RepoForm/GetForm';
            var deferred = $q.defer();

            $http.get(url, {
                params: {
                    id: id
                }
            })
                .then(response => {
                    trimObjectProperties(response.data);
                    deferred.resolve(response.data);
                }, (response) => {
                    alertFailed(response);
                    deferred.reject(response);
                });
            return deferred.promise;
        };

        return {
            getUser: getUser,
            getAllUsers: getAllUsers,
            getAllMeetings: getAllMeetings,
            getAllMeetingTypes: getAllMeetingTypes,
            getUsersForMeeting: getUsersForMeeting,
            addPerson: addPerson,
            getLocation: getLocation,
            getForms: getForms,
            getForm: getForm,
            // Helper Methods
            trimObjectProperties: trimObjectProperties,
            arrayUnique: arrayUnique,
            arrayObjectIndexOf: arrayObjectIndexOf,
            // Static list 
            favColorOptions: ['Red', 'Blue', 'Orange', 'Black', 'White'],
            favoriteIceCreamOptions: ['fudge', 'chocolate', 'vanila', 'almond fudge', 'rocky road'],
            states: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']

        };
    };

    service.$inject = ['$http', '$q', 'envService'];
    app.factory("dataService", service);

})(angular.module("repoFormsApp"));


