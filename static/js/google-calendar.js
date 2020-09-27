const CLIENT_ID='139516380448-cl7386taph2j5p6j0o44k6j5gi6s9uu2.apps.googleusercontent.com'
const CLIENT_SECRECT='1Zv-IdBpt8b8WFGtLciVhZI1'
const API_KEY='AIzaSyDwpPlLe4gcNbUphA1zJYhIQCQhtFmlcWo'
/*
const CLIENT_ID = '1007682027010-qf7id5o76np5h99uu525pl0dhbr4uhqc.apps.googleusercontent.com';
const CLIENT_SECRET = 'QS5HQNOwLp3kWgPz1LgRkj23';
const API_KEY = 'AIzaSyAXa7FQG4AZlgnGX1v18vKh2xZG-fAsNdc';*/

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

const GoogleCalendar = {
  initAPI: function(){
    return new Promise((resolve, reject) =>
      gapi.load('client:auth2', resolve)
    );
  },
  login: function(){
    let raiseErrorNotAuth = () => {throw 'No User Authorization'};
    return gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
      }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn
            .listen(isSignedIn => !isSignedIn && raiseErrorNotAuth());

        // Handle the initial sign-in state.
        const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
        if(!isSignedIn) raiseErrorNotAuth();
      }, function(error) {
        console.log(JSON.stringify(error, null, 2));
        raiseErrorNotAuth();
      });
  },
  listCalendars: function(){
    return gapi.client.calendar.calendarList.list({})
  },
  listEvents: function(startDate, length){
    return gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (startDate || new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': length || 10,
          'orderBy': 'startTime'
        }) //response.result.items
  }
}
