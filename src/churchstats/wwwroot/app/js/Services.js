(function (app) {
    var service = function ($http, $q, $envService) {
        var arrayUnique = function (array) {
            var a = array.concat();
            for (var i = 0; i < a.length; ++i) {
                for (var j = i + 1; j < a.length; ++j) {
                    if (a[i] === a[j])
                        a.splice(j--, 1);
                }
            }
            return a;
        };
        function isFalse(obj) {
            if (obj === null || obj === false || obj === undefined) {
                return false;
            }
            return true;
        }
        ;
        function isTrue(obj) {
            if (obj === true) {
                return true;
            }
            return false;
        }
        ;
        function arrayObjectIndexOf(myArray, searchTerm, property, caseSensitive) {
            caseSensitive = typeof caseSensitive !== 'undefined' ? caseSensitive : true;
            var len = myArray.length;
            if (caseSensitive) {
                for (var i = 0; i < len; i++) {
                    if (myArray[i][property] === searchTerm)
                        return i;
                }
                return -1;
            }
            else {
                searchTerm = searchTerm.toLowerCase();
                for (var e = 0; e < len; e++) {
                    if (myArray[e][property].toLowerCase() === searchTerm)
                        return e;
                }
                return -1;
            }
        }
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        var baseWebApiUrl = $envService.read('apiUrl');
        var alertFailed = function (response) {
            alert("There was a problem with the back end call, here is your status code: " + response.status);
        };
        var getAllUsers = function () {
            var url = baseWebApiUrl + 'api/User/GetAllUsers';
            var deferred = $q.defer();
            $http.get(url)
                .then(function (response) {
                deferred.resolve(response.data);
            }, function (response) {
                alertFailed(response);
                deferred.reject(response);
            });
            return deferred.promise;
        };
        var saveUser = function (data) {
            var url = baseWebApiUrl + 'api/User/SaveUser';
            var deferred = $q.defer();
            $http.post(url, data)
                .then(function (response) {
                deferred.resolve(response);
            }, function (response) {
                alertFailed(response);
                deferred.reject(response);
            });
            return deferred.promise;
        };
        var getMeetingMembers = function (id) {
            var url = baseWebApiUrl + 'api/meeting/GetMeetingMembers';
            var deferred = $q.defer();
            $http.get(url, {
                params: {
                    meetingId: id
                }
            })
                .then(function (response) {
                deferred.resolve(response.data);
            }, function (response) {
                alertFailed(response);
                deferred.reject(response);
            });
            return deferred.promise;
        };
        var getAllMeetings = function () {
            var url = baseWebApiUrl + 'api/Meeting/GetAllMeetings';
            var deferred = $q.defer();
            $http.get(url)
                .then(function (response) {
                deferred.resolve(response.data);
            }, function (response) {
                alertFailed(response);
                deferred.reject(response);
            });
            return deferred.promise;
        };
        var getAllMeetingTypes = function () {
            var url = baseWebApiUrl + 'api/Meeting/GetAllMeetingTypes';
            var deferred = $q.defer();
            $http.get(url)
                .then(function (response) {
                deferred.resolve(response.data);
            }, function (response) {
                alertFailed(response);
                deferred.reject(response);
            });
            return deferred.promise;
        };
        var addMemberToMeeting = function (data) {
            var url = baseWebApiUrl + 'api/Meeting/AddMemberToMeeting';
            var deferred = $q.defer();
            $http.post(url, data)
                .then(function (response) {
                deferred.resolve(response);
            }, function (response) {
                alertFailed(response);
                deferred.reject(response);
            });
            return deferred.promise;
        };
        var saveMeeting = function (data) {
            var url = baseWebApiUrl + 'api/Meeting/SaveMeeting';
            var deferred = $q.defer();
            $http.post(url, data)
                .then(function (response) {
                deferred.resolve(response);
            }, function (response) {
                alertFailed(response);
                deferred.reject(response);
            });
            return deferred.promise;
        };
        var getLocation = function (val) {
            var url = baseWebApiUrl + 'api/RepoForm/SaveForm';
            var deferred = $q.defer();
            $http.get('//maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address: val + ', USA',
                    sensor: false
                }
            })
                .then(function (response) {
                deferred.resolve(response.data.results.map(function (r) { return r; }));
            }, function (response) {
                alertFailed(response);
                deferred.reject(response);
            });
            return deferred.promise;
        };
        return {
            getAllUsers: getAllUsers,
            saveUser: saveUser,
            getMeetingMembers: getMeetingMembers,
            getAllMeetings: getAllMeetings,
            addMemberToMeeting: addMemberToMeeting,
            getAllMeetingTypes: getAllMeetingTypes,
            saveMeeting: saveMeeting,
            getLocation: getLocation,
            arrayUnique: arrayUnique,
            arrayObjectIndexOf: arrayObjectIndexOf,
            isFalse: isFalse,
            isTrue: isTrue,
            capitalizeFirstLetter: capitalizeFirstLetter,
            states: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']
        };
    };
    service.$inject = ['$http', '$q', 'envService'];
    app.factory("dataService", service);
})(angular.module("repoFormsApp"));
//# sourceMappingURL=Services.js.map