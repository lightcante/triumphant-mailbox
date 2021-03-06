angular.module('app.services', [])

.factory('Auth', function ($http, $location, $window) {

  //submits post request to backend to login.
  var login = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/login',
      data: user
    })
    .then(function (resp) {
      // return resp.data.token;
      $location.path('/');
      return resp.data;
    });
  };

  //submits post request to backend to signup
  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signup',
      data: user
    })
    .then(function (resp) {
      $location.path('/');
      return resp.data;
    });
  };

  //checks to see if user has token
  var isAuth = function () {
    return !!$window.localStorage.getItem('com.app');
  };

  //signouts out users
  //redirects user to login page
  var signout = function () {
    $window.localStorage.removeItem('com.app');
    $location.path('/login');
  };

  //allows functions to be referenced
  return {
    login: login,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };
})

.service('Court', function ($http){
  // Sets initial data for courts partial
  // Can possibly be removed now
  this.currentCourtData = {};

  // Attempts to find if an object returned
  // by Google Places API is in our database
  this.getCourtInfo = function(court) {
    return $http({
      method: 'GET',
      url: '/api/court/findCourt',
      params: court
    })
    .then(function(response){
      return response.data;
    });
  };

  this.getRSVPs = function(results, cb) {
    var rsvpInfo;
    // if(results.id){
      // send a request to get all the rsvp's for that court
      $http({
        method: 'GET',
        url: '/api/court/'+results.id+'/rsvp'
      })
      .then(function (response){
        var rsvps = response.data;
        console.log('getRSVPs rsvps:', rsvps);

        var rsvpsByTime = {};
        //going through all rsvps returned back for a given court
        /* This process is grouping each rsvp by group time
           and providing a count for each rvsp at the same time */
        for(var i = 0; i < rsvps.length; i ++){
          if(!rsvpsByTime[rsvps[i]["starttime"]]) {
            rsvpsByTime[rsvps[i]["starttime"]]= 1;
          } else {
            rsvpsByTime[rsvps[i]["starttime"]]= rsvpsByTime[rsvps[i]["starttime"]]+1;
          }
        }

        // Placing the objects containing a start time and the number of people
        // rsvp'd for that start time into an array that will be
        // displayed in the Court partial
        var blankArray = [];
        for(var key in rsvpsByTime){
          var starttime = key;
          var endtime = key + 1;
          blankArray.push({starttime: starttime, count: rsvpsByTime[key]});
        }
        // that.currentCourtData.schedule = blankArray;
        rsvpInfo = blankArray;
        console.log('final rsvpInfo', rsvpInfo);
        cb(rsvpInfo);
      })
      .catch(function(error){
        return new Error('An error occurred while looking up the schedule: ',error);
      });
    // }
  };


  // Called in the map Controller
  // Sets up the court partial with initial data
  // when a marker is clicked on and if it exists
  // in our database, returns all applicable RSVP's.
  this.getCourtSchedule = function(court, cb) {
    // Set the this variable because .then will execute in global context
    var that = this;
    var scheduleInfo = {};

    // Retrieves either data in our database or data directly
    // from the Google Places query (retrieved in map.js)
    this.getCourtInfo(court)
    .then(function(results){
      console.log('getCourtSchedule results', results);

      // scheduleInfo.name = results.name;
      // scheduleInfo.address = results.address;

      // Sets the currentCourt data held in the Court service
      // This populates courtPartial
      // that.currentCourtData.name = results.name;
      // that.currentCourtData.address = results.address;
      // that.currentCourtData.schedule = [];
      // that.currentCourtData.id = results.id;
      // that.currentCourtData.placeId = results.placeId;

      // if the results contain a unique id from our database..

    cb(results);
    })
    .catch(function(error){
      return new Error('An error occurred while looking up the schedule: ',error);
    });
  };

  /**
   * [postRsvp description]
   * @param  {[Object]} rsvp [Holds the entered form data from the court partial]
   * @return {[Object]}      [Returns RSVP data from database]
   */
  this.postRsvp = function (rsvp) {
    return $http({
      method: 'POST',
      url: '/api/rsvp/addRsvp',
      data: rsvp
    })
    .then(function (resp) {
      return resp.data;
    });
  };
})


.service('Profile', ['$http', function ($http){

  /**
   * Retrieves RSVP data registered to a user
   * @param  {[Number]} userId [Unique user id in database]
   * @return {[Object]}        [RSVP object returned by sequelize]
   */
  this.getRSVP = function(userId){
    return $http({
      method: 'GET',
      url: '/api/rsvp/'+userId,
    })
    .then(function (response){
      return response.data;
    });
  };
}]);