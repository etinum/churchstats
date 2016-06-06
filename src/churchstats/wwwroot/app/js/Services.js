(function (app) {
    var service = function ($http, $q, $envService) {
        var trimObjectProperties = function (objectToTrim) {
            for (var key in objectToTrim) {
                if (objectToTrim[key] !== null && objectToTrim[key].trim)
                    objectToTrim[key] = objectToTrim[key].trim();
            }
        };
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
        function arrayObjectIndexOf(myArray, searchTerm, property) {
            for (var i = 0, len = myArray.length; i < len; i++) {
                if (myArray[i][property] === searchTerm)
                    return i;
            }
            return -1;
        }
        var baseWebApiUrl = $envService.read('apiUrl');
        var alertFailed = function (response) {
            alert("There was a problem with the back end call, here is your status code: " + response.status);
        };
        var getPersons = function () {
            var url = baseWebApiUrl + 'api/values/get';
            var deferred = $q.defer();
            $http.get(url)
                .then(function (response) {
                trimObjectProperties(response.data);
                deferred.resolve(response.data);
            }, function (response) {
                alertFailed(response);
                deferred.reject(response);
            });
            return deferred.promise;
        };
        var addPerson = function (person) {
            var url = baseWebApiUrl + 'api/values/post';
            var deferred = $q.defer();
            $http.post(url, person)
                .then(function () {
                alert("Successfully saved.");
                deferred.resolve();
            }, function (response) {
                alertFailed(response);
                deferred.reject(response);
            });
            return deferred.promise;
        };
        var saveForm = function (formdata) {
            var url = baseWebApiUrl + 'api/RepoForm/SaveForm';
            var deferred = $q.defer();
            $http.post(url, formdata)
                .then(function () {
                alert("Submission successful.");
                deferred.resolve();
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
        var getTypeAheadData = function () {
            var url = baseWebApiUrl + 'api/RepoForm/TypeAheadData';
            var deferred = $q.defer();
            $http.get(url)
                .then(function (response) {
                trimObjectProperties(response.data);
                deferred.resolve(response.data);
            }, function (response) {
                alertFailed(response);
                deferred.reject(response);
            });
            return deferred.promise;
        };
        var getUser = function () {
            var url = baseWebApiUrl + 'api/RepoForm/GetUser';
            var deferred = $q.defer();
            $http.get(url)
                .then(function (response) {
                trimObjectProperties(response.data);
                deferred.resolve(response.data);
            }, function (response) {
                alertFailed(response);
                deferred.reject(response);
            });
            return deferred.promise;
        };
        var getForms = function () {
            var url = baseWebApiUrl + 'api/RepoForm/GetForms';
            var deferred = $q.defer();
            $http.get(url)
                .then(function (response) {
                trimObjectProperties(response.data);
                deferred.resolve(response.data);
            }, function (response) {
                alertFailed(response);
                deferred.reject(response);
            });
            return deferred.promise;
        };
        var getForm = function (id) {
            var url = baseWebApiUrl + 'api/RepoForm/GetForm';
            var deferred = $q.defer();
            $http.get(url, {
                params: {
                    id: id
                }
            })
                .then(function (response) {
                trimObjectProperties(response.data);
                deferred.resolve(response.data);
            }, function (response) {
                alertFailed(response);
                deferred.reject(response);
            });
            return deferred.promise;
        };
        return {
            getUser: getUser,
            getTypeAheadData: getTypeAheadData,
            saveForm: saveForm,
            getPersons: getPersons,
            addPerson: addPerson,
            getLocation: getLocation,
            getForms: getForms,
            getForm: getForm,
            trimObjectProperties: trimObjectProperties,
            arrayUnique: arrayUnique,
            arrayObjectIndexOf: arrayObjectIndexOf,
            favColorOptions: ['Red', 'Blue', 'Orange', 'Black', 'White'],
            favoriteIceCreamOptions: ['fudge', 'chocolate', 'vanila', 'almond fudge', 'rocky road'],
            states: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']
        };
    };
    service.$inject = ['$http', '$q', 'envService'];
    app.factory("dataService", service);
})(angular.module("repoFormsApp"));
//# sourceMappingURL=Services.js.map